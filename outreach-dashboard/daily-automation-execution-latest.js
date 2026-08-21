window.DAILY_AUTOMATION_EXECUTION_LATEST = {
  "ok": false,
  "browserTransportRequested": "codex-extension-first",
  "browserTransportUsed": "cdp",
  "browserTransportFallbackReason": "extension_bridge_not_available_process_local_cdp",
  "extensionReceiptCount": 0,
  "executionPhase": "browser_execution",
  "chromeStage": "opened",
  "chromeOpened": true,
  "chromeOpenedCount": 1,
  "customerDevelopmentPerformed": false,
  "customerMessageSent": false,
  "realDevelopmentCount": 0,
  "reportingVerdict": "no_customer_development_performed",
  "engine": "Browser transport queue bridge",
  "mode": "serial-single-target",
  "batchMode": "parallel-batches",
  "parallelLimit": 1,
  "limit": 25,
  "queueDate": "2026-08-21",
  "queueSource": "dailyQueue",
  "executed": [
    {
      "id": "google-customer-owens-outdoor-sales-facebook",
      "company": "Owens Outdoor Sales",
      "action": "develop",
      "platform": "facebook",
      "targetUrl": "https://www.facebook.com/OwensOutdoorSales",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-21T07:41:36.832Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://owensoutdoorsales.com/help/contact-us",
        "tabId": "F4FD1976741FEB58DE211493BF0E0DB7",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/F4FD1976741FEB58DE211493BF0E0DB7",
        "title": ""
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://owensoutdoorsales.com/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://owensoutdoorsales.com/help/contact-us",
          "tabId": "F4FD1976741FEB58DE211493BF0E0DB7",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/F4FD1976741FEB58DE211493BF0E0DB7",
          "title": ""
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Owens Outdoor Sales Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Owens Outdoor Sales Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://owensoutdoorsales.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://owensoutdoorsales.com/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://owensoutdoorsales.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://owensoutdoorsales.com/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://owensoutdoorsales.com/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://owensoutdoorsales.com/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}],\"fallbackFrom\":\"https://www.facebook.com/OwensOutdoorSales\",\"fallbackPlatform\":\"email\",\"fallbackReason\":\"facebook_engagement_completed_message_unavailable;facebook_profile_no_message_button;follow_already_active;facebook_post_like_not_available\"}",
        "fallbackFrom": "https://www.facebook.com/OwensOutdoorSales",
        "fallbackPlatform": "email",
        "decision": {
          "verdict": "develop",
          "fitScore": 91,
          "reason": "local_codex_extension_template",
          "draft": "Hi Owens Outdoor Sales team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a distributor/importer, the strongest fit is regional sell-through, channel fit, margin-ready product line, and whether they cover outdoor/travel electronics buyers; your verified outdoor industry manufacturer representative and sales agency focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the owner of distribution evaluation or the best time for a short intro video meeting?"
        },
        "executionLayer": "Chrome CDP fallback",
        "glmModel": "not_used",
        "followup": false
      }
    }
  ],
  "results": [
    {
      "id": "google-customer-owens-outdoor-sales-facebook",
      "company": "Owens Outdoor Sales",
      "action": "develop",
      "platform": "facebook",
      "targetUrl": "https://www.facebook.com/OwensOutdoorSales",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-21T07:41:36.832Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://owensoutdoorsales.com/help/contact-us",
        "tabId": "F4FD1976741FEB58DE211493BF0E0DB7",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/F4FD1976741FEB58DE211493BF0E0DB7",
        "title": ""
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://owensoutdoorsales.com/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://owensoutdoorsales.com/help/contact-us",
          "tabId": "F4FD1976741FEB58DE211493BF0E0DB7",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/F4FD1976741FEB58DE211493BF0E0DB7",
          "title": ""
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Owens Outdoor Sales Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Owens Outdoor Sales Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://owensoutdoorsales.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://owensoutdoorsales.com/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://owensoutdoorsales.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://owensoutdoorsales.com/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://owensoutdoorsales.com/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://owensoutdoorsales.com/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}],\"fallbackFrom\":\"https://www.facebook.com/OwensOutdoorSales\",\"fallbackPlatform\":\"email\",\"fallbackReason\":\"facebook_engagement_completed_message_unavailable;facebook_profile_no_message_button;follow_already_active;facebook_post_like_not_available\"}",
        "fallbackFrom": "https://www.facebook.com/OwensOutdoorSales",
        "fallbackPlatform": "email",
        "decision": {
          "verdict": "develop",
          "fitScore": 91,
          "reason": "local_codex_extension_template",
          "draft": "Hi Owens Outdoor Sales team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a distributor/importer, the strongest fit is regional sell-through, channel fit, margin-ready product line, and whether they cover outdoor/travel electronics buyers; your verified outdoor industry manufacturer representative and sales agency focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the owner of distribution evaluation or the best time for a short intro video meeting?"
        },
        "executionLayer": "Chrome CDP fallback",
        "glmModel": "not_used",
        "followup": false
      }
    }
  ],
  "skipped": [
    {
      "id": "google-customer-13west-website-contact",
      "company": "13west",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-g-b-stumpp-associates-website-contact",
      "company": "G.B. Stumpp & Associates",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-lathrop-associates-website-contact",
      "company": "Lathrop Associates",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-two-skies-inc-website-contact",
      "company": "Two Skies Inc",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-sideways-distribution-website-contact",
      "company": "Sideways Distribution",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-nickel-n-diamond-sales-website-contact",
      "company": "Nickel N Diamond Sales",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-parallel-33-sales-group-website-contact",
      "company": "Parallel 33 Sales Group",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-sales-society-72-website-contact",
      "company": "Sales Society 72",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-dark-blizzard-sales-website-contact",
      "company": "Dark Blizzard Sales",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-nick-landry-sales-website-contact",
      "company": "Nick Landry Sales",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-pfp-and-associates-website-contact",
      "company": "PFP and Associates",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-zia-works-distribution-website-contact",
      "company": "Zia Works Distribution",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-outdoors-ramsey-website-contact",
      "company": "Outdoors Ramsey",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-rock-creek-website-contact",
      "company": "Rock/Creek",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-outdoor-cap-company-website-contact",
      "company": "Outdoor Cap Company",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-black-white-outdoors-website-contact",
      "company": "Black & White Outdoors",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-bbq-fans-website-contact",
      "company": "BBQ Fans",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-fjellsport-website-contact",
      "company": "Fjellsport",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-varuste-website-contact",
      "company": "Varuste",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-rabbit-mountain-mexico-website-contact",
      "company": "Rabbit Mountain Mexico",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-waypoint-outdoor-website-contact",
      "company": "Waypoint Outdoor",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-sanitas-sales-group-website-contact",
      "company": "Sanitas Sales Group",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-sierra-outdoor-collective-website-contact",
      "company": "Sierra Outdoor Collective",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-endless-adventure-sales-website-contact",
      "company": "Endless Adventure Sales",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-level-8-outdoor-website-contact",
      "company": "Level 8 Outdoor",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-the-curtis-group-sales-website-contact",
      "company": "The Curtis Group Sales",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-ascension-sales-group-website-contact",
      "company": "Ascension Sales Group",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-brandywine-river-reps-website-contact",
      "company": "Brandywine River Reps",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-hendrix-outdoors-website-contact",
      "company": "Hendrix Outdoors",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-action-sports-agency-website-contact",
      "company": "Action Sports Agency",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-sturm-mil-tec-usa-website-contact",
      "company": "Sturm Mil-Tec USA",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-esprinet-group-website-contact",
      "company": "Esprinet Group",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-edgeline-collective-website-contact",
      "company": "Edgeline Collective",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-precision-sales-and-marketing-website-contact",
      "company": "Precision Sales and Marketing",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-kelly-brand-management-website-contact",
      "company": "Kelly Brand Management",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-kittredge-and-associates-website-contact",
      "company": "Kittredge and Associates",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-outdoor-industry-group-website-contact",
      "company": "Outdoor Industry Group",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-perpetual-motion-nw-website-contact",
      "company": "Perpetual Motion NW",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-taunton-leisure-website-contact",
      "company": "Taunton Leisure",
      "action": "develop",
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
      "id": "google-customer-tractor-supply-company-website-contact",
      "company": "Tractor Supply Company",
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
      "id": "google-customer-campz-website-contact",
      "company": "Campz",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-intersport-norway-website-contact",
      "company": "Intersport Norway",
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
      "id": "google-customer-outdoor-specialist-website-contact",
      "company": "Outdoor Specialist",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-esprinet-group-linkedin",
      "company": "Esprinet Group",
      "action": "develop",
      "platform": "linkedin",
      "reason": "social_profile_not_first_party_verified"
    },
    {
      "id": "google-customer-front-point-sales-linkedin",
      "company": "Front Point Sales",
      "action": "verify_target",
      "platform": "linkedin",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "google-customer-nohrth-facebook",
      "company": "NOHRTH",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-rabbit-mountain-mexico-facebook",
      "company": "Rabbit Mountain Mexico",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-campz-facebook",
      "company": "Campz",
      "action": "develop",
      "platform": "facebook",
      "reason": "social_profile_not_first_party_verified"
    },
    {
      "id": "google-customer-intersport-norway-facebook",
      "company": "Intersport Norway",
      "action": "develop",
      "platform": "facebook",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-rabbit-mountain-mexico-instagram",
      "company": "Rabbit Mountain Mexico",
      "action": "develop",
      "platform": "instagram",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-bergfreunde-instagram",
      "company": "Bergfreunde",
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
      "id": "google-customer-crf-agency-website-contact",
      "company": "CRF Agency",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-continental-sports-inc-website-contact",
      "company": "Continental Sports Inc",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-our-habit-sales-website-contact",
      "company": "Our Habit Sales",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-canada-outdoors-website-contact",
      "company": "Canada Outdoors",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-bivouac-outdoor-website-contact",
      "company": "Bivouac Outdoor",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-wildfire-sports-website-contact",
      "company": "Wildfire Sports",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-sportco-marketing-website-contact",
      "company": "Sportco Marketing",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-granite-marketing-website-contact",
      "company": "Granite Marketing",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-skyline-sales-consulting-website-contact",
      "company": "Skyline Sales & Consulting",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-suggs-nicholas-shea-website-contact",
      "company": "Suggs-Nicholas-Shea",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-1889-sales-website-contact",
      "company": "1889 Sales",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-c-g-distribution-website-contact",
      "company": "C&G Distribution",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-morrison-sports-marketing-website-contact",
      "company": "Morrison Sports Marketing",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-brm-reps-website-contact",
      "company": "BRM Reps",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-green-drake-outdoors-website-contact",
      "company": "Green Drake Outdoors",
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
      "id": "google-customer-ld-mountain-centre-website-contact",
      "company": "LD Mountain Centre",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-onwardup-website-contact",
      "company": "OnwardUP",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-howe-sound-sales-website-contact",
      "company": "Howe Sound Sales",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-salvation-sales-website-contact",
      "company": "Salvation Sales",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-terra-outdoor-gear-distribution-website-contact",
      "company": "Terra Outdoor Gear Distribution",
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
      "id": "google-customer-sky-lines-website-contact",
      "company": "Sky-Lines",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-nordcore-group-website-contact",
      "company": "NordCore Group",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-tin-shack-ltd-website-contact",
      "company": "Tin Shack Ltd",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-garibaldi-supply-co-website-contact",
      "company": "Garibaldi Supply Co.",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-d-m-a-distributing-website-contact",
      "company": "D.M.A. Distributing",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-gmd-wholesale-website-contact",
      "company": "GMD Wholesale",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-outdoor-gear-canada-website-contact",
      "company": "Outdoor Gear Canada",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-premium-living-products-website-contact",
      "company": "Premium Living Products",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-mutinous-sales-and-marketing-website-contact",
      "company": "Mutinous Sales and Marketing",
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
      "id": "google-customer-atmosphere-website-contact",
      "company": "Atmosphere",
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
      "id": "google-customer-rona-website-contact",
      "company": "RONA",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-outdoor-nature-website-contact",
      "company": "Outdoor Nature",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-front-point-sales-linkedin",
      "company": "Front Point Sales",
      "action": "verify_target",
      "platform": "linkedin",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "google-customer-nohrth-facebook",
      "company": "NOHRTH",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-13west-website-contact",
      "company": "13west",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-g-b-stumpp-associates-website-contact",
      "company": "G.B. Stumpp & Associates",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-lathrop-associates-website-contact",
      "company": "Lathrop Associates",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-two-skies-inc-website-contact",
      "company": "Two Skies Inc",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-sideways-distribution-website-contact",
      "company": "Sideways Distribution",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-nickel-n-diamond-sales-website-contact",
      "company": "Nickel N Diamond Sales",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-parallel-33-sales-group-website-contact",
      "company": "Parallel 33 Sales Group",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-sales-society-72-website-contact",
      "company": "Sales Society 72",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-dark-blizzard-sales-website-contact",
      "company": "Dark Blizzard Sales",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-nick-landry-sales-website-contact",
      "company": "Nick Landry Sales",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-pfp-and-associates-website-contact",
      "company": "PFP and Associates",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-zia-works-distribution-website-contact",
      "company": "Zia Works Distribution",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-outdoors-ramsey-website-contact",
      "company": "Outdoors Ramsey",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-rock-creek-website-contact",
      "company": "Rock/Creek",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-outdoor-cap-company-website-contact",
      "company": "Outdoor Cap Company",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-black-white-outdoors-website-contact",
      "company": "Black & White Outdoors",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-bbq-fans-website-contact",
      "company": "BBQ Fans",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-waypoint-outdoor-website-contact",
      "company": "Waypoint Outdoor",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-sanitas-sales-group-website-contact",
      "company": "Sanitas Sales Group",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-sierra-outdoor-collective-website-contact",
      "company": "Sierra Outdoor Collective",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-endless-adventure-sales-website-contact",
      "company": "Endless Adventure Sales",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-level-8-outdoor-website-contact",
      "company": "Level 8 Outdoor",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-sportco-marketing-website-contact",
      "company": "Sportco Marketing",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-the-curtis-group-sales-website-contact",
      "company": "The Curtis Group Sales",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-ascension-sales-group-website-contact",
      "company": "Ascension Sales Group",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-granite-marketing-website-contact",
      "company": "Granite Marketing",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-skyline-sales-consulting-website-contact",
      "company": "Skyline Sales & Consulting",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-brandywine-river-reps-website-contact",
      "company": "Brandywine River Reps",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-hendrix-outdoors-website-contact",
      "company": "Hendrix Outdoors",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-action-sports-agency-website-contact",
      "company": "Action Sports Agency",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-sturm-mil-tec-usa-website-contact",
      "company": "Sturm Mil-Tec USA",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-suggs-nicholas-shea-website-contact",
      "company": "Suggs-Nicholas-Shea",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-1889-sales-website-contact",
      "company": "1889 Sales",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-c-g-distribution-website-contact",
      "company": "C&G Distribution",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-edgeline-collective-website-contact",
      "company": "Edgeline Collective",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-precision-sales-and-marketing-website-contact",
      "company": "Precision Sales and Marketing",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-kelly-brand-management-website-contact",
      "company": "Kelly Brand Management",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-kittredge-and-associates-website-contact",
      "company": "Kittredge and Associates",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-morrison-sports-marketing-website-contact",
      "company": "Morrison Sports Marketing",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-outdoor-industry-group-website-contact",
      "company": "Outdoor Industry Group",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-perpetual-motion-nw-website-contact",
      "company": "Perpetual Motion NW",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-brm-reps-website-contact",
      "company": "BRM Reps",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-green-drake-outdoors-website-contact",
      "company": "Green Drake Outdoors",
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
      "id": "google-customer-ld-mountain-centre-website-contact",
      "company": "LD Mountain Centre",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-taunton-leisure-website-contact",
      "company": "Taunton Leisure",
      "action": "develop",
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
      "id": "google-customer-the-great-outdoor-shop-website-contact",
      "company": "The Great Outdoor Shop",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    }
  ],
  "summary": {
    "totalLeads": 16,
    "highIcp": 16,
    "readyToDevelop": 26,
    "dueNow": 96,
    "visibleTodayQueue": 51,
    "potentialPool": 51,
    "potentialPoolTarget": 100,
    "customerTableHighIcp": 0,
    "refillNeeded": 49,
    "executableCompanies": 39,
    "executableReserveTarget": 130,
    "executableReserveNeeded": 91,
    "executableByChannel": {
      "linkedin": 1,
      "facebook": 2,
      "email": 17,
      "website_form": 19
    },
    "verifiedSocialCompanies": 3,
    "verifiedSocialReserveTarget": 20,
    "verifiedSocialReserveNeeded": 17,
    "enrichmentBacklogCount": 12,
    "googleDiscovered": 96,
    "facebookDiscovered": 5,
    "websiteContactDiscovered": 26,
    "scheduledLater": 0,
    "cooldown": 30,
    "emailPriority": 0,
    "openAgencyMarket": 15,
    "exclusiveAgencySkipped": 1,
    "needsVerification": 0,
    "retainedLowIcp": 0
  },
  "blockerSummary": [
    {
      "reason": "official_public_business_email_verified",
      "status": "skipped",
      "count": 43
    },
    {
      "reason": "official_website_contact_channel",
      "status": "skipped",
      "count": 42
    },
    {
      "reason": "homepage_only_contact_path_requires_verification",
      "status": "skipped",
      "count": 37
    },
    {
      "reason": "website_contact_capability_not_verified",
      "status": "skipped",
      "count": 12
    },
    {
      "reason": "social_profile_not_first_party_verified",
      "status": "skipped",
      "count": 4
    },
    {
      "reason": "official_website_social_channel_verified",
      "status": "skipped",
      "count": 3
    },
    {
      "reason": "linkedin_channel_requires_supported_executor",
      "status": "skipped",
      "count": 2
    },
    {
      "reason": "concrete_google_discovered_major_customer_facebook",
      "status": "skipped",
      "count": 1
    },
    {
      "reason": "concrete_google_discovered_major_customer_instagram",
      "status": "skipped",
      "count": 1
    }
  ],
  "blockerCounts": {
    "official_public_business_email_verified": 43,
    "official_website_contact_channel": 42,
    "homepage_only_contact_path_requires_verification": 37,
    "website_contact_capability_not_verified": 12,
    "social_profile_not_first_party_verified": 4,
    "official_website_social_channel_verified": 3,
    "linkedin_channel_requires_supported_executor": 2,
    "concrete_google_discovered_major_customer_facebook": 1,
    "concrete_google_discovered_major_customer_instagram": 1
  },
  "queueGoalStatus": {
    "target": 100,
    "potentialPool": 51,
    "queueCount": 96,
    "googleDiscovered": 96,
    "refillNeeded": 49,
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
  "platformCircuitState": {},
  "userVisibleStatus": "Customer development was not performed. Blockers: official_public_business_email_verified (43); official_website_contact_channel (42); homepage_only_contact_path_requires_verification (37).",
  "recoveryHint": "Refill the high-ICP pool with 49 verified leads or unblock existing website/social leads before the next run. Confirm the official social profile and safe message entry before rerunning Google-discovered social outreach.",
  "recoveryActions": [
    {
      "reason": "daily_queue_goal_not_reached",
      "action": "Refill high-ICP customer pool",
      "description": "Add or unblock 49 verified high-ICP leads to reach the daily 100 target.",
      "hint": "Refill the high-ICP pool with 49 verified leads or unblock existing website/social leads before the next run.",
      "target": 100,
      "potentialPool": 51,
      "refillNeeded": 49
    },
    {
      "reason": "google_social_profile_not_executable",
      "action": "Complete Google social channel verification",
      "description": "Confirm the official social profile and safe message entry before rerunning Google-discovered social outreach.",
      "hint": "Confirm the official social profile and safe message entry before rerunning Google-discovered social outreach."
    }
  ],
  "systemRefresh": {
    "ok": true,
    "stdout": "{\n  \"date\": \"2026-08-21\",\n  \"summary\": {\n    \"totalLeads\": 16,\n    \"highIcp\": 16,\n    \"readyToDevelop\": 26,\n    \"dueNow\": 96,\n    \"visibleTodayQueue\": 51,\n    \"potentialPool\": 51,\n    \"potentialPoolTarget\": 100,\n    \"customerTableHighIcp\": 0,\n    \"refillNeeded\": 49,\n    \"executableCompanies\": 39,\n    \"executableReserveTarget\": 130,\n    \"executableReserveNeeded\": 91,\n    \"executableByChannel\": {\n      \"linkedin\": 1,\n      \"facebook\": 2,\n      \"email\": 17,\n      \"website_form\": 19\n    },\n    \"verifiedSocialCompanies\": 3,\n    \"verifiedSocialReserveTarget\": 20,\n    \"verifiedSocialReserveNeeded\": 17,\n    \"enrichmentBacklogCount\": 12,\n    \"googleDiscovered\": 96,\n    \"facebookDiscovered\": 5,\n    \"websiteContactDiscovered\": 26,\n    \"scheduledLater\": 0,\n    \"cooldown\": 30,\n    \"emailPriority\": 0,\n    \"openAgencyMarket\": 15,\n    \"exclusiveAgencySkipped\": 1,\n    \"needsVerification\": 0,\n    \"retainedLowIcp\": 0\n  },\n  \"bugErrors\": 13,\n  \"queueFile\": \"E:\\\\New project\\\\outreach-dashboard\\\\daily-runs\\\\2026-08-21-daily-automation.json\",\n  \"csvFile\": \"E:\\\\New project\\\\outreach-dashboard\\\\daily-runs\\\\2026-08-21-daily-queue.csv\"\n}",
    "stderr": "",
    "error": "",
    "visibility": {
      "updatedAt": "2026-08-21T07:41:40.096Z",
      "source": "main-refreshDailyAutomationArtifacts",
      "runDate": "2026-08-21",
      "artifactGeneratedAt": "2026-08-21T07:41:37.070Z",
      "executionGeneratedAt": "2026-08-21T07:37:47.326Z",
      "githubSyncUpdatedAt": "2026-08-21T07:38:29.917Z",
      "counts": {
        "dailyQueue": 96,
        "googleDiscovered": 96,
        "websiteContact": 86,
        "cooldownQueue": 30,
        "scheduledLater": 0
      },
      "visibleSections": [
        "workspace",
        "taskDetailPanel",
        "todayQueue",
        "customers",
        "customerDetail",
        "seo",
        "automationAudit",
        "settings",
        "rightRail",
        "githubSyncStatus"
      ],
      "refreshedArtifacts": [
        "daily-automation-latest",
        "daily-automation-execution-latest",
        "google-lead-discovery-latest",
        "github-sync/latest-status",
        "system-visibility-latest"
      ],
      "dailyQueueGoal": {
        "target": 100,
        "potentialPool": 51,
        "refillNeeded": 49,
        "reached": false
      },
      "contactEnrichment": {
        "enabled": true,
        "sources": [
          "dailyQueue",
          "cooldownQueue",
          "google-lead-discovery-latest"
        ],
        "fields": [
          "publicEmail",
          "contactEmail",
          "contactPhone",
          "vendorPortal",
          "contactUrl",
          "contactSearchUrl",
          "website"
        ]
      }
    }
  },
  "alibabaSessionProbe": {
    "ok": false,
    "evidence": "alibaba_webmail_login_required"
  },
  "bounceReconciliation": {
    "ok": false,
    "reason": "email_sender_not_configured",
    "updated": 0,
    "requiredEnv": [
      "OUTREACH_EMAIL_FROM",
      "ALIBABA_SMTP_USER",
      "ALIBABA_SMTP_SECURITY_PASSWORD"
    ]
  },
  "ledgerReconciliationCount": 11,
  "externalEvidenceReconciliationCount": 0,
  "completedAt": "2026-08-21T07:41:41.598Z"
};
