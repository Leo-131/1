window.DAILY_AUTOMATION_EXECUTION_LATEST = {
  "ok": false,
  "error": "auto-run-daily timed out after 300000ms",
  "completedAt": "2026-07-17T10:19:52.402Z",
  "executionPhase": "browser_execution_timeout",
  "chromeOpened": true,
  "customerDevelopmentPerformed": false,
  "customerMessageSent": false,
  "realDevelopmentCount": 0,
  "reportingVerdict": "no_customer_development_performed",
  "progress": {
    "startedAt": "2026-07-17T10:14:55.169Z",
    "queueDate": "2026-07-17",
    "queueSource": "dailyQueue",
    "dailyQueueCount": 82,
    "candidateCount": 29,
    "executableCount": 29,
    "skippedCount": 106,
    "limit": 100,
    "currentIndex": 6,
    "currentItem": {
      "id": "google-customer-torpedo7-facebook",
      "company": "Torpedo7",
      "action": "develop",
      "platform": "facebook",
      "targetUrl": "https://www.facebook.com/Torpedo7"
    },
    "completedCount": 5,
    "confirmedSendCount": 0,
    "preparedWebsiteCount": 0,
    "lastResult": {
      "id": "google-customer-the-last-hunt-facebook",
      "company": "The Last Hunt",
      "sendStatus": "approval_pending",
      "evidence": "driver_error: Command failed: C:\\Program Files\\nodejs\\node.exe E:\\New project\\outreach-dashboard\\codex-chrome-driver.js prepare-social-draft {\"port\":9224,\"tabId\":\"1CCE90B7D6979A3F132682663CB2A379\",\"targetUrl\":\"https://www.facebook.com/thelasthunt\",\"expectedCompany\":\"The Last Hunt\",\"draft\":\"Hi The Last Hunt team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"autoSend\":true,\"autoEngage\":true,\"engagementComment\":\"Great outdoor checklist. Useful reminder for hikers preparing a complete, lightweight kit.\",\"replaceExistingDraft\":true}\n"
    }
  },
  "blockerSummary": [
    {
      "reason": "browser_execution_timeout",
      "count": 1,
      "examples": [
        {
          "id": "google-customer-torpedo7-facebook",
          "company": "Torpedo7",
          "action": "develop",
          "platform": "facebook",
          "targetUrl": "https://www.facebook.com/Torpedo7"
        }
      ]
    }
  ],
  "blockerCounts": {
    "browser_execution_timeout": 1
  },
  "queueGoalStatus": {
    "target": 100,
    "potentialPool": 82,
    "queueCount": 82,
    "googleDiscovered": 58,
    "refillNeeded": 18,
    "reached": false,
    "action": "Add more verified high-ICP sources or unblock existing website/social leads."
  },
  "recoveryHint": "Refill the high-ICP pool with 18 verified leads or unblock existing website/social leads before the next run. Retry with a smaller DAILY_EXECUTE_LIMIT or inspect the current browser page before rerunning social outreach.",
  "recoveryActions": [
    {
      "reason": "daily_queue_goal_not_reached",
      "action": "Refill high-ICP customer pool",
      "description": "Add or unblock 18 verified high-ICP leads to reach the daily 100 target.",
      "hint": "Refill the high-ICP pool with 18 verified leads or unblock existing website/social leads before the next run.",
      "target": 100,
      "potentialPool": 82,
      "refillNeeded": 18
    },
    {
      "reason": "browser_execution_timeout",
      "action": "Reduce browser execution batch",
      "description": "Retry with a smaller DAILY_EXECUTE_LIMIT or inspect the current social page that timed out.",
      "hint": "Retry with a smaller DAILY_EXECUTE_LIMIT or inspect the current browser page before rerunning social outreach."
    }
  ]
};
