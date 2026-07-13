window.DAILY_AUTOMATION_EXECUTION_LATEST = {
  "ok": false,
  "skippedOnly": true,
  "executionPhase": "no_executable_tasks",
  "chromeStage": "not_started",
  "chromeOpened": false,
  "chromeOpenedCount": 0,
  "customerDevelopmentPerformed": false,
  "customerMessageSent": false,
  "realDevelopmentCount": 0,
  "reportingVerdict": "no_customer_development_performed",
  "userVisibleStatus": "Customer development was not performed. Blockers: marketing_attachment_missing (1); profile_valid_no_message_button (1).",
  "recoveryHint": "Configure WEBSITE_MARKETING_FILE or MARKETING_ATTACHMENT_PATH with an approved marketing attachment before rerunning website-contact outreach. Use a verified alternate channel because the current social profile has no safe message button.",
  "recoveryActions": [
    {
      "reason": "marketing_attachment_missing",
      "hint": "Configure WEBSITE_MARKETING_FILE or MARKETING_ATTACHMENT_PATH with an approved marketing attachment before rerunning website-contact outreach."
    },
    {
      "reason": "profile_valid_no_message_button",
      "hint": "Use a verified alternate channel because the current social profile has no safe message button."
    }
  ],
  "error": "No executable tasks. Website-contact, social, cooldown, exclusive-agency, and verification safety gates left nothing safe to prepare.",
  "skipped": [
    {
      "id": "google-customer-summit-international-website-contact",
      "company": "Summit International",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "verified-Instagram-triedandtrout",
      "company": "Tried & Trout Supply Co",
      "action": "retry_or_alternate_channel",
      "reason": "profile_valid_no_message_button"
    }
  ],
  "blockerSummary": [
    {
      "reason": "marketing_attachment_missing",
      "status": "skipped",
      "count": 1
    },
    {
      "reason": "profile_valid_no_message_button",
      "status": "skipped",
      "count": 1
    }
  ],
  "blockerCounts": {
    "marketing_attachment_missing": 1,
    "profile_valid_no_message_button": 1
  },
  "summary": {
    "totalLeads": 16,
    "highIcp": 16,
    "readyToDevelop": 0,
    "dueNow": 1,
    "potentialPool": 1,
    "potentialPoolTarget": 100,
    "customerTableHighIcp": 0,
    "refillNeeded": 99,
    "googleDiscovered": 1,
    "facebookDiscovered": 0,
    "websiteContactDiscovered": 1,
    "scheduledLater": 1,
    "cooldown": 30,
    "emailPriority": 0,
    "openAgencyMarket": 15,
    "exclusiveAgencySkipped": 1,
    "needsVerification": 0,
    "retainedLowIcp": 0
  },
  "completedAt": "2026-07-13T08:04:11.596Z"
};
