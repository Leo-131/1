window.DAILY_AUTOMATION_EXECUTION_LATEST = {
  "ok": false,
  "error": "auto-run-daily timed out after 900000ms",
  "completedAt": "2026-07-17T03:16:26.263Z",
  "executionPhase": "browser_execution_timeout",
  "chromeOpened": true,
  "customerDevelopmentPerformed": false,
  "customerMessageSent": false,
  "realDevelopmentCount": 0,
  "reportingVerdict": "no_customer_development_performed",
  "progress": {
    "startedAt": "2026-07-17T03:01:28.509Z",
    "queueDate": "2026-07-17",
    "queueSource": "dailyQueue",
    "dailyQueueCount": 83,
    "candidateCount": 43,
    "executableCount": 43,
    "skippedCount": 80,
    "limit": 100,
    "currentIndex": 10,
    "currentItem": {
      "id": "google-customer-sport-conrad-facebook",
      "company": "Sport Conrad",
      "action": "develop",
      "platform": "facebook",
      "targetUrl": "https://www.facebook.com/SportConrad"
    },
    "completedCount": 9,
    "confirmedSendCount": 0,
    "preparedWebsiteCount": 0,
    "lastResult": {
      "id": "google-customer-rock-creek-facebook",
      "company": "Rock/Creek",
      "sendStatus": "failed_open",
      "evidence": "instagram_message_button_clicked_composer_not_found"
    }
  },
  "blockerSummary": [
    {
      "reason": "browser_execution_timeout",
      "count": 1,
      "examples": [
        {
          "id": "google-customer-sport-conrad-facebook",
          "company": "Sport Conrad",
          "action": "develop",
          "platform": "facebook",
          "targetUrl": "https://www.facebook.com/SportConrad"
        }
      ]
    }
  ],
  "blockerCounts": {
    "browser_execution_timeout": 1
  },
  "queueGoalStatus": {
    "target": 100,
    "potentialPool": 83,
    "queueCount": 83,
    "googleDiscovered": 59,
    "refillNeeded": 17,
    "reached": false,
    "action": "Add more verified high-ICP sources or unblock existing website/social leads."
  },
  "recoveryHint": "Refill the high-ICP pool with 17 verified leads or unblock existing website/social leads before the next run. Retry with a smaller DAILY_EXECUTE_LIMIT or inspect the current browser page before rerunning social outreach.",
  "recoveryActions": [
    {
      "reason": "daily_queue_goal_not_reached",
      "action": "Refill high-ICP customer pool",
      "description": "Add or unblock 17 verified high-ICP leads to reach the daily 100 target.",
      "hint": "Refill the high-ICP pool with 17 verified leads or unblock existing website/social leads before the next run.",
      "target": 100,
      "potentialPool": 83,
      "refillNeeded": 17
    },
    {
      "reason": "browser_execution_timeout",
      "action": "Reduce browser execution batch",
      "description": "Retry with a smaller DAILY_EXECUTE_LIMIT or inspect the current social page that timed out.",
      "hint": "Retry with a smaller DAILY_EXECUTE_LIMIT or inspect the current browser page before rerunning social outreach."
    }
  ]
};
