import random
from copy import deepcopy

from outreach_safety import instagram_handle, normalize_url


REQUIRED_APPROVED_FIELDS = {
    "task_id",
    "state",
    "platform",
    "target_url",
    "account_handle",
    "approved_message",
    "approval_version",
}


def approved_task(value):
    task = deepcopy(value) if isinstance(value, dict) else {}
    missing = sorted(field for field in REQUIRED_APPROVED_FIELDS if task.get(field) in (None, ""))
    if missing:
        raise ValueError("missing approved fields: " + ", ".join(missing))
    if task["state"] != "approved":
        raise ValueError("task state must be approved")
    if str(task["platform"]).lower() != "instagram":
        raise ValueError("instagram runner only accepts instagram tasks")

    handle = instagram_handle(task["account_handle"])
    expected = f"https://www.instagram.com/{handle}/" if handle else ""
    if not handle or normalize_url(task["target_url"]) != expected:
        raise ValueError("target URL must exactly match the approved Instagram handle")
    if not isinstance(task["approved_message"], str) or not task["approved_message"].strip():
        raise ValueError("approved message is required")
    if not isinstance(task["approval_version"], int) or task["approval_version"] < 1:
        raise ValueError("approval version must be a positive integer")

    task["platform"] = "instagram"
    task["account_handle"] = handle
    task["target_url"] = expected
    return task


def random_delay_seconds(rng=None):
    generator = rng or random
    return generator.randint(30, 120)


def validate_evidence(value):
    evidence = value if isinstance(value, dict) else {}
    required = ("targetMatched", "messageVisible", "inputCleared")
    confirmed = all(evidence.get(field) is True for field in required)
    return {
        "status": "sent_confirmed" if confirmed else "send_unconfirmed",
        "confirmation": {field: evidence.get(field) is True for field in required},
    }


def should_stop_batch(status):
    return status in {"send_unconfirmed", "target_mismatch", "profile_not_confirmed"}

