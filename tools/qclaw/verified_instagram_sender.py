import argparse
import json
import random
import time
import urllib.request
from datetime import datetime
from pathlib import Path

from outreach_safety import validate_execution_target, validate_task


CDP_PORT = 28999
WORKSPACE = Path(__file__).resolve().parent


def is_followup_eligible(task):
    return bool(task.get("followup_mode")) and str(task.get("original_status", "")).lower() == "replied"


def build_followup_message(task):
    company = str(task.get("company") or task.get("account_handle") or "your team").strip()
    return (
        f"Hi {company} team, following up on our previous conversation. "
        "FLEXTAIL develops compact outdoor power and camping products for retailers and distributors. "
        "Could you share the best buyer or partnership contact so I can send the product and margin summary "
        "to the right person? Email, WhatsApp, or WeChat is perfect. Thanks, David"
    )


class CDPPage:
    def __init__(self, ws_url):
        import websocket

        self.ws = websocket.create_connection(ws_url, timeout=30)
        self.message_id = 1

    def command(self, method, params=None):
        current_id = self.message_id
        self.message_id += 1
        payload = {"id": current_id, "method": method}
        if params:
            payload["params"] = params
        self.ws.send(json.dumps(payload))
        while True:
            message = json.loads(self.ws.recv())
            if message.get("id") == current_id:
                return message

    def evaluate(self, expression):
        response = self.command(
            "Runtime.evaluate",
            {"expression": expression, "returnByValue": True, "awaitPromise": True},
        )
        return response.get("result", {}).get("result", {}).get("value")

    def navigate(self, url):
        self.command("Page.navigate", {"url": url})
        time.sleep(5)

    def close(self):
        self.ws.close()


def instagram_page():
    pages = json.loads(
        urllib.request.urlopen(f"http://127.0.0.1:{CDP_PORT}/json/list", timeout=5)
        .read()
        .decode("utf-8")
    )
    for page in pages:
        if page.get("type") == "page" and "instagram.com" in page.get("url", ""):
            return page
    raise RuntimeError("Instagram page is not open in the Qclaw automation browser")


def send_one(page, task):
    validation = validate_task(task)
    if not validation["sendable"]:
        return {"status": "blocked", "reasons": validation["reasons"]}
    if not is_followup_eligible(task):
        return {"status": "review_only", "reasons": ["only replied follow-ups are eligible"]}

    page.navigate(task["target_url"])
    current_url = page.evaluate("window.location.href")
    target_check = validate_execution_target(task, current_url)
    if not target_check["matched"]:
        return {"status": "target_mismatch", **target_check}

    profile_text = page.evaluate("(document.body && document.body.innerText || '').slice(0,2000)")
    if task["account_handle"].lower() not in str(profile_text).lower():
        return {"status": "profile_not_confirmed", "url": current_url}

    click_result = page.evaluate(
        """
        (() => {
          const items=[...document.querySelectorAll('button,[role="button"],a')];
          const target=items.find(el => {
            const text=(el.innerText||'').trim().toLowerCase();
            return text==='message' || text==='发消息' || text==='消息';
          });
          if(!target) return 'message_button_not_found';
          target.click();
          return 'clicked';
        })()
        """
    )
    if click_result != "clicked":
        return {"status": "message_button_not_found"}
    time.sleep(4)

    focus_result = page.evaluate(
        """
        (() => {
          const candidates=[...document.querySelectorAll(
            'div[contenteditable="true"],div[data-lexical-editor="true"],textarea,[role="textbox"]'
          )].filter(el => el.offsetParent !== null);
          const input=candidates[candidates.length-1];
          if(!input) return 'input_not_found';
          input.focus();
          input.click();
          return 'focused';
        })()
        """
    )
    if focus_result != "focused":
        return {"status": "input_not_found"}

    message = build_followup_message(task)
    page.command("Input.insertText", {"text": message})
    time.sleep(1)
    page.command(
        "Input.dispatchKeyEvent",
        {"type": "keyDown", "key": "Enter", "code": "Enter", "windowsVirtualKeyCode": 13, "nativeVirtualKeyCode": 13},
    )
    page.command(
        "Input.dispatchKeyEvent",
        {"type": "keyUp", "key": "Enter", "code": "Enter", "windowsVirtualKeyCode": 13, "nativeVirtualKeyCode": 13},
    )
    time.sleep(5)

    confirmation = page.evaluate(
        f"""
        (() => {{
          const expected={json.dumps(message[-90:])};
          const body=(document.body && document.body.innerText || '');
          const inputs=[...document.querySelectorAll(
            'div[contenteditable="true"],div[data-lexical-editor="true"],textarea,[role="textbox"]'
          )].filter(el => el.offsetParent !== null);
          const input=inputs[inputs.length-1];
          const inputText=input ? (input.innerText || input.value || '').trim() : '';
          return {{messageVisible:body.includes(expected),inputCleared:inputText.length===0,url:location.href}};
        }})()
        """
    )
    if not confirmation.get("messageVisible") or not confirmation.get("inputCleared"):
        return {"status": "send_not_confirmed", "confirmation": confirmation}
    return {
        "status": "sent_confirmed",
        "platform": "instagram",
        "account_handle": task["account_handle"],
        "company": task["company"],
        "target_url": task["target_url"],
        "message": message,
        "timestamp": datetime.now().isoformat(),
        "confirmation": confirmation,
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("tasks", type=Path)
    parser.add_argument("--task-id", type=int)
    parser.add_argument("--all-eligible", action="store_true")
    parser.add_argument("--confirm-send", action="store_true")
    parser.add_argument("--results", type=Path, default=WORKSPACE / "verified_outreach_results_20260609.json")
    args = parser.parse_args()
    if not args.confirm_send:
        raise SystemExit("Live sending requires --confirm-send")

    tasks = json.loads(args.tasks.read_text(encoding="utf-8"))
    if args.task_id is not None:
        tasks = [task for task in tasks if task.get("task_id") == args.task_id]
    elif args.all_eligible:
        tasks = [task for task in tasks if is_followup_eligible(task)]
    else:
        raise SystemExit("Choose --task-id N or --all-eligible")
    if not tasks:
        raise SystemExit("No eligible tasks selected")

    existing = []
    if args.results.exists():
        existing = json.loads(args.results.read_text(encoding="utf-8"))
    sent_handles = {item.get("account_handle") for item in existing if item.get("status") == "sent_confirmed"}

    page = CDPPage(instagram_page()["webSocketDebuggerUrl"])
    try:
        for index, task in enumerate(tasks):
            if task.get("account_handle") in sent_handles:
                continue
            result = {"task_id": task.get("task_id"), **send_one(page, task)}
            existing.append(result)
            args.results.write_text(json.dumps(existing, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
            print(json.dumps(result, ensure_ascii=False))
            if result.get("status") != "sent_confirmed":
                raise SystemExit("Batch stopped because the current send was not confirmed")
            if index < len(tasks) - 1:
                time.sleep(random.randint(25, 45))
    finally:
        page.close()


if __name__ == "__main__":
    main()
