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
  "queueDate": "2026-08-27",
  "queueSource": "dailyQueue",
  "executed": [
    {
      "id": "google-customer-stella-blue-sales-website-contact",
      "company": "Stella Blue Sales",
      "action": "email_priority",
      "platform": "email",
      "targetUrl": "https://stellabluesales.com/",
      "ok": false,
      "sendStatus": "skipped",
      "evidence": "recipient_domain_mail_exchange_unverified;domain:stellbluesales.com;no_send_performed",
      "timestamp": "2026-08-27T14:08:22.062Z",
      "chromeOpen": null,
      "result": {
        "ok": false,
        "skipped": true,
        "sendStatus": "skipped",
        "reason": "recipient_domain_mail_exchange_unverified",
        "mode": "email_domain_mx_gate",
        "evidence": "recipient_domain_mail_exchange_unverified;domain:stellbluesales.com;no_send_performed",
        "recipientEmail": "andrew@stellbluesales.com",
        "nextAction": "Do not send to this address; continue with a first-party-verified official social channel for the same company."
      }
    },
    {
      "id": "google-customer-beaver-outdoor-canada-website-contact",
      "company": "Beaver Outdoor Canada",
      "action": "email_priority",
      "platform": "email",
      "targetUrl": "https://www.beaveroutdoor.ca/contact-us.html",
      "ok": false,
      "sendStatus": "skipped",
      "evidence": "recipient_domain_mail_exchange_unverified;domain:beaveroutdoor.ca;no_send_performed",
      "timestamp": "2026-08-27T14:08:24.702Z",
      "chromeOpen": null,
      "result": {
        "ok": false,
        "skipped": true,
        "sendStatus": "skipped",
        "reason": "recipient_domain_mail_exchange_unverified",
        "mode": "email_domain_mx_gate",
        "evidence": "recipient_domain_mail_exchange_unverified;domain:beaveroutdoor.ca;no_send_performed",
        "recipientEmail": "distributor@beaveroutdoor.ca",
        "nextAction": "Do not send to this address; continue with a first-party-verified official social channel for the same company."
      }
    },
    {
      "id": "google-customer-murdoch-s-ranch-home-supply-website-contact",
      "company": "Murdoch's Ranch & Home Supply",
      "action": "email_priority",
      "platform": "website_form",
      "targetUrl": "https://www.murdochs.com/about-us/suppliers-and-vendors/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:7;contact_path_strategy_v2",
      "timestamp": "2026-08-27T14:08:51.677Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.murdochs.com/help/contact-us",
        "tabId": "A2520F52BB51D67A0DE70232A2A403B0",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/A2520F52BB51D67A0DE70232A2A403B0",
        "title": "Just a moment..."
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.murdochs.com/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.murdochs.com/help/contact-us",
          "tabId": "A2520F52BB51D67A0DE70232A2A403B0",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/A2520F52BB51D67A0DE70232A2A403B0",
          "title": "Just a moment..."
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL global distribution partnership | Murdoch's Ranch & Home Supply",
        "draft": "Dear Murdoch's Ranch & Home Supply Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail fits our compact outdoor electrics: portable pumps, camping lighting and lightweight power solutions.\n\nOur 2026 range adds 36+ practical SKUs across multiple uses and price tiers, supporting seasonal launches and category expansion.\n\nCould you review a distribution partnership, or direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nSales materials:\nRoadmap: https://drive.google.com/file/d/1QOQbDQrl49DiGp08HOy3C5AHbtzee2CE/view?usp=drive_link\nCatalog: https://drive.google.com/file/d/1gEKgMnJEPSIh8Z0P9DQ-6KndFwHz5riS/view?usp=drive_link\nDistributor network: https://drive.google.com/file/d/1x3EGqFeOUtk8z0tfuRRThavPrH0e3pmM/view?usp=drive_link\n\nSincerely\nBest Regard\nLeo Liu\nOverseas Business Unit\nTel/whatsapp: +86 17321028184\nEmail: Leo@flextailgear.com\nSHANGHAI FLEXTAIL TECHNOLOGY CO.,LTD.\n5th Floor, No. 68, Yincheng Middle Road, Pudong New Area, Shanghai (Times Finance Center)",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:7;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:7;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL global distribution partnership | Murdoch's Ranch & Home Supply\",\"draft\":\"Dear Murdoch's Ranch & Home Supply Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail fits our compact outdoor electrics: portable pumps, camping lighting and lightweight power solutions.\\n\\nOur 2026 range adds 36+ practical SKUs across multiple uses and price tiers, supporting seasonal launches and category expansion.\\n\\nCould you review a distribution partnership, or direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nSales materials:\\nRoadmap: https://drive.google.com/file/d/1QOQbDQrl49DiGp08HOy3C5AHbtzee2CE/view?usp=drive_link\\nCatalog: https://drive.google.com/file/d/1gEKgMnJEPSIh8Z0P9DQ-6KndFwHz5riS/view?usp=drive_link\\nDistributor network: https://drive.google.com/file/d/1x3EGqFeOUtk8z0tfuRRThavPrH0e3pmM/view?usp=drive_link\\n\\nSincerely\\nBest Regard\\nLeo Liu\\nOverseas Business Unit\\nTel/whatsapp: +86 17321028184\\nEmail: Leo@flextailgear.com\\nSHANGHAI FLEXTAIL TECHNOLOGY CO.,LTD.\\n5th Floor, No. 68, Yincheng Middle Road, Pudong New Area, Shanghai (Times Finance Center)\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.murdochs.com/about-us/suppliers-and-vendors/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.murdochs.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.murdochs.com/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.murdochs.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.murdochs.com/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.murdochs.com/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.murdochs.com/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
      }
    }
  ],
  "results": [
    {
      "id": "google-customer-stella-blue-sales-website-contact",
      "company": "Stella Blue Sales",
      "action": "email_priority",
      "platform": "email",
      "targetUrl": "https://stellabluesales.com/",
      "ok": false,
      "sendStatus": "skipped",
      "evidence": "recipient_domain_mail_exchange_unverified;domain:stellbluesales.com;no_send_performed",
      "timestamp": "2026-08-27T14:08:22.062Z",
      "chromeOpen": null,
      "result": {
        "ok": false,
        "skipped": true,
        "sendStatus": "skipped",
        "reason": "recipient_domain_mail_exchange_unverified",
        "mode": "email_domain_mx_gate",
        "evidence": "recipient_domain_mail_exchange_unverified;domain:stellbluesales.com;no_send_performed",
        "recipientEmail": "andrew@stellbluesales.com",
        "nextAction": "Do not send to this address; continue with a first-party-verified official social channel for the same company."
      }
    },
    {
      "id": "google-customer-beaver-outdoor-canada-website-contact",
      "company": "Beaver Outdoor Canada",
      "action": "email_priority",
      "platform": "email",
      "targetUrl": "https://www.beaveroutdoor.ca/contact-us.html",
      "ok": false,
      "sendStatus": "skipped",
      "evidence": "recipient_domain_mail_exchange_unverified;domain:beaveroutdoor.ca;no_send_performed",
      "timestamp": "2026-08-27T14:08:24.702Z",
      "chromeOpen": null,
      "result": {
        "ok": false,
        "skipped": true,
        "sendStatus": "skipped",
        "reason": "recipient_domain_mail_exchange_unverified",
        "mode": "email_domain_mx_gate",
        "evidence": "recipient_domain_mail_exchange_unverified;domain:beaveroutdoor.ca;no_send_performed",
        "recipientEmail": "distributor@beaveroutdoor.ca",
        "nextAction": "Do not send to this address; continue with a first-party-verified official social channel for the same company."
      }
    },
    {
      "id": "google-customer-murdoch-s-ranch-home-supply-website-contact",
      "company": "Murdoch's Ranch & Home Supply",
      "action": "email_priority",
      "platform": "website_form",
      "targetUrl": "https://www.murdochs.com/about-us/suppliers-and-vendors/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:7;contact_path_strategy_v2",
      "timestamp": "2026-08-27T14:08:51.677Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.murdochs.com/help/contact-us",
        "tabId": "A2520F52BB51D67A0DE70232A2A403B0",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/A2520F52BB51D67A0DE70232A2A403B0",
        "title": "Just a moment..."
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.murdochs.com/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.murdochs.com/help/contact-us",
          "tabId": "A2520F52BB51D67A0DE70232A2A403B0",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/A2520F52BB51D67A0DE70232A2A403B0",
          "title": "Just a moment..."
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL global distribution partnership | Murdoch's Ranch & Home Supply",
        "draft": "Dear Murdoch's Ranch & Home Supply Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail fits our compact outdoor electrics: portable pumps, camping lighting and lightweight power solutions.\n\nOur 2026 range adds 36+ practical SKUs across multiple uses and price tiers, supporting seasonal launches and category expansion.\n\nCould you review a distribution partnership, or direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nSales materials:\nRoadmap: https://drive.google.com/file/d/1QOQbDQrl49DiGp08HOy3C5AHbtzee2CE/view?usp=drive_link\nCatalog: https://drive.google.com/file/d/1gEKgMnJEPSIh8Z0P9DQ-6KndFwHz5riS/view?usp=drive_link\nDistributor network: https://drive.google.com/file/d/1x3EGqFeOUtk8z0tfuRRThavPrH0e3pmM/view?usp=drive_link\n\nSincerely\nBest Regard\nLeo Liu\nOverseas Business Unit\nTel/whatsapp: +86 17321028184\nEmail: Leo@flextailgear.com\nSHANGHAI FLEXTAIL TECHNOLOGY CO.,LTD.\n5th Floor, No. 68, Yincheng Middle Road, Pudong New Area, Shanghai (Times Finance Center)",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:7;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:7;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL global distribution partnership | Murdoch's Ranch & Home Supply\",\"draft\":\"Dear Murdoch's Ranch & Home Supply Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail fits our compact outdoor electrics: portable pumps, camping lighting and lightweight power solutions.\\n\\nOur 2026 range adds 36+ practical SKUs across multiple uses and price tiers, supporting seasonal launches and category expansion.\\n\\nCould you review a distribution partnership, or direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nSales materials:\\nRoadmap: https://drive.google.com/file/d/1QOQbDQrl49DiGp08HOy3C5AHbtzee2CE/view?usp=drive_link\\nCatalog: https://drive.google.com/file/d/1gEKgMnJEPSIh8Z0P9DQ-6KndFwHz5riS/view?usp=drive_link\\nDistributor network: https://drive.google.com/file/d/1x3EGqFeOUtk8z0tfuRRThavPrH0e3pmM/view?usp=drive_link\\n\\nSincerely\\nBest Regard\\nLeo Liu\\nOverseas Business Unit\\nTel/whatsapp: +86 17321028184\\nEmail: Leo@flextailgear.com\\nSHANGHAI FLEXTAIL TECHNOLOGY CO.,LTD.\\n5th Floor, No. 68, Yincheng Middle Road, Pudong New Area, Shanghai (Times Finance Center)\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.murdochs.com/about-us/suppliers-and-vendors/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.murdochs.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.murdochs.com/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.murdochs.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.murdochs.com/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.murdochs.com/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.murdochs.com/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
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
      "id": "google-customer-pss-agency-website-contact",
      "company": "PSS Agency",
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
      "id": "google-customer-athletiq-sport-website-contact",
      "company": "Athletiq Sport",
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
      "id": "google-customer-simpson-sales-company-website-contact",
      "company": "Simpson Sales Company",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-camperlands-manchester-website-contact",
      "company": "Camperlands Manchester",
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
      "id": "google-customer-minnis-brands-linkedin",
      "company": "Minnis Brands",
      "action": "develop",
      "platform": "linkedin",
      "reason": "verified_linkedin_profile_ready"
    },
    {
      "id": "google-customer-alpinewaves-linkedin",
      "company": "AlpineWaves",
      "action": "develop",
      "platform": "linkedin",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-alpine-waves-linkedin",
      "company": "Alpine Waves",
      "action": "develop",
      "platform": "linkedin",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-mcqueen-ball-linkedin",
      "company": "McQueen Ball",
      "action": "develop",
      "platform": "linkedin",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-esprinet-group-linkedin",
      "company": "Esprinet Group",
      "action": "develop",
      "platform": "linkedin",
      "reason": "social_profile_not_first_party_verified"
    },
    {
      "id": "google-customer-northern-exposure-sporting-group-linkedin",
      "company": "Northern Exposure Sporting Group",
      "action": "develop",
      "platform": "linkedin",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-next-adventure-linkedin",
      "company": "Next Adventure",
      "action": "develop",
      "platform": "linkedin",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-four-corners-uk-facebook",
      "company": "Four Corners UK",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-hardin-outdoors-facebook",
      "company": "Hardin Outdoors",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-motion-sports-facebook",
      "company": "Motion Sports",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-nickel-n-diamond-sales-facebook",
      "company": "Nickel N Diamond Sales",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-ludwikoski-associates-facebook",
      "company": "Ludwikoski & Associates",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-sanitas-sales-group-facebook",
      "company": "Sanitas Sales Group",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-old-timber-outfitters-facebook",
      "company": "Old Timber Outfitters",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-ascension-sales-group-facebook",
      "company": "Ascension Sales Group",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-camperlands-manchester-facebook",
      "company": "Camperlands Manchester",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-powers-pedersen-sales-group-facebook",
      "company": "Powers Pedersen Sales Group",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-brandywine-river-reps-facebook",
      "company": "Brandywine River Reps",
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
      "id": "google-customer-action-sports-agency-facebook",
      "company": "Action Sports Agency",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-awesome-outdoors-group-facebook",
      "company": "Awesome Outdoors Group",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-taunton-leisure-facebook",
      "company": "Taunton Leisure",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-nomadic-supply-company-facebook",
      "company": "Nomadic Supply Company",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-bbq-fans-facebook",
      "company": "BBQ Fans",
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
      "id": "google-customer-latulippe-facebook",
      "company": "Latulippe",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-minnis-brands-instagram",
      "company": "Minnis Brands",
      "action": "develop",
      "platform": "instagram",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-alpinewaves-instagram",
      "company": "AlpineWaves",
      "action": "develop",
      "platform": "instagram",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-alpine-waves-instagram",
      "company": "Alpine Waves",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-hardin-outdoors-instagram",
      "company": "Hardin Outdoors",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-nickel-n-diamond-sales-instagram",
      "company": "Nickel N Diamond Sales",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-palisade-trading-instagram",
      "company": "Palisade Trading",
      "action": "develop",
      "platform": "instagram",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-activ-agency-denver-instagram",
      "company": "Activ Agency Denver",
      "action": "develop",
      "platform": "instagram",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-onwardup-instagram",
      "company": "OnwardUP",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-level-8-outdoor-instagram",
      "company": "Level 8 Outdoor",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-haynes-florance-associates-instagram",
      "company": "Haynes Florance & Associates",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-elevated-outdoor-sales-instagram",
      "company": "Elevated Outdoor Sales",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-perspective-outdoor-instagram",
      "company": "Perspective Outdoor",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-heron-outdoors-instagram",
      "company": "Heron Outdoors",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-northern-exposure-sporting-group-instagram",
      "company": "Northern Exposure Sporting Group",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-garibaldi-supply-co-instagram",
      "company": "Garibaldi Supply Co.",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-awesome-outdoors-group-instagram",
      "company": "Awesome Outdoors Group",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-ld-mountain-centre-instagram",
      "company": "LD Mountain Centre",
      "action": "develop",
      "platform": "instagram",
      "reason": "social_profile_not_first_party_verified"
    },
    {
      "id": "google-customer-taunton-leisure-instagram",
      "company": "Taunton Leisure",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-rock-creek-instagram",
      "company": "Rock/Creek",
      "action": "develop",
      "platform": "instagram",
      "reason": "social_profile_not_first_party_verified"
    },
    {
      "id": "google-customer-bbq-fans-instagram",
      "company": "BBQ Fans",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-bergfreunde-instagram",
      "company": "Bergfreunde",
      "action": "develop",
      "platform": "instagram",
      "reason": "social_profile_not_first_party_verified"
    },
    {
      "id": "google-customer-alpinewaves-website-contact",
      "company": "AlpineWaves",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-shiner-distribution-website-contact",
      "company": "Shiner Distribution",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-outdoor-brands-uk-website-contact",
      "company": "Outdoor Brands UK",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-palisade-trading-website-contact",
      "company": "Palisade Trading",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-waypoint-outdoor-website-contact",
      "company": "Waypoint Outdoor",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-sespe-group-website-contact",
      "company": "Sespe Group",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-activ-agency-denver-website-contact",
      "company": "Activ Agency Denver",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-1889-sales-website-contact",
      "company": "1889 Sales",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-athena-sales-website-contact",
      "company": "Athena Sales",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-sierra-outdoor-collective-website-contact",
      "company": "Sierra Outdoor Collective",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-endless-adventure-sales-website-contact",
      "company": "Endless Adventure Sales",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-excell-marketing-website-contact",
      "company": "Excell Marketing",
      "action": "email_priority",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-green-room-trading-website-contact",
      "company": "Green Room Trading",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-level-8-outdoor-website-contact",
      "company": "Level 8 Outdoor",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-sportco-marketing-website-contact",
      "company": "Sportco Marketing",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-the-curtis-group-sales-website-contact",
      "company": "The Curtis Group Sales",
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
      "id": "google-customer-mcqueen-ball-linkedin",
      "company": "McQueen Ball",
      "action": "develop",
      "platform": "linkedin",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-next-adventure-linkedin",
      "company": "Next Adventure",
      "action": "develop",
      "platform": "linkedin",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-four-corners-uk-facebook",
      "company": "Four Corners UK",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-motion-sports-facebook",
      "company": "Motion Sports",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-ludwikoski-associates-facebook",
      "company": "Ludwikoski & Associates",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-sanitas-sales-group-facebook",
      "company": "Sanitas Sales Group",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-old-timber-outfitters-facebook",
      "company": "Old Timber Outfitters",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-ascension-sales-group-facebook",
      "company": "Ascension Sales Group",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-brandywine-river-reps-facebook",
      "company": "Brandywine River Reps",
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
      "id": "google-customer-nomadic-supply-company-facebook",
      "company": "Nomadic Supply Company",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-latulippe-facebook",
      "company": "Latulippe",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-onwardup-instagram",
      "company": "OnwardUP",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-haynes-florance-associates-instagram",
      "company": "Haynes Florance & Associates",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-elevated-outdoor-sales-instagram",
      "company": "Elevated Outdoor Sales",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-garibaldi-supply-co-instagram",
      "company": "Garibaldi Supply Co.",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-shiner-distribution-website-contact",
      "company": "Shiner Distribution",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-sportco-marketing-website-contact",
      "company": "Sportco Marketing",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
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
      "id": "google-customer-howe-sound-sales-website-contact",
      "company": "Howe Sound Sales",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-terra-outdoor-gear-distribution-website-contact",
      "company": "Terra Outdoor Gear Distribution",
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
      "id": "google-customer-nordcore-group-website-contact",
      "company": "NordCore Group",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-tin-shack-ltd-website-contact",
      "company": "Tin Shack Ltd",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    }
  ],
  "summary": {
    "totalLeads": 16,
    "highIcp": 16,
    "readyToDevelop": 47,
    "dueNow": 78,
    "visibleTodayQueue": 82,
    "potentialPool": 28,
    "potentialPoolTarget": 100,
    "customerTableHighIcp": 0,
    "refillNeeded": 72,
    "executableCompanies": 19,
    "executableReserveTarget": 130,
    "executableReserveNeeded": 111,
    "executableByChannel": {
      "linkedin": 2,
      "facebook": 10,
      "instagram": 4,
      "email": 2,
      "website_form": 1
    },
    "verifiedSocialCompanies": 16,
    "verifiedSocialReserveTarget": 20,
    "verifiedSocialReserveNeeded": 4,
    "enrichmentBacklogCount": 9,
    "googleDiscovered": 78,
    "facebookDiscovered": 19,
    "websiteContactDiscovered": 14,
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
      "reason": "official_website_social_channel_verified",
      "status": "skipped",
      "count": 54
    },
    {
      "reason": "homepage_only_contact_path_requires_verification",
      "status": "skipped",
      "count": 13
    },
    {
      "reason": "official_public_business_email_verified",
      "status": "skipped",
      "count": 12
    },
    {
      "reason": "website_contact_capability_not_verified",
      "status": "skipped",
      "count": 9
    },
    {
      "reason": "concrete_google_discovered_major_customer_instagram",
      "status": "skipped",
      "count": 4
    },
    {
      "reason": "official_website_contact_channel",
      "status": "skipped",
      "count": 4
    },
    {
      "reason": "social_profile_not_first_party_verified",
      "status": "skipped",
      "count": 4
    },
    {
      "reason": "recipient_domain_mail_exchange_unverified",
      "status": "skipped",
      "count": 2
    },
    {
      "reason": "verified_linkedin_profile_ready",
      "status": "skipped",
      "count": 1
    }
  ],
  "blockerCounts": {
    "official_website_social_channel_verified": 54,
    "homepage_only_contact_path_requires_verification": 13,
    "official_public_business_email_verified": 12,
    "website_contact_capability_not_verified": 9,
    "concrete_google_discovered_major_customer_instagram": 4,
    "official_website_contact_channel": 4,
    "social_profile_not_first_party_verified": 4,
    "recipient_domain_mail_exchange_unverified": 2,
    "verified_linkedin_profile_ready": 1
  },
  "queueGoalStatus": {
    "target": 100,
    "potentialPool": 28,
    "queueCount": 78,
    "googleDiscovered": 78,
    "refillNeeded": 72,
    "confirmedToday": 7,
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
  "userVisibleStatus": "Customer development was not performed. Blockers: official_website_social_channel_verified (54); homepage_only_contact_path_requires_verification (13); official_public_business_email_verified (12).",
  "recoveryHint": "Refill the high-ICP pool with 72 verified leads or unblock existing website/social leads before the next run. Confirm the official social profile and safe message entry before rerunning Google-discovered social outreach.",
  "recoveryActions": [
    {
      "reason": "daily_queue_goal_not_reached",
      "action": "Refill high-ICP customer pool",
      "description": "Add or unblock 72 verified high-ICP leads to reach the daily 100 target.",
      "hint": "Refill the high-ICP pool with 72 verified leads or unblock existing website/social leads before the next run.",
      "target": 100,
      "potentialPool": 28,
      "refillNeeded": 72
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
    "stdout": "{\n  \"date\": \"2026-08-27\",\n  \"summary\": {\n    \"totalLeads\": 16,\n    \"highIcp\": 16,\n    \"readyToDevelop\": 47,\n    \"dueNow\": 78,\n    \"visibleTodayQueue\": 82,\n    \"potentialPool\": 27,\n    \"potentialPoolTarget\": 100,\n    \"customerTableHighIcp\": 0,\n    \"refillNeeded\": 73,\n    \"executableCompanies\": 18,\n    \"executableReserveTarget\": 130,\n    \"executableReserveNeeded\": 112,\n    \"executableByChannel\": {\n      \"linkedin\": 2,\n      \"facebook\": 10,\n      \"instagram\": 4,\n      \"email\": 2\n    },\n    \"verifiedSocialCompanies\": 16,\n    \"verifiedSocialReserveTarget\": 20,\n    \"verifiedSocialReserveNeeded\": 4,\n    \"enrichmentBacklogCount\": 9,\n    \"googleDiscovered\": 78,\n    \"facebookDiscovered\": 19,\n    \"websiteContactDiscovered\": 14,\n    \"scheduledLater\": 0,\n    \"cooldown\": 30,\n    \"emailPriority\": 0,\n    \"openAgencyMarket\": 15,\n    \"exclusiveAgencySkipped\": 1,\n    \"needsVerification\": 0,\n    \"retainedLowIcp\": 0\n  },\n  \"bugErrors\": 13,\n  \"queueFile\": \"E:\\\\New project\\\\outreach-dashboard\\\\daily-runs\\\\2026-08-27-daily-automation.json\",\n  \"csvFile\": \"E:\\\\New project\\\\outreach-dashboard\\\\daily-runs\\\\2026-08-27-daily-queue.csv\"\n}",
    "stderr": "",
    "error": "",
    "visibility": {
      "updatedAt": "2026-08-27T14:08:54.881Z",
      "source": "main-refreshDailyAutomationArtifacts",
      "runDate": "2026-08-27",
      "artifactGeneratedAt": "2026-08-27T14:08:51.970Z",
      "executionGeneratedAt": "2026-08-27T14:01:40.664Z",
      "githubSyncUpdatedAt": "2026-08-27T14:02:21.850Z",
      "counts": {
        "dailyQueue": 78,
        "googleDiscovered": 78,
        "websiteContact": 31,
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
        "potentialPool": 27,
        "refillNeeded": 73,
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
  "completedAt": "2026-08-27T14:08:56.061Z"
};
