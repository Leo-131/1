window.DAILY_AUTOMATION_EXECUTION_LATEST = {
  "ok": true,
  "browserTransportRequested": "codex-extension-first",
  "browserTransportUsed": "cdp",
  "browserTransportFallbackReason": "extension_bridge_not_available_process_local_cdp",
  "extensionReceiptCount": 0,
  "executionPhase": "browser_execution",
  "chromeStage": "opened",
  "chromeOpened": true,
  "chromeOpenedCount": 2,
  "customerDevelopmentPerformed": true,
  "customerMessageSent": true,
  "realDevelopmentCount": 1,
  "reportingVerdict": "development_performed",
  "engine": "Browser transport queue bridge",
  "mode": "serial-single-target",
  "batchMode": "parallel-batches",
  "parallelLimit": 1,
  "limit": 25,
  "queueDate": "2026-08-21",
  "queueSource": "dailyQueue",
  "executed": [
    {
      "id": "google-customer-s-booth-agencies-website-contact",
      "company": "S Booth Agencies",
      "action": "email_priority",
      "platform": "email",
      "targetUrl": "https://www.sboothsales.com/",
      "ok": true,
      "sendStatus": "sent_confirmed",
      "evidence": "official_public_business_email;verified_email_auto_send_no_manual_review;alibaba_webmail_session_reused;alibaba_webmail_send_control_verified;alibaba_webmail_send_physical_click_dispatched;alibaba_webmail_composer_closed_after_physical_click;alibaba_mail_send_confirmation_waiting;sent_folder_record_confirmed",
      "timestamp": "2026-08-21T11:33:24.343Z",
      "chromeOpen": null,
      "result": {
        "ok": true,
        "sendStatus": "sent_confirmed",
        "reason": "sent_folder_message_confirmed",
        "evidence": "official_public_business_email;verified_email_auto_send_no_manual_review;alibaba_webmail_session_reused;alibaba_webmail_send_control_verified;alibaba_webmail_send_physical_click_dispatched;alibaba_webmail_composer_closed_after_physical_click;alibaba_mail_send_confirmation_waiting;sent_folder_record_confirmed;official_social_channel_not_verified",
        "recipientEmail": "steve@sboothsales.com",
        "targetUrl": "mailto:steve@sboothsales.com",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear S Booth Agencies Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "engine": "alibaba-enterprise-mail-web-session",
        "mode": "alibaba_webmail_sent_folder_confirmed",
        "manualApprovalRequired": false,
        "autoSendAuthorized": true,
        "contentValidation": {
          "ok": true,
          "errors": [],
          "words": 110
        },
        "output": "{\"verdict\":\"sent_confirmed\",\"sendStatus\":\"sent_confirmed\",\"evidence\":\"official_public_business_email;verified_email_auto_send_no_manual_review;alibaba_webmail_session_reused;alibaba_webmail_send_control_verified;alibaba_webmail_send_physical_click_dispatched;alibaba_webmail_composer_closed_after_physical_click;alibaba_mail_send_confirmation_waiting;sent_folder_record_confirmed\",\"nextAction\":\"Alibaba Mail accepted the message and the matching record exists in Sent.\",\"recipientEmail\":\"steve@sboothsales.com\",\"messageId\":\"\"}",
        "secondaryChannelStatus": "official_social_channel_not_verified"
      }
    },
    {
      "id": "google-customer-trailcross-website-contact",
      "company": "TrailCross",
      "action": "email_priority",
      "platform": "email",
      "targetUrl": "https://www.trailcross.com/",
      "ok": false,
      "sendStatus": "skipped",
      "evidence": "email_domain_daily_limit_reached;domain:gmail.com;sentToday:3;limit:3",
      "timestamp": "2026-08-21T11:33:27.007Z",
      "chromeOpen": null,
      "result": {
        "ok": false,
        "skipped": true,
        "sendStatus": "skipped",
        "reason": "email_domain_daily_limit_reached",
        "mode": "email_domain_safety_gate",
        "evidence": "email_domain_daily_limit_reached;domain:gmail.com;sentToday:3;limit:3",
        "nextAction": "Pause this domain until the next Asia/Shanghai business day; use another verified company or channel."
      }
    },
    {
      "id": "google-customer-outdoor-brands-uk-website-contact",
      "company": "Outdoor Brands UK",
      "action": "develop",
      "platform": "website_form",
      "targetUrl": "https://www.outdoorbrands.co.uk/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "unavailable_profile_page: 404 Error - Page Not Found;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-21T11:33:59.856Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.outdoorbrands.co.uk/help/contact-us",
        "tabId": "6AD89A67106664A49E8A0D0D6E153664",
        "title": "404 Error - Page Not Found",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "unavailable_profile_page: 404 Error - Page Not Found"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.outdoorbrands.co.uk/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.outdoorbrands.co.uk/help/contact-us",
          "tabId": "6AD89A67106664A49E8A0D0D6E153664",
          "title": "404 Error - Page Not Found",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "unavailable_profile_page: 404 Error - Page Not Found"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Outdoor Brands UK Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "unavailable_profile_page: 404 Error - Page Not Found;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"unavailable_profile_page: 404 Error - Page Not Found;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Outdoor Brands UK Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.outdoorbrands.co.uk/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:GET IN TOUCH TODAY\"},{\"targetUrl\":\"https://www.outdoorbrands.co.uk/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: 404 Error - Page Not Found\"},{\"targetUrl\":\"https://www.outdoorbrands.co.uk/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: 404 Error - Page Not Found\"},{\"targetUrl\":\"https://www.outdoorbrands.co.uk/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: 404 Error - Page Not Found\"},{\"targetUrl\":\"https://www.outdoorbrands.co.uk/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: 404 Error - Page Not Found\"},{\"targetUrl\":\"https://www.outdoorbrands.co.uk/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: 404 Error - Page Not Found\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    }
  ],
  "results": [
    {
      "id": "google-customer-s-booth-agencies-website-contact",
      "company": "S Booth Agencies",
      "action": "email_priority",
      "platform": "email",
      "targetUrl": "https://www.sboothsales.com/",
      "ok": true,
      "sendStatus": "sent_confirmed",
      "evidence": "official_public_business_email;verified_email_auto_send_no_manual_review;alibaba_webmail_session_reused;alibaba_webmail_send_control_verified;alibaba_webmail_send_physical_click_dispatched;alibaba_webmail_composer_closed_after_physical_click;alibaba_mail_send_confirmation_waiting;sent_folder_record_confirmed",
      "timestamp": "2026-08-21T11:33:24.343Z",
      "chromeOpen": null,
      "result": {
        "ok": true,
        "sendStatus": "sent_confirmed",
        "reason": "sent_folder_message_confirmed",
        "evidence": "official_public_business_email;verified_email_auto_send_no_manual_review;alibaba_webmail_session_reused;alibaba_webmail_send_control_verified;alibaba_webmail_send_physical_click_dispatched;alibaba_webmail_composer_closed_after_physical_click;alibaba_mail_send_confirmation_waiting;sent_folder_record_confirmed;official_social_channel_not_verified",
        "recipientEmail": "steve@sboothsales.com",
        "targetUrl": "mailto:steve@sboothsales.com",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear S Booth Agencies Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "engine": "alibaba-enterprise-mail-web-session",
        "mode": "alibaba_webmail_sent_folder_confirmed",
        "manualApprovalRequired": false,
        "autoSendAuthorized": true,
        "contentValidation": {
          "ok": true,
          "errors": [],
          "words": 110
        },
        "output": "{\"verdict\":\"sent_confirmed\",\"sendStatus\":\"sent_confirmed\",\"evidence\":\"official_public_business_email;verified_email_auto_send_no_manual_review;alibaba_webmail_session_reused;alibaba_webmail_send_control_verified;alibaba_webmail_send_physical_click_dispatched;alibaba_webmail_composer_closed_after_physical_click;alibaba_mail_send_confirmation_waiting;sent_folder_record_confirmed\",\"nextAction\":\"Alibaba Mail accepted the message and the matching record exists in Sent.\",\"recipientEmail\":\"steve@sboothsales.com\",\"messageId\":\"\"}",
        "secondaryChannelStatus": "official_social_channel_not_verified"
      }
    },
    {
      "id": "google-customer-trailcross-website-contact",
      "company": "TrailCross",
      "action": "email_priority",
      "platform": "email",
      "targetUrl": "https://www.trailcross.com/",
      "ok": false,
      "sendStatus": "skipped",
      "evidence": "email_domain_daily_limit_reached;domain:gmail.com;sentToday:3;limit:3",
      "timestamp": "2026-08-21T11:33:27.007Z",
      "chromeOpen": null,
      "result": {
        "ok": false,
        "skipped": true,
        "sendStatus": "skipped",
        "reason": "email_domain_daily_limit_reached",
        "mode": "email_domain_safety_gate",
        "evidence": "email_domain_daily_limit_reached;domain:gmail.com;sentToday:3;limit:3",
        "nextAction": "Pause this domain until the next Asia/Shanghai business day; use another verified company or channel."
      }
    },
    {
      "id": "google-customer-outdoor-brands-uk-website-contact",
      "company": "Outdoor Brands UK",
      "action": "develop",
      "platform": "website_form",
      "targetUrl": "https://www.outdoorbrands.co.uk/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "unavailable_profile_page: 404 Error - Page Not Found;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-21T11:33:59.856Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.outdoorbrands.co.uk/help/contact-us",
        "tabId": "6AD89A67106664A49E8A0D0D6E153664",
        "title": "404 Error - Page Not Found",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "unavailable_profile_page: 404 Error - Page Not Found"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.outdoorbrands.co.uk/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.outdoorbrands.co.uk/help/contact-us",
          "tabId": "6AD89A67106664A49E8A0D0D6E153664",
          "title": "404 Error - Page Not Found",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "unavailable_profile_page: 404 Error - Page Not Found"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Outdoor Brands UK Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "unavailable_profile_page: 404 Error - Page Not Found;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"unavailable_profile_page: 404 Error - Page Not Found;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Outdoor Brands UK Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.outdoorbrands.co.uk/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:GET IN TOUCH TODAY\"},{\"targetUrl\":\"https://www.outdoorbrands.co.uk/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: 404 Error - Page Not Found\"},{\"targetUrl\":\"https://www.outdoorbrands.co.uk/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: 404 Error - Page Not Found\"},{\"targetUrl\":\"https://www.outdoorbrands.co.uk/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: 404 Error - Page Not Found\"},{\"targetUrl\":\"https://www.outdoorbrands.co.uk/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: 404 Error - Page Not Found\"},{\"targetUrl\":\"https://www.outdoorbrands.co.uk/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: 404 Error - Page Not Found\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    }
  ],
  "skipped": [
    {
      "id": "google-customer-minnis-brands-website-contact",
      "company": "Minnis Brands",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
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
      "id": "google-customer-hardin-outdoors-website-contact",
      "company": "Hardin Outdoors",
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
      "id": "google-customer-outdoors-ramsey-website-contact",
      "company": "Outdoors Ramsey",
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
      "id": "google-customer-varuste-website-contact",
      "company": "Varuste",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-four-corners-uk-website-contact",
      "company": "Four Corners UK",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
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
      "id": "google-customer-tractor-supply-company-website-contact",
      "company": "Tractor Supply Company",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-nickel-n-diamond-sales-facebook",
      "company": "Nickel N Diamond Sales",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-owens-outdoor-sales-facebook",
      "company": "Owens Outdoor Sales",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-nohrth-facebook",
      "company": "NOHRTH",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-zia-works-distribution-instagram",
      "company": "Zia Works Distribution",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-sideways-distribution-website-contact",
      "company": "Sideways Distribution",
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
      "id": "google-customer-rock-creek-website-contact",
      "company": "Rock/Creek",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
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
      "id": "google-customer-fjellsport-website-contact",
      "company": "Fjellsport",
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
      "id": "google-customer-esprinet-group-website-contact",
      "company": "Esprinet Group",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
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
      "id": "google-customer-left-point-distribution-website-contact",
      "company": "Left Point Distribution",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
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
      "id": "google-customer-bergfreunde-website-contact",
      "company": "Bergfreunde",
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
      "id": "google-customer-outdoor-nature-website-contact",
      "company": "Outdoor Nature",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-esprinet-group-linkedin",
      "company": "Esprinet Group",
      "action": "develop",
      "platform": "linkedin",
      "reason": "social_profile_not_first_party_verified"
    },
    {
      "id": "google-customer-nickel-n-diamond-sales-facebook",
      "company": "Nickel N Diamond Sales",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-owens-outdoor-sales-facebook",
      "company": "Owens Outdoor Sales",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-nohrth-facebook",
      "company": "NOHRTH",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-zia-works-distribution-instagram",
      "company": "Zia Works Distribution",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-minnis-brands-website-contact",
      "company": "Minnis Brands",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
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
      "id": "google-customer-hardin-outdoors-website-contact",
      "company": "Hardin Outdoors",
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
      "reason": "personal_email_domain_not_allowed"
    },
    {
      "id": "google-customer-parallel-33-sales-group-website-contact",
      "company": "Parallel 33 Sales Group",
      "action": "email_priority",
      "platform": "email",
      "reason": "personal_email_domain_not_allowed"
    },
    {
      "id": "google-customer-sales-society-72-website-contact",
      "company": "Sales Society 72",
      "action": "email_priority",
      "platform": "email",
      "reason": "personal_email_domain_not_allowed"
    },
    {
      "id": "google-customer-dark-blizzard-sales-website-contact",
      "company": "Dark Blizzard Sales",
      "action": "email_priority",
      "platform": "email",
      "reason": "personal_email_domain_not_allowed"
    },
    {
      "id": "google-customer-nick-landry-sales-website-contact",
      "company": "Nick Landry Sales",
      "action": "email_priority",
      "platform": "email",
      "reason": "personal_email_domain_not_allowed"
    },
    {
      "id": "google-customer-pfp-and-associates-website-contact",
      "company": "PFP and Associates",
      "action": "email_priority",
      "platform": "email",
      "reason": "personal_email_domain_not_allowed"
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
      "reason": "personal_email_domain_not_allowed"
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
      "id": "google-customer-four-corners-uk-website-contact",
      "company": "Four Corners UK",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
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
    "readyToDevelop": 23,
    "dueNow": 90,
    "visibleTodayQueue": 53,
    "potentialPool": 54,
    "potentialPoolTarget": 100,
    "customerTableHighIcp": 0,
    "refillNeeded": 46,
    "executableCompanies": 36,
    "executableReserveTarget": 130,
    "executableReserveNeeded": 94,
    "executableByChannel": {
      "facebook": 3,
      "instagram": 1,
      "email": 11,
      "website_form": 21
    },
    "verifiedSocialCompanies": 4,
    "verifiedSocialReserveTarget": 20,
    "verifiedSocialReserveNeeded": 16,
    "enrichmentBacklogCount": 18,
    "googleDiscovered": 90,
    "facebookDiscovered": 3,
    "websiteContactDiscovered": 27,
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
      "reason": "official_website_contact_channel",
      "status": "skipped",
      "count": 44
    },
    {
      "reason": "official_public_business_email_verified",
      "status": "skipped",
      "count": 34
    },
    {
      "reason": "homepage_only_contact_path_requires_verification",
      "status": "skipped",
      "count": 33
    },
    {
      "reason": "website_contact_capability_not_verified",
      "status": "skipped",
      "count": 11
    },
    {
      "reason": "official_website_social_channel_verified",
      "status": "skipped",
      "count": 8
    },
    {
      "reason": "personal_email_domain_not_allowed",
      "status": "skipped",
      "count": 7
    },
    {
      "reason": "email_domain_daily_limit_reached",
      "status": "skipped",
      "count": 1
    },
    {
      "reason": "sent_folder_message_confirmed",
      "status": "sent_confirmed",
      "count": 1
    },
    {
      "reason": "social_profile_not_first_party_verified",
      "status": "skipped",
      "count": 1
    }
  ],
  "blockerCounts": {
    "official_website_contact_channel": 44,
    "official_public_business_email_verified": 34,
    "homepage_only_contact_path_requires_verification": 33,
    "website_contact_capability_not_verified": 11,
    "official_website_social_channel_verified": 8,
    "personal_email_domain_not_allowed": 7,
    "email_domain_daily_limit_reached": 1,
    "sent_folder_message_confirmed": 1,
    "social_profile_not_first_party_verified": 1
  },
  "queueGoalStatus": {
    "target": 100,
    "potentialPool": 54,
    "queueCount": 90,
    "googleDiscovered": 90,
    "refillNeeded": 46,
    "confirmedToday": 52,
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
  "userVisibleStatus": "Customer development was not performed. Blockers: official_website_contact_channel (44); official_public_business_email_verified (34); homepage_only_contact_path_requires_verification (33).",
  "recoveryHint": "Refill the high-ICP pool with 46 verified leads or unblock existing website/social leads before the next run.",
  "recoveryActions": [
    {
      "reason": "daily_queue_goal_not_reached",
      "action": "Refill high-ICP customer pool",
      "description": "Add or unblock 46 verified high-ICP leads to reach the daily 100 target.",
      "hint": "Refill the high-ICP pool with 46 verified leads or unblock existing website/social leads before the next run.",
      "target": 100,
      "potentialPool": 54,
      "refillNeeded": 46
    }
  ],
  "systemRefresh": {
    "ok": true,
    "stdout": "{\n  \"date\": \"2026-08-21\",\n  \"summary\": {\n    \"totalLeads\": 16,\n    \"highIcp\": 16,\n    \"readyToDevelop\": 23,\n    \"dueNow\": 89,\n    \"visibleTodayQueue\": 52,\n    \"potentialPool\": 53,\n    \"potentialPoolTarget\": 100,\n    \"customerTableHighIcp\": 0,\n    \"refillNeeded\": 47,\n    \"executableCompanies\": 35,\n    \"executableReserveTarget\": 130,\n    \"executableReserveNeeded\": 95,\n    \"executableByChannel\": {\n      \"facebook\": 3,\n      \"instagram\": 1,\n      \"email\": 10,\n      \"website_form\": 21\n    },\n    \"verifiedSocialCompanies\": 4,\n    \"verifiedSocialReserveTarget\": 20,\n    \"verifiedSocialReserveNeeded\": 16,\n    \"enrichmentBacklogCount\": 18,\n    \"googleDiscovered\": 89,\n    \"facebookDiscovered\": 3,\n    \"websiteContactDiscovered\": 26,\n    \"scheduledLater\": 0,\n    \"cooldown\": 30,\n    \"emailPriority\": 0,\n    \"openAgencyMarket\": 15,\n    \"exclusiveAgencySkipped\": 1,\n    \"needsVerification\": 0,\n    \"retainedLowIcp\": 0\n  },\n  \"bugErrors\": 13,\n  \"queueFile\": \"E:\\\\New project\\\\outreach-dashboard\\\\daily-runs\\\\2026-08-21-daily-automation.json\",\n  \"csvFile\": \"E:\\\\New project\\\\outreach-dashboard\\\\daily-runs\\\\2026-08-21-daily-queue.csv\"\n}",
    "stderr": "",
    "error": "",
    "visibility": {
      "updatedAt": "2026-08-21T11:34:04.349Z",
      "source": "main-refreshDailyAutomationArtifacts",
      "runDate": "2026-08-21",
      "artifactGeneratedAt": "2026-08-21T11:34:00.948Z",
      "executionGeneratedAt": "2026-08-21T11:25:41.208Z",
      "githubSyncUpdatedAt": "2026-08-21T11:26:07.462Z",
      "counts": {
        "dailyQueue": 89,
        "googleDiscovered": 89,
        "websiteContact": 84,
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
        "potentialPool": 53,
        "refillNeeded": 47,
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
    "ok": true,
    "evidence": "alibaba_webmail_authenticated_compose_visible",
    "url": "https://qiye.aliyun.com/alimail/entries/v5.1/mail/sentitems/all",
    "title": "阿里邮箱"
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
  "ledgerReconciliationCount": 1,
  "externalEvidenceReconciliationCount": 0,
  "completedAt": "2026-08-21T11:34:05.291Z"
};
