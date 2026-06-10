import unittest

from autonomous_outreach_contract import (
    approved_task,
    random_delay_seconds,
    should_stop_batch,
    validate_evidence,
)


class AutonomousOutreachContractTests(unittest.TestCase):
    def fixture(self, **patch):
        task = {
            "task_id": "ig-campmor-1",
            "state": "approved",
            "platform": "instagram",
            "target_url": "https://www.instagram.com/campmor/",
            "account_handle": "campmor",
            "approved_message": "Hello Campmor team",
            "approval_version": 3,
        }
        task.update(patch)
        return task

    def test_only_approved_exact_targets_are_executable(self):
        task = approved_task(self.fixture())
        self.assertEqual(task["account_handle"], "campmor")
        for patch in (
            {"state": "approval_pending"},
            {"target_url": "https://www.instagram.com/another/"},
            {"platform": "facebook"},
            {"approved_message": ""},
        ):
            with self.assertRaises(ValueError):
                approved_task(self.fixture(**patch))

    def test_delay_is_bounded(self):
        for _ in range(200):
            self.assertIn(random_delay_seconds(), range(30, 121))

    def test_unconfirmed_message_is_not_sent(self):
        result = validate_evidence(
            {"targetMatched": True, "messageVisible": False, "inputCleared": True}
        )
        self.assertEqual(result["status"], "send_unconfirmed")
        self.assertEqual(
            validate_evidence(
                {"targetMatched": True, "messageVisible": True, "inputCleared": True}
            )["status"],
            "sent_confirmed",
        )

    def test_batch_stops_on_ambiguous_send_but_not_auto_skip(self):
        self.assertTrue(should_stop_batch("send_unconfirmed"))
        self.assertTrue(should_stop_batch("target_mismatch"))
        self.assertFalse(should_stop_batch("auto_skipped"))


if __name__ == "__main__":
    unittest.main()

