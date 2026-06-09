import argparse
import json
from datetime import datetime
from pathlib import Path

from outreach_safety import build_verified_tasks


SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parents[1]
DEFAULT_SOURCE = REPO_ROOT / "outreach-dashboard" / "daily-outreach-fb-ins-2026-06-03.json"


def load_sources(path):
    payload = json.loads(path.read_text(encoding="utf-8"))
    return payload.get("tasks", payload) if isinstance(payload, dict) else payload


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source", type=Path, default=DEFAULT_SOURCE)
    parser.add_argument("--output-dir", type=Path, default=SCRIPT_DIR / "output")
    parser.add_argument("--limit", type=int, default=20)
    parser.add_argument("--date", default=datetime.now().strftime("%Y%m%d"))
    args = parser.parse_args()

    tasks, rejected = build_verified_tasks(load_sources(args.source))
    tasks = tasks[: max(args.limit, 0)]
    for index, task in enumerate(tasks, 1):
        task["task_id"] = index
        task["status"] = "approved_for_dry_run"

    args.output_dir.mkdir(parents=True, exist_ok=True)
    output = args.output_dir / f"verified_tasks_{args.date}.json"
    review = args.output_dir / f"rejected_tasks_{args.date}.json"
    output.write_text(json.dumps(tasks, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    review.write_text(json.dumps(rejected, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    print(f"Approved verified tasks: {len(tasks)}")
    print(f"Rejected/review tasks: {len(rejected)}")
    print(f"Approved file: {output}")
    print(f"Review file: {review}")


if __name__ == "__main__":
    main()
