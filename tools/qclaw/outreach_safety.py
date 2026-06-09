import re
from urllib.parse import urlparse


ALLOWED_PLATFORMS = {"instagram", "facebook"}
MIN_FIT_SCORE = 70


def normalize_platform(value):
    value = str(value or "").strip().lower()
    if value in {"ig", "ins"}:
        return "instagram"
    if value == "fb":
        return "facebook"
    return value


def normalize_url(value):
    value = str(value or "").strip()
    if not value:
        return ""
    parsed = urlparse(value)
    path = re.sub(r"/+", "/", parsed.path).rstrip("/")
    return f"{parsed.scheme.lower()}://{parsed.netloc.lower()}{path}/"


def instagram_handle(value):
    value = str(value or "").strip().lstrip("@")
    if not re.fullmatch(r"[A-Za-z0-9._]{2,30}", value):
        return ""
    return value.lower()


def is_generic_facebook_url(url):
    parsed = urlparse(url)
    path = parsed.path.lower().rstrip("/")
    return (
        parsed.netloc.lower() not in {"facebook.com", "www.facebook.com"}
        or path in {"", "/", "/profile.php"}
        or path.startswith("/reel/")
        or path.startswith("/watch/")
        or path.startswith("/search/")
    )


def validate_task(task):
    platform = normalize_platform(task.get("platform"))
    reasons = []
    target_url = normalize_url(task.get("target_url"))
    verified_platform = normalize_platform(task.get("verified_platform"))
    fit_score = task.get("fit_score")

    if platform not in ALLOWED_PLATFORMS:
        reasons.append("unsupported platform")
    if not target_url or verified_platform != platform:
        reasons.append("verified social target is required")
    if platform == "instagram":
        handle = instagram_handle(task.get("account_handle"))
        expected = f"https://www.instagram.com/{handle}/" if handle else ""
        if not handle or target_url != expected:
            reasons.append("instagram target must match the verified handle")
    if platform == "facebook" and target_url and is_generic_facebook_url(target_url):
        reasons.append("facebook target is generic or non-profile")
    if fit_score is None or float(fit_score) < MIN_FIT_SCORE:
        reasons.append(f"fit score must be at least {MIN_FIT_SCORE}")

    return {"sendable": not reasons, "reasons": reasons}


def source_to_task(source):
    platform = normalize_platform(source.get("verifiedPlatform") or source.get("platform"))
    task = {
        "name": str(source.get("name") or "").strip(),
        "company": str(source.get("company") or "").strip(),
        "platform": platform,
        "verified_platform": platform,
        "fit_score": source.get("fitScore", 0),
        "fit_tier": source.get("fitTier"),
        "followup_mode": bool(source.get("followupMode")),
        "original_status": source.get("originalStatus"),
        "state": source.get("state"),
        "action": source.get("action"),
    }

    if platform == "instagram":
        handle = instagram_handle(source.get("accountHandle") or source.get("handle") or source.get("name"))
        task["account_handle"] = handle
        task["target_url"] = f"https://www.instagram.com/{handle}/" if handle else ""
    elif platform == "facebook":
        task["target_url"] = normalize_url(
            source.get("facebookUrl") or source.get("targetUrl") or source.get("url")
        )

    validation = validate_task(task)
    task["sendable"] = validation["sendable"]
    task["validation_reasons"] = validation["reasons"]
    return task


def build_verified_tasks(sources):
    tasks = []
    rejected = []
    seen = set()

    for source in sources:
        task = source_to_task(source)
        key = (task.get("platform"), normalize_url(task.get("target_url")))
        if key in seen and key[1]:
            rejected.append({**task, "reasons": ["duplicate"]})
            continue
        if key[1]:
            seen.add(key)

        if task["sendable"]:
            tasks.append(task)
        else:
            rejected.append({**task, "reasons": task["validation_reasons"]})

    return tasks, rejected


def validate_execution_target(task, current_url):
    expected = normalize_url(task.get("target_url"))
    actual = normalize_url(current_url)
    matched = bool(expected and expected == actual)
    return {
        "matched": matched,
        "expected": expected,
        "actual": actual,
        "reason": "" if matched else "browser is not on the exact verified profile",
    }
