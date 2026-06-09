import unittest

from outreach_safety import build_verified_tasks, validate_execution_target, validate_task
from safe_outreach_runner import build_dry_run_report


class OutreachSafetyTests(unittest.TestCase):
    def test_rejects_person_name_without_verified_social_target(self):
        result = validate_task(
            {"name": "Daniel Brooks", "company": "Harbor Freight", "platform": "instagram"}
        )
        self.assertFalse(result["sendable"])

    def test_rejects_generic_facebook_destinations(self):
        for target in (
            "https://www.facebook.com/profile.php",
            "https://www.facebook.com/reel/976847155123301",
        ):
            result = validate_task(
                {
                    "name": "Example",
                    "company": "Example Outdoor",
                    "platform": "facebook",
                    "target_url": target,
                    "verified_platform": "facebook",
                    "fit_score": 90,
                }
            )
            self.assertFalse(result["sendable"])

    def test_builds_direct_instagram_task_from_verified_company_handle(self):
        source = {
            "platform": "Instagram",
            "name": "campmor",
            "company": "Campmor US",
            "verifiedPlatform": "instagram",
            "fitScore": 100,
            "fitTier": "A",
            "followupMode": True,
        }
        tasks, rejected = build_verified_tasks([source])
        self.assertEqual(rejected, [])
        self.assertEqual(tasks[0]["target_url"], "https://www.instagram.com/campmor/")

    def test_deduplicates_by_platform_and_target(self):
        source = {
            "platform": "Instagram",
            "name": "campmor",
            "company": "Campmor US",
            "verifiedPlatform": "instagram",
            "fitScore": 100,
        }
        tasks, rejected = build_verified_tasks([source, dict(source)])
        self.assertEqual(len(tasks), 1)
        self.assertIn("duplicate", rejected[0]["reasons"])

    def test_execution_requires_exact_verified_profile(self):
        task = {
            "platform": "instagram",
            "target_url": "https://www.instagram.com/campmor/",
            "account_handle": "campmor",
        }
        self.assertFalse(
            validate_execution_target(task, "https://www.instagram.com/danielbrookss2/")["matched"]
        )
        self.assertTrue(
            validate_execution_target(task, "https://www.instagram.com/campmor/")["matched"]
        )

    def test_dry_run_handles_browser_unavailable(self):
        task = {
            "task_id": 1,
            "platform": "instagram",
            "verified_platform": "instagram",
            "target_url": "https://www.instagram.com/campmor/",
            "account_handle": "campmor",
            "fit_score": 100,
        }
        report = build_dry_run_report([task], pages=None, browser_error="CDP unavailable")
        self.assertEqual(report[0]["status"], "manual_review_required")


if __name__ == "__main__":
    unittest.main()
