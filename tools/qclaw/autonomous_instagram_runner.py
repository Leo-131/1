import argparse
import json
import time
from datetime import datetime
from pathlib import Path

from autonomous_outreach_contract import (
    approved_task,
    random_delay_seconds,
    should_stop_batch,
    validate_evidence,
)
from outreach_safety import validate_execution_target
from verified_instagram_sender import CDPPage, instagram_page


def append_result(path, results, result):
    results.append(result)
    path.write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def dry_run(task):
    normalized = approved_task(task)
    return {
        "task_id": normalized["task_id"],
        "status": "dry_run_ready",
        "target_url": normalized["target_url"],
        "approval_version": normalized["approval_version"],
        "message": normalized["approved_message"],
        "delay_range_seconds": [30, 120],
    }


def execute(page, task):
    task = approved_task(task)
    evidence = {
        "task_id": task["task_id"],
        "approval_version": task["approval_version"],
        "target_url": task["target_url"],
        "stages": [],
    }

    page.navigate(task["target_url"])
    current_url = page.evaluate("window.location.href")
    target_check = validate_execution_target(task, current_url)
    evidence["stages"].append({"stage": "target_verified", **target_check})
    if not target_check["matched"]:
        return {**evidence, "status": "target_mismatch"}

    profile_ok = page.evaluate(
        f"(document.body && document.body.innerText || '').toLowerCase().includes({json.dumps(task['account_handle'])})"
    )
    if not profile_ok:
        return {**evidence, "status": "profile_not_confirmed"}

    like_state = page.evaluate(
        """
        (() => {
          const post=[...document.querySelectorAll('a[href*="/p/"],a[href*="/reel/"]')]
            .find(el => el.offsetParent !== null);
          if(!post) return 'like_skipped_no_relevant_post';
          post.click();
          return 'post_opened';
        })()
        """
    )
    evidence["stages"].append({"stage": "post_like", "result": like_state})
    if like_state == "post_opened":
        time.sleep(3)
        like_state = page.evaluate(
            """
            (() => {
              const unlike=[...document.querySelectorAll('svg[aria-label],button')].find(el =>
                ['Unlike','取消赞'].includes(el.getAttribute('aria-label') || el.innerText || '')
              );
              if(unlike) return 'already_liked';
              const like=[...document.querySelectorAll('svg[aria-label],button')].find(el =>
                ['Like','赞'].includes(el.getAttribute('aria-label') || el.innerText || '')
              );
              const button=like && like.closest('button');
              if(!button) return 'like_control_not_found';
              button.click();
              return 'liked';
            })()
            """
        )
        evidence["stages"].append({"stage": "post_like_result", "result": like_state})
        if like_state == "like_control_not_found":
            return {**evidence, "status": "engagement_unconfirmed"}
        page.navigate(task["target_url"])

    follow_state = page.evaluate(
        """
        (() => {
          const controls=[...document.querySelectorAll('button,[role="button"]')];
          const following=controls.find(el => /^(Following|Requested|已关注|已请求)$/.test((el.innerText||'').trim()));
          if(following) return 'already_following';
          const follow=controls.find(el => /^(Follow|关注)$/.test((el.innerText||'').trim()));
          if(!follow) return 'follow_control_not_found';
          follow.click();
          return 'followed';
        })()
        """
    )
    evidence["stages"].append({"stage": "account_follow", "result": follow_state})
    if follow_state == "follow_control_not_found":
        return {**evidence, "status": "engagement_unconfirmed"}

    delay = random_delay_seconds()
    evidence["stages"].append({"stage": "approval_wait", "seconds": delay})
    time.sleep(delay)
    page.navigate(task["target_url"])
    target_check = validate_execution_target(task, page.evaluate("window.location.href"))
    if not target_check["matched"]:
        return {**evidence, "status": "target_mismatch"}

    opened = page.evaluate(
        """
        (() => {
          const target=[...document.querySelectorAll('button,[role="button"],a')].find(el =>
            /^(Message|发消息|消息)$/.test((el.innerText||'').trim())
          );
          if(!target) return false;
          target.click();
          return true;
        })()
        """
    )
    if not opened:
        return {**evidence, "status": "message_button_not_found"}
    time.sleep(3)

    focused = page.evaluate(
        """
        (() => {
          const items=[...document.querySelectorAll(
            'div[contenteditable="true"],div[data-lexical-editor="true"],textarea,[role="textbox"]'
          )].filter(el => el.offsetParent !== null);
          const input=items[items.length-1];
          if(!input) return false;
          input.focus();
          input.click();
          return true;
        })()
        """
    )
    if not focused:
        return {**evidence, "status": "input_not_found"}

    message = task["approved_message"]
    page.command("Input.insertText", {"text": message})
    page.command(
        "Input.dispatchKeyEvent",
        {"type": "keyDown", "key": "Enter", "code": "Enter", "windowsVirtualKeyCode": 13},
    )
    page.command(
        "Input.dispatchKeyEvent",
        {"type": "keyUp", "key": "Enter", "code": "Enter", "windowsVirtualKeyCode": 13},
    )
    time.sleep(5)
    confirmation = page.evaluate(
        f"""
        (() => {{
          const expected={json.dumps(message[-90:])};
          const body=document.body && document.body.innerText || '';
          const items=[...document.querySelectorAll(
            'div[contenteditable="true"],div[data-lexical-editor="true"],textarea,[role="textbox"]'
          )].filter(el => el.offsetParent !== null);
          const input=items[items.length-1];
          const inputText=input ? (input.innerText || input.value || '').trim() : '';
          return {{
            targetMatched: location.href.startsWith({json.dumps(task["target_url"])}),
            messageVisible: body.includes(expected),
            inputCleared: inputText.length===0
          }};
        }})()
        """
    )
    validated = validate_evidence(confirmation)
    return {
        **evidence,
        **validated,
        "message": message,
        "timestamp": datetime.now().isoformat(),
    }


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("tasks", type=Path)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--task-id")
    parser.add_argument("--all-approved", action="store_true")
    parser.add_argument("--confirm-live-actions", action="store_true")
    parser.add_argument("--results", type=Path, default=Path("autonomous_outreach_results.json"))
    args = parser.parse_args()

    tasks = json.loads(args.tasks.read_text(encoding="utf-8"))
    if isinstance(tasks, dict):
        tasks = tasks.get("tasks", [])
    if args.task_id:
        tasks = [task for task in tasks if str(task.get("task_id")) == args.task_id]
    elif args.all_approved:
        tasks = [task for task in tasks if task.get("state") == "approved"]
    else:
        raise SystemExit("Choose --task-id ID or --all-approved")

    if args.dry_run:
        for task in tasks:
            print(json.dumps(dry_run(task), ensure_ascii=False))
        return
    if not args.confirm_live_actions:
        raise SystemExit("Live like/follow/send requires --confirm-live-actions")

    results = []
    if args.results.exists():
        results = json.loads(args.results.read_text(encoding="utf-8"))
    completed = {
        (item.get("task_id"), item.get("approval_version"))
        for item in results
        if item.get("status") == "sent_confirmed"
    }
    page = CDPPage(instagram_page()["webSocketDebuggerUrl"])
    try:
        for task in tasks:
            key = (task.get("task_id"), task.get("approval_version"))
            if key in completed:
                continue
            result = execute(page, task)
            append_result(args.results, results, result)
            print(json.dumps(result, ensure_ascii=False))
            if should_stop_batch(result.get("status")):
                raise SystemExit("Batch stopped on ambiguous external action")
    finally:
        page.close()


if __name__ == "__main__":
    main()
