window.DAILY_AUTOMATION_EXECUTION_LATEST = {
  "ok": false,
  "skippedOnly": true,
  "browserTransportRequested": "codex-extension-first",
  "browserTransportUsed": "none",
  "browserTransportFallbackReason": "",
  "extensionReceiptCount": 0,
  "executionPhase": "no_executable_tasks",
  "chromeStage": "not_started",
  "chromeOpened": false,
  "chromeOpenedCount": 0,
  "customerDevelopmentPerformed": false,
  "customerMessageSent": false,
  "realDevelopmentCount": 0,
  "reportingVerdict": "no_customer_development_performed",
  "userVisibleStatus": "Customer development was not performed. Blockers: verified_executable_channel_missing (16); homepage_only_contact_path_requires_verification (15); website_contact_capability_not_verified (15).",
  "recoveryHint": "Refill the high-ICP pool with 52 verified leads or unblock existing website/social leads before the next run. Verify the recipient as an official public business email before enabling email outreach. Confirm the official social profile and safe message entry before rerunning Google-discovered social outreach.",
  "recoveryActions": [
    {
      "reason": "daily_queue_goal_not_reached",
      "action": "Refill high-ICP customer pool",
      "description": "Add or unblock 52 verified high-ICP leads to reach the daily 100 target.",
      "hint": "Refill the high-ICP pool with 52 verified leads or unblock existing website/social leads before the next run.",
      "target": 100,
      "potentialPool": 48,
      "refillNeeded": 52
    },
    {
      "reason": "email_target_verification_required",
      "action": "Verify public business email evidence",
      "description": "Use an official website mailto address or a deliverable result from the configured email verifier.",
      "hint": "Verify the recipient as an official public business email before enabling email outreach.",
      "requiredEnv": [
        "HUNTER_API_KEY",
        "ZEROBOUNCE_API_KEY",
        "NEVERBOUNCE_API_KEY"
      ]
    },
    {
      "reason": "google_social_profile_not_executable",
      "action": "Complete Google social channel verification",
      "description": "Confirm the official social profile and safe message entry before rerunning Google-discovered social outreach.",
      "hint": "Confirm the official social profile and safe message entry before rerunning Google-discovered social outreach."
    }
  ],
  "error": "No executable tasks. Website-contact, social, cooldown, exclusive-agency, and verification safety gates left nothing safe to prepare.",
  "skipped": [
    {
      "id": "google-customer-esprinet-group-website-contact",
      "company": "Esprinet Group",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-left-point-distribution-website-contact",
      "company": "Left Point Distribution",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-fjellsport-website-contact",
      "company": "Fjellsport",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-varuste-website-contact",
      "company": "Varuste",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-bergfreunde-website-contact",
      "company": "Bergfreunde",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-obelink-website-contact",
      "company": "Obelink",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-au-vieux-campeur-website-contact",
      "company": "Au Vieux Campeur",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-alpinetrek-website-contact",
      "company": "Alpinetrek",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-de-wit-schijndel-website-contact",
      "company": "De Wit Schijndel",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-ekosport-website-contact",
      "company": "Ekosport",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-above-and-beyond-website-contact",
      "company": "Above and Beyond",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-campz-website-contact",
      "company": "Campz",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-ld-mountain-centre-website-contact",
      "company": "LD Mountain Centre",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-outdoorxl-website-contact",
      "company": "OutdoorXL",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-rock-creek-website-contact",
      "company": "Rock/Creek",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-outdoor-specialist-website-contact",
      "company": "Outdoor Specialist",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-next-adventure-website-contact",
      "company": "Next Adventure",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-bbq-fans-website-contact",
      "company": "BBQ Fans",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-tractor-supply-company-website-contact",
      "company": "Tractor Supply Company",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-rona-website-contact",
      "company": "RONA",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-bivouac-outdoor-website-contact",
      "company": "Bivouac Outdoor",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-wildfire-sports-website-contact",
      "company": "Wildfire Sports",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-outdoor-nature-website-contact",
      "company": "Outdoor Nature",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-intersport-norway-facebook",
      "company": "Intersport Norway",
      "action": "develop",
      "platform": "facebook",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-above-and-beyond-facebook",
      "company": "Above and Beyond",
      "action": "develop",
      "platform": "facebook",
      "reason": "social_profile_not_first_party_verified"
    },
    {
      "id": "google-customer-campz-facebook",
      "company": "Campz",
      "action": "develop",
      "platform": "facebook",
      "reason": "social_profile_not_first_party_verified"
    },
    {
      "id": "google-customer-ld-mountain-centre-facebook",
      "company": "LD Mountain Centre",
      "action": "develop",
      "platform": "facebook",
      "reason": "social_profile_not_first_party_verified"
    },
    {
      "id": "google-customer-bergfreunde-instagram",
      "company": "Bergfreunde",
      "action": "develop",
      "platform": "instagram",
      "reason": "social_profile_not_first_party_verified"
    },
    {
      "id": "google-customer-above-and-beyond-instagram",
      "company": "Above and Beyond",
      "action": "develop",
      "platform": "instagram",
      "reason": "social_profile_not_first_party_verified"
    },
    {
      "id": "google-customer-campz-instagram",
      "company": "Campz",
      "action": "develop",
      "platform": "instagram",
      "reason": "social_profile_not_first_party_verified"
    },
    {
      "id": "google-customer-ld-mountain-centre-instagram",
      "company": "LD Mountain Centre",
      "action": "develop",
      "platform": "instagram",
      "reason": "social_profile_not_first_party_verified"
    },
    {
      "id": "sheet_1779293110195_9myxa520z",
      "company": "ARROW TIRE DISTRIBUTORS",
      "action": "email_priority",
      "platform": "email",
      "reason": "public_business_email_requires_verification"
    },
    {
      "id": "sheet_1779293110195_u24j2gdmq",
      "company": "FAUNA OUTDOOR",
      "action": "email_priority",
      "platform": "email",
      "reason": "public_business_email_requires_verification"
    },
    {
      "id": "sheet_1779293110195_g0uwgglwc",
      "company": "JOHN DOYLE DISTRIBUTORS",
      "action": "email_priority",
      "platform": "email",
      "reason": "public_business_email_requires_verification"
    },
    {
      "id": "google-customer-atmosphere-website-contact",
      "company": "Atmosphere",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-eastern-mountain-sports-website-contact",
      "company": "Eastern Mountain Sports",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-moosejaw-website-contact",
      "company": "Moosejaw",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-latulippe-website-contact",
      "company": "Latulippe",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-the-great-outdoor-shop-website-contact",
      "company": "The Great Outdoor Shop",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-atmosphere-facebook",
      "company": "Atmosphere",
      "action": "develop",
      "platform": "facebook",
      "reason": "social_profile_not_first_party_verified"
    },
    {
      "id": "google-customer-eastern-mountain-sports-facebook",
      "company": "Eastern Mountain Sports",
      "action": "develop",
      "platform": "facebook",
      "reason": "social_profile_not_first_party_verified"
    },
    {
      "id": "google-customer-moosejaw-facebook",
      "company": "Moosejaw",
      "action": "develop",
      "platform": "facebook",
      "reason": "social_profile_not_first_party_verified"
    },
    {
      "id": "google-customer-atmosphere-instagram",
      "company": "Atmosphere",
      "action": "develop",
      "platform": "instagram",
      "reason": "social_profile_not_first_party_verified"
    },
    {
      "id": 23,
      "company": "Ace Hardware",
      "action": "verify_target",
      "platform": "research",
      "reason": "verified_executable_channel_missing"
    },
    {
      "id": 7,
      "company": "AutoZone",
      "action": "verify_target",
      "platform": "research",
      "reason": "verified_executable_channel_missing"
    },
    {
      "id": 10,
      "company": "Backcountry.com",
      "action": "verify_target",
      "platform": "research",
      "reason": "verified_executable_channel_missing"
    },
    {
      "id": 20,
      "company": "Harbor Freight",
      "action": "verify_target",
      "platform": "research",
      "reason": "verified_executable_channel_missing"
    },
    {
      "id": 6,
      "company": "L.L.Bean",
      "action": "verify_target",
      "platform": "research",
      "reason": "verified_executable_channel_missing"
    },
    {
      "id": 17,
      "company": "Target",
      "action": "verify_target",
      "platform": "research",
      "reason": "verified_executable_channel_missing"
    },
    {
      "id": 22,
      "company": "Thor Industries",
      "action": "verify_target",
      "platform": "research",
      "reason": "verified_executable_channel_missing"
    },
    {
      "id": 13,
      "company": "Walgreens",
      "action": "verify_target",
      "platform": "research",
      "reason": "verified_executable_channel_missing"
    },
    {
      "id": 18,
      "company": "Winnebago",
      "action": "verify_target",
      "platform": "research",
      "reason": "verified_executable_channel_missing"
    },
    {
      "id": 11,
      "company": "Best Buy",
      "action": "verify_target",
      "platform": "research",
      "reason": "verified_executable_channel_missing"
    },
    {
      "id": 9,
      "company": "Canadian Tire",
      "action": "verify_target",
      "platform": "research",
      "reason": "verified_executable_channel_missing"
    },
    {
      "id": 19,
      "company": "MEC (Mountain Equipment Co-op)",
      "action": "verify_target",
      "platform": "research",
      "reason": "verified_executable_channel_missing"
    },
    {
      "id": 16,
      "company": "Airstream",
      "action": "verify_target",
      "platform": "research",
      "reason": "verified_executable_channel_missing"
    },
    {
      "id": 5,
      "company": "Pacific Outdoor Group",
      "action": "verify_target",
      "platform": "research",
      "reason": "verified_executable_channel_missing"
    },
    {
      "id": 14,
      "company": "Rural King",
      "action": "verify_target",
      "platform": "research",
      "reason": "verified_executable_channel_missing"
    },
    {
      "id": 21,
      "company": "RVDA (RV Dealers Association)",
      "action": "verify_target",
      "platform": "research",
      "reason": "verified_executable_channel_missing"
    },
    {
      "id": "google-customer-bergfreunde-website-contact",
      "company": "Bergfreunde",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-au-vieux-campeur-website-contact",
      "company": "Au Vieux Campeur",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-alpinetrek-website-contact",
      "company": "Alpinetrek",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-de-wit-schijndel-website-contact",
      "company": "De Wit Schijndel",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-ekosport-website-contact",
      "company": "Ekosport",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-above-and-beyond-website-contact",
      "company": "Above and Beyond",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-campz-website-contact",
      "company": "Campz",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-ld-mountain-centre-website-contact",
      "company": "LD Mountain Centre",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-outdoorxl-website-contact",
      "company": "OutdoorXL",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-outdoor-specialist-website-contact",
      "company": "Outdoor Specialist",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-atmosphere-website-contact",
      "company": "Atmosphere",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-eastern-mountain-sports-website-contact",
      "company": "Eastern Mountain Sports",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-moosejaw-website-contact",
      "company": "Moosejaw",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-latulippe-website-contact",
      "company": "Latulippe",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-the-great-outdoor-shop-website-contact",
      "company": "The Great Outdoor Shop",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    }
  ],
  "blockerSummary": [
    {
      "reason": "verified_executable_channel_missing",
      "status": "skipped",
      "count": 16
    },
    {
      "reason": "homepage_only_contact_path_requires_verification",
      "status": "skipped",
      "count": 15
    },
    {
      "reason": "website_contact_capability_not_verified",
      "status": "skipped",
      "count": 15
    },
    {
      "reason": "official_website_contact_channel",
      "status": "skipped",
      "count": 12
    },
    {
      "reason": "social_profile_not_first_party_verified",
      "status": "skipped",
      "count": 11
    },
    {
      "reason": "public_business_email_requires_verification",
      "status": "skipped",
      "count": 3
    },
    {
      "reason": "concrete_google_discovered_major_customer_facebook",
      "status": "skipped",
      "count": 1
    },
    {
      "reason": "official_public_business_email_verified",
      "status": "skipped",
      "count": 1
    }
  ],
  "blockerCounts": {
    "verified_executable_channel_missing": 16,
    "homepage_only_contact_path_requires_verification": 15,
    "website_contact_capability_not_verified": 15,
    "official_website_contact_channel": 12,
    "social_profile_not_first_party_verified": 11,
    "public_business_email_requires_verification": 3,
    "concrete_google_discovered_major_customer_facebook": 1,
    "official_public_business_email_verified": 1
  },
  "queueGoalStatus": {
    "target": 100,
    "potentialPool": 48,
    "queueCount": 59,
    "googleDiscovered": 40,
    "refillNeeded": 52,
    "confirmedToday": 0,
    "reached": false,
    "action": "Add more verified high-ICP sources or unblock existing website/social leads."
  },
  "checkpointAudit": {
    "snapshotPresent": true,
    "snapshotCompleted": true,
    "activeResume": false,
    "terminalTaskCount": 0,
    "rule": "completed checkpoints are ignored; only terminal results from an active interrupted checkpoint suppress their exact task id"
  },
  "candidateSelectionAudit": [
    {
      "id": "google-customer-esprinet-group-website-contact",
      "company": "Esprinet Group",
      "action": "email_priority",
      "platform": "website_form",
      "readiness": {
        "ready": true,
        "gate": "official_supplier_route",
        "evidenceUrl": "https://www.esprinet.com/en/become-a-supplier/"
      },
      "hasTarget": true,
      "inCandidatePool": false,
      "sameDayCompanyBlocked": false,
      "blockingStatus": "same_day_retry_circuit_open",
      "blockingEvidence": "same_day_retry_circuit_open;failed_attempts:1"
    },
    {
      "id": "google-customer-left-point-distribution-website-contact",
      "company": "Left Point Distribution",
      "action": "email_priority",
      "platform": "website_form",
      "readiness": {
        "ready": true,
        "gate": "official_supplier_route",
        "evidenceUrl": "https://www.leftpointdistribution.com/en-eu/aboutus.php"
      },
      "hasTarget": true,
      "inCandidatePool": false,
      "sameDayCompanyBlocked": false,
      "blockingStatus": "website_failure_circuit_open",
      "blockingEvidence": "website_failure_circuit_open;failed_days:3;window_days:30"
    },
    {
      "id": "google-customer-fjellsport-website-contact",
      "company": "Fjellsport",
      "action": "email_priority",
      "platform": "website_form",
      "readiness": {
        "ready": true,
        "gate": "official_business_email",
        "evidenceUrl": "https://www.fjellsport.no/faq/personvern"
      },
      "hasTarget": true,
      "inCandidatePool": false,
      "sameDayCompanyBlocked": false,
      "blockingStatus": "send_unconfirmed",
      "blockingEvidence": "official_public_business_email;verified_email_auto_send_no_manual_review;alibaba_webmail_session_reused;alibaba_webmail_send_control_verified;alibaba_webmail_send_physical_click_dispatched;alibaba_webmail_composer_closed_after_physical_click;alibaba_mail_send_confirmation_waiting;sent_folder_record_missing;contact_path_strategy_v2"
    },
    {
      "id": "google-customer-varuste-website-contact",
      "company": "Varuste",
      "action": "email_priority",
      "platform": "website_form",
      "readiness": {
        "ready": true,
        "gate": "official_business_email",
        "evidenceUrl": "https://varuste.net/"
      },
      "hasTarget": true,
      "inCandidatePool": false,
      "sameDayCompanyBlocked": false,
      "blockingStatus": "send_unconfirmed",
      "blockingEvidence": "official_public_business_email;verified_email_auto_send_no_manual_review;alibaba_webmail_session_reused;alibaba_webmail_send_control_verified;alibaba_webmail_send_physical_click_dispatched;alibaba_webmail_composer_closed_after_physical_click;alibaba_mail_send_confirmation_waiting;sent_folder_record_missing;contact_path_strategy_v2"
    },
    {
      "id": "google-customer-obelink-website-contact",
      "company": "Obelink",
      "action": "email_priority",
      "platform": "website_form",
      "readiness": {
        "ready": true,
        "gate": "official_supplier_route",
        "evidenceUrl": "https://www.obelink.nl/obelink-partnerprogramma/"
      },
      "hasTarget": true,
      "inCandidatePool": false,
      "sameDayCompanyBlocked": false,
      "blockingStatus": "website_failure_circuit_open",
      "blockingEvidence": "website_failure_circuit_open;failed_days:3;window_days:30"
    },
    {
      "id": "google-customer-rock-creek-website-contact",
      "company": "Rock/Creek",
      "action": "email_priority",
      "platform": "website_form",
      "readiness": {
        "ready": true,
        "gate": "official_business_email",
        "evidenceUrl": "https://www.rockcreek.com/"
      },
      "hasTarget": true,
      "inCandidatePool": false,
      "sameDayCompanyBlocked": false,
      "blockingStatus": "same_day_retry_circuit_open",
      "blockingEvidence": "same_day_retry_circuit_open;failed_attempts:1"
    },
    {
      "id": "google-customer-next-adventure-website-contact",
      "company": "Next Adventure",
      "action": "develop",
      "platform": "website_form",
      "readiness": {
        "ready": true,
        "gate": "official_supplier_route",
        "evidenceUrl": "https://nextadventure.net/"
      },
      "hasTarget": true,
      "inCandidatePool": false,
      "sameDayCompanyBlocked": false,
      "blockingStatus": "same_day_retry_circuit_open",
      "blockingEvidence": "same_day_retry_circuit_open;failed_attempts:1"
    },
    {
      "id": "google-customer-bbq-fans-website-contact",
      "company": "BBQ Fans",
      "action": "email_priority",
      "platform": "website_form",
      "readiness": {
        "ready": true,
        "gate": "official_business_email",
        "evidenceUrl": "https://www.bbqfans.com/become-a-supplier/"
      },
      "hasTarget": true,
      "inCandidatePool": false,
      "sameDayCompanyBlocked": false,
      "blockingStatus": "send_unconfirmed",
      "blockingEvidence": "official_public_business_email;verified_email_auto_send_no_manual_review;alibaba_webmail_session_reused;alibaba_webmail_send_control_verified;alibaba_webmail_send_physical_click_dispatched;alibaba_webmail_composer_closed_after_physical_click;alibaba_mail_send_confirmation_waiting;sent_folder_record_missing;contact_path_strategy_v2"
    },
    {
      "id": "google-customer-tractor-supply-company-website-contact",
      "company": "Tractor Supply Company",
      "action": "email_priority",
      "platform": "website_form",
      "readiness": {
        "ready": true,
        "gate": "official_supplier_route",
        "evidenceUrl": "https://www.tractorsupply.com/"
      },
      "hasTarget": true,
      "inCandidatePool": false,
      "sameDayCompanyBlocked": false,
      "blockingStatus": "website_failure_circuit_open",
      "blockingEvidence": "website_failure_circuit_open;failed_days:3;window_days:30"
    },
    {
      "id": "google-customer-rona-website-contact",
      "company": "RONA",
      "action": "develop",
      "platform": "website_form",
      "readiness": {
        "ready": true,
        "gate": "official_supplier_route",
        "evidenceUrl": "https://vendors.rona.ca/product-supplier"
      },
      "hasTarget": true,
      "inCandidatePool": false,
      "sameDayCompanyBlocked": false,
      "blockingStatus": "website_failure_circuit_open",
      "blockingEvidence": "website_failure_circuit_open;failed_days:3;window_days:30"
    },
    {
      "id": "google-customer-bivouac-outdoor-website-contact",
      "company": "Bivouac Outdoor",
      "action": "email_priority",
      "platform": "website_form",
      "readiness": {
        "ready": true,
        "gate": "official_business_email",
        "evidenceUrl": "https://www.bivouac.co.nz/"
      },
      "hasTarget": true,
      "inCandidatePool": false,
      "sameDayCompanyBlocked": false,
      "blockingStatus": "send_unconfirmed",
      "blockingEvidence": "official_public_business_email;alibaba_webmail_session_reused;alibaba_webmail_send_clicked;alibaba_mail_send_confirmation_waiting;sent_folder_record_missing;contact_path_strategy_v2"
    },
    {
      "id": "google-customer-wildfire-sports-website-contact",
      "company": "Wildfire Sports",
      "action": "email_priority",
      "platform": "website_form",
      "readiness": {
        "ready": true,
        "gate": "official_business_email",
        "evidenceUrl": "https://www.wildfiresports.com.au/contact-us"
      },
      "hasTarget": true,
      "inCandidatePool": false,
      "sameDayCompanyBlocked": false,
      "blockingStatus": "send_unconfirmed",
      "blockingEvidence": "official_public_business_email;alibaba_webmail_session_reused;alibaba_webmail_send_clicked;alibaba_mail_send_confirmation_waiting;sent_folder_record_missing;contact_path_strategy_v2"
    },
    {
      "id": "google-customer-outdoor-nature-website-contact",
      "company": "Outdoor Nature",
      "action": "email_priority",
      "platform": "website_form",
      "readiness": {
        "ready": true,
        "gate": "official_supplier_route",
        "evidenceUrl": "https://www.outdoornature.com.au/become-a-supplier/"
      },
      "hasTarget": true,
      "inCandidatePool": false,
      "sameDayCompanyBlocked": false,
      "blockingStatus": "website_failure_circuit_open",
      "blockingEvidence": "website_failure_circuit_open;failed_days:3;window_days:30"
    },
    {
      "id": "google-customer-intersport-norway-facebook",
      "company": "Intersport Norway",
      "action": "develop",
      "platform": "facebook",
      "readiness": {
        "ready": true,
        "gate": "first_party_verified_social",
        "evidenceUrl": "https://www.intersport.no/"
      },
      "hasTarget": true,
      "inCandidatePool": false,
      "sameDayCompanyBlocked": false,
      "blockingStatus": "failed_open",
      "blockingEvidence": "facebook_profile_no_message_button"
    }
  ],
  "summary": {
    "totalLeads": 16,
    "highIcp": 16,
    "readyToDevelop": 14,
    "dueNow": 59,
    "visibleTodayQueue": 22,
    "potentialPool": 48,
    "potentialPoolTarget": 100,
    "customerTableHighIcp": 19,
    "refillNeeded": 52,
    "executableCompanies": 14,
    "executableReserveTarget": 130,
    "executableReserveNeeded": 116,
    "executableByChannel": {
      "facebook": 1,
      "website_form": 13
    },
    "verifiedSocialCompanies": 1,
    "verifiedSocialReserveTarget": 20,
    "verifiedSocialReserveNeeded": 19,
    "enrichmentBacklogCount": 34,
    "googleDiscovered": 40,
    "facebookDiscovered": 7,
    "websiteContactDiscovered": 0,
    "scheduledLater": 0,
    "cooldown": 30,
    "emailPriority": 0,
    "openAgencyMarket": 15,
    "exclusiveAgencySkipped": 1,
    "needsVerification": 0,
    "retainedLowIcp": 0
  },
  "bounceReconciliation": {
    "ok": true,
    "reason": "no_recent_bounces",
    "scanned": 0,
    "updated": 0
  },
  "completedAt": "2026-08-12T08:27:23.013Z"
};
