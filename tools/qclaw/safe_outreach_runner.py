import argparse
import json
import urllib.request
from pathlib import Path

from outreach_safety import validate_execution_target, validate_task


CDP_PORT = 28999


def browser_pages():
    with urllib.request.urlopen(f"http://127.0.0.1:{CDP_PORT}/json/list", timeout=5) as response:
        return json.loads(response.read().decode("utf-8"))


def matching_page(task, pages):
    for page in pages:
        if validate_execution_target(task, page.get("url"))["matched"]:
            return page
    return None


def build_dry_run_report(tasks, pages, browser_error=""):
    pages = pages or []
    report = []
    for task in tasks:
        validation = validate_task(task)
        page = matching_page(task, pages) if validation["sendable"] else None
        reasons = list(validation["reasons"])
        if validation["sendable"] and not page:
            reasons.append(browser_error or "exact verified profile is not open")
        report.append(
            {
                "task_id": task.get("task_id"),
                "target_url": task.get("target_url"),
                "sendable": validation["sendable"],
                "target_open": bool(page),
                "status": "dry_run_verified" if page else "manual_review_required",
                "reasons": reasons,
            }
        )
    return report


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("tasks", type=Path)
    parser.add_argument("--confirm-send", action="store_true")
    args = parser.parse_args()

    tasks = json.loads(args.tasks.read_text(encoding="utf-8"))
    browser_error = ""
    try:
        pages = browser_pages()
    except Exception as error:
        pages = []
        browser_error = f"CDP unavailable: {error}"
    report = build_dry_run_report(tasks, pages, browser_error)

    report_path = args.tasks.with_name(args.tasks.stem + "_dry_run.json")
    report_path.write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Dry-run checked: {len(report)}")
    print(f"Exact targets open: {sum(1 for item in report if item['target_open'])}")
    print(f"Report: {report_path}")
    if args.confirm_send:
        raise SystemExit("Sending remains disabled until exact-profile message confirmation is implemented and reviewed.")


if __name__ == "__main__":
    main()
