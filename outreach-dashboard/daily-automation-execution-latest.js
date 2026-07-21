window.DAILY_AUTOMATION_EXECUTION_LATEST = {
  "ok": false,
  "error": "auto-run-daily timed out after 300000ms",
  "completedAt": "2026-07-21T02:22:14.291Z",
  "executionPhase": "browser_execution_timeout",
  "chromeOpened": true,
  "customerDevelopmentPerformed": false,
  "customerMessageSent": false,
  "realDevelopmentCount": 0,
  "reportingVerdict": "no_customer_development_performed",
  "progress": {
    "startedAt": "2026-07-21T02:17:23.138Z",
    "queueDate": "2026-07-21",
    "queueSource": "dailyQueue",
    "dailyQueueCount": 98,
    "candidateCount": 51,
    "executableCount": 13,
    "skippedCount": 170,
    "limit": 13,
    "currentIndex": 7,
    "currentItem": {
      "id": "google-customer-alpinetrek-website-contact",
      "company": "Alpinetrek",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.alpinetrek.co.uk/"
    },
    "completedCount": 6,
    "confirmedSendCount": 0,
    "preparedWebsiteCount": 0,
    "resumedFromCheckpoint": true,
    "checkpointCompletedCount": 4,
    "lastResult": {
      "id": "google-customer-valhalla-pure-outfitters-website-contact",
      "company": "Valhalla Pure Outfitters",
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2"
    }
  },
  "checkpoint": {
    "version": 1,
    "updatedAt": "2026-07-21T02:21:46.444Z",
    "queueDate": "2026-07-21",
    "completed": false,
    "currentItem": {
      "id": "google-customer-alpinetrek-website-contact",
      "company": "Alpinetrek",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.alpinetrek.co.uk/"
    },
    "completedTaskIds": [
      "google-customer-obelink-website-contact",
      "google-customer-au-vieux-campeur-website-contact",
      "google-customer-bergfreunde-website-contact",
      "google-customer-fjellsport-website-contact",
      "google-customer-naturkompaniet-website-contact",
      "google-customer-outnorth-website-contact",
      "google-customer-tentworld-website-contact",
      "google-customer-trekitt-website-contact",
      "google-customer-ultralight-outdoor-gear-website-contact",
      "google-customer-valhalla-pure-outfitters-website-contact"
    ],
    "completedResults": [
      {
        "id": "google-customer-naturkompaniet-website-contact",
        "company": "Naturkompaniet",
        "action": "verify_target",
        "platform": "email",
        "targetUrl": "https://www.naturkompaniet.se/",
        "ok": false,
        "sendStatus": "website_contact_unreachable_skip",
        "evidence": "website_page_unavailable_404: 404;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.naturkompaniet.se/help/contact-us",
          "tabId": "8C15BF6B49BFC123F2B4B06D6F2496DC",
          "title": "404",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "website_page_unavailable_404: 404"
        },
        "result": {
          "ok": false,
          "engine": "codex-chrome-extension-website-contact",
          "browserEngine": "codex-chrome-extension-cdp",
          "mode": "website_contact_unreachable_skip",
          "targetUrl": "https://www.naturkompaniet.se/help/contact-us",
          "chromeOpen": {
            "ok": false,
            "engine": "codex-chrome-extension-cdp",
            "port": 9224,
            "targetUrl": "https://www.naturkompaniet.se/help/contact-us",
            "tabId": "8C15BF6B49BFC123F2B4B06D6F2496DC",
            "title": "404",
            "status": "failed_open",
            "error": "profile_unavailable_or_broken_link",
            "evidence": "website_page_unavailable_404: 404"
          },
          "sendStatus": "website_contact_unreachable_skip",
          "subject": "FLEXTAIL retail partnership | 2026 assortment",
          "draft": "Dear Naturkompaniet Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
          "evidence": "website_page_unavailable_404: 404;website_contact_all_targets_failed:6;contact_path_strategy_v2",
          "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_page_unavailable_404: 404;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Naturkompaniet Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.naturkompaniet.se/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.naturkompaniet.se/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404\"},{\"targetUrl\":\"https://www.naturkompaniet.se/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404\"},{\"targetUrl\":\"https://www.naturkompaniet.se/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.naturkompaniet.se/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404\"},{\"targetUrl\":\"https://www.naturkompaniet.se/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
        }
      },
      {
        "id": "google-customer-outnorth-website-contact",
        "company": "Outnorth",
        "action": "verify_target",
        "platform": "email",
        "targetUrl": "https://www.outnorth.com/",
        "ok": false,
        "sendStatus": "website_contact_unreachable_skip",
        "evidence": "website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/help/contact-us;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.outnorth.com/help/contact-us",
          "tabId": "3BA7BAF88FEEE558E33364AB2042A562",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/3BA7BAF88FEEE558E33364AB2042A562",
          "title": ""
        },
        "result": {
          "ok": false,
          "engine": "codex-chrome-extension-website-contact",
          "browserEngine": "codex-chrome-extension-cdp",
          "mode": "website_contact_unreachable_skip",
          "targetUrl": "https://www.outnorth.com/help/contact-us",
          "chromeOpen": {
            "ok": true,
            "engine": "codex-chrome-extension-cdp",
            "port": 9224,
            "targetUrl": "https://www.outnorth.com/help/contact-us",
            "tabId": "3BA7BAF88FEEE558E33364AB2042A562",
            "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/3BA7BAF88FEEE558E33364AB2042A562",
            "title": ""
          },
          "sendStatus": "website_contact_unreachable_skip",
          "subject": "FLEXTAIL retail partnership | 2026 assortment",
          "draft": "Dear Outnorth Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
          "evidence": "website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/help/contact-us;website_contact_all_targets_failed:6;contact_path_strategy_v2",
          "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/help/contact-us;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Outnorth Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.outnorth.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Kontakt oss\"},{\"targetUrl\":\"https://www.outnorth.com/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/pages/contact-us\"},{\"targetUrl\":\"https://www.outnorth.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/pages/contact\"},{\"targetUrl\":\"https://www.outnorth.com/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/contact-us\"},{\"targetUrl\":\"https://www.outnorth.com/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/contact\"},{\"targetUrl\":\"https://www.outnorth.com/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/help/contact-us\"}]}"
        }
      },
      {
        "id": "google-customer-tentworld-website-contact",
        "company": "Tentworld",
        "action": "verify_target",
        "platform": "email",
        "targetUrl": "https://www.tentworld.com.au/",
        "ok": false,
        "sendStatus": "website_contact_unreachable_skip",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.tentworld.com.au/help/contact-us",
          "tabId": "0D1A7A03BD46133D2615385D81700C93",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/0D1A7A03BD46133D2615385D81700C93",
          "title": "Home Page - Tentworld"
        },
        "result": {
          "ok": false,
          "engine": "codex-chrome-extension-website-contact",
          "browserEngine": "codex-chrome-extension-cdp",
          "mode": "website_contact_unreachable_skip",
          "targetUrl": "https://www.tentworld.com.au/help/contact-us",
          "chromeOpen": {
            "ok": true,
            "engine": "codex-chrome-extension-cdp",
            "port": 9224,
            "targetUrl": "https://www.tentworld.com.au/help/contact-us",
            "tabId": "0D1A7A03BD46133D2615385D81700C93",
            "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/0D1A7A03BD46133D2615385D81700C93",
            "title": "Home Page - Tentworld"
          },
          "sendStatus": "website_contact_unreachable_skip",
          "subject": "FLEXTAIL retail partnership | 2026 assortment",
          "draft": "Dear Tentworld Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
          "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
          "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Tentworld Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.tentworld.com.au/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.tentworld.com.au/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.tentworld.com.au/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.tentworld.com.au/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.tentworld.com.au/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.tentworld.com.au/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
        }
      },
      {
        "id": "google-customer-trekitt-website-contact",
        "company": "Trekitt",
        "action": "verify_target",
        "platform": "email",
        "targetUrl": "https://www.trekitt.co.uk/",
        "ok": false,
        "sendStatus": "website_contact_unreachable_skip",
        "evidence": "unavailable_profile_page: Clothing\nFootwear\nRucksacks\nCamping\nEquipment\nActivity\nBrands\nRental\nInfo & Bookings\nKnowledge\nOutlet\nNew Arrivals\nFree Next Day Delivery: Orders Over £65\nCustomer Rewards\n90-day R;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.trekitt.co.uk/help/contact-us",
          "tabId": "83039017346B4C7C23C5BA470FDBC903",
          "title": "Page not found",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "unavailable_profile_page: Clothing\nFootwear\nRucksacks\nCamping\nEquipment\nActivity\nBrands\nRental\nInfo & Bookings\nKnowledge\nOutlet\nNew Arrivals\nFree Next Day Delivery: Orders Over £65\nCustomer Rewards\n90-day R"
        },
        "result": {
          "ok": false,
          "engine": "codex-chrome-extension-website-contact",
          "browserEngine": "codex-chrome-extension-cdp",
          "mode": "website_contact_unreachable_skip",
          "targetUrl": "https://www.trekitt.co.uk/help/contact-us",
          "chromeOpen": {
            "ok": false,
            "engine": "codex-chrome-extension-cdp",
            "port": 9224,
            "targetUrl": "https://www.trekitt.co.uk/help/contact-us",
            "tabId": "83039017346B4C7C23C5BA470FDBC903",
            "title": "Page not found",
            "status": "failed_open",
            "error": "profile_unavailable_or_broken_link",
            "evidence": "unavailable_profile_page: Clothing\nFootwear\nRucksacks\nCamping\nEquipment\nActivity\nBrands\nRental\nInfo & Bookings\nKnowledge\nOutlet\nNew Arrivals\nFree Next Day Delivery: Orders Over £65\nCustomer Rewards\n90-day R"
          },
          "sendStatus": "website_contact_unreachable_skip",
          "subject": "FLEXTAIL retail partnership | 2026 assortment",
          "draft": "Dear Trekitt Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
          "evidence": "unavailable_profile_page: Clothing\nFootwear\nRucksacks\nCamping\nEquipment\nActivity\nBrands\nRental\nInfo & Bookings\nKnowledge\nOutlet\nNew Arrivals\nFree Next Day Delivery: Orders Over £65\nCustomer Rewards\n90-day R;website_contact_all_targets_failed:6;contact_path_strategy_v2",
          "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"unavailable_profile_page: Clothing\\nFootwear\\nRucksacks\\nCamping\\nEquipment\\nActivity\\nBrands\\nRental\\nInfo & Bookings\\nKnowledge\\nOutlet\\nNew Arrivals\\nFree Next Day Delivery: Orders Over £65\\nCustomer Rewards\\n90-day R;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Trekitt Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.trekitt.co.uk/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.trekitt.co.uk/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Page not found\"},{\"targetUrl\":\"https://www.trekitt.co.uk/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.trekitt.co.uk/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Page not found\"},{\"targetUrl\":\"https://www.trekitt.co.uk/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Contact us\"},{\"targetUrl\":\"https://www.trekitt.co.uk/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Clothing\\nFootwear\\nRucksacks\\nCamping\\nEquipment\\nActivity\\nBrands\\nRental\\nInfo & Bookings\\nKnowledge\\nOutlet\\nNew Arrivals\\nFree Next Day Delivery: Orders Over £65\\nCustomer Rewards\\n90-day R\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
        }
      },
      {
        "id": "google-customer-ultralight-outdoor-gear-website-contact",
        "company": "Ultralight Outdoor Gear",
        "action": "verify_target",
        "platform": "email",
        "targetUrl": "https://ultralightoutdoorgear.co.uk/",
        "ok": false,
        "sendStatus": "website_contact_unreachable_skip",
        "evidence": "unavailable_profile_page: Skip to main content\nPrevious\nSpend over £25 and get our Anniversary Neck Tube for 1p\nFree UK Delivery when you spend over £ 15\nTime Saver Guide to Choosing a Waterproof Jacket\nSpe;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://ultralightoutdoorgear.co.uk/help/contact-us",
          "tabId": "511522EBDFF8E19BEA12A9E555FEAB70",
          "title": "Ultralight Outdoor Gear - Not Found",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "unavailable_profile_page: Skip to main content\nPrevious\nSpend over £25 and get our Anniversary Neck Tube for 1p\nFree UK Delivery when you spend over £ 15\nTime Saver Guide to Choosing a Waterproof Jacket\nSpe"
        },
        "result": {
          "ok": false,
          "engine": "codex-chrome-extension-website-contact",
          "browserEngine": "codex-chrome-extension-cdp",
          "mode": "website_contact_unreachable_skip",
          "targetUrl": "https://ultralightoutdoorgear.co.uk/help/contact-us",
          "chromeOpen": {
            "ok": false,
            "engine": "codex-chrome-extension-cdp",
            "port": 9224,
            "targetUrl": "https://ultralightoutdoorgear.co.uk/help/contact-us",
            "tabId": "511522EBDFF8E19BEA12A9E555FEAB70",
            "title": "Ultralight Outdoor Gear - Not Found",
            "status": "failed_open",
            "error": "profile_unavailable_or_broken_link",
            "evidence": "unavailable_profile_page: Skip to main content\nPrevious\nSpend over £25 and get our Anniversary Neck Tube for 1p\nFree UK Delivery when you spend over £ 15\nTime Saver Guide to Choosing a Waterproof Jacket\nSpe"
          },
          "sendStatus": "website_contact_unreachable_skip",
          "subject": "FLEXTAIL retail partnership | 2026 assortment",
          "draft": "Dear Ultralight Outdoor Gear Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
          "evidence": "unavailable_profile_page: Skip to main content\nPrevious\nSpend over £25 and get our Anniversary Neck Tube for 1p\nFree UK Delivery when you spend over £ 15\nTime Saver Guide to Choosing a Waterproof Jacket\nSpe;website_contact_all_targets_failed:6;contact_path_strategy_v2",
          "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"unavailable_profile_page: Skip to main content\\nPrevious\\nSpend over £25 and get our Anniversary Neck Tube for 1p\\nFree UK Delivery when you spend over £ 15\\nTime Saver Guide to Choosing a Waterproof Jacket\\nSpe;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Ultralight Outdoor Gear Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://ultralightoutdoorgear.co.uk/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Contact Us\"},{\"targetUrl\":\"https://ultralightoutdoorgear.co.uk/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Skip to main content\\nFree UK Delivery when you spend over £ 15\\nEquipment\\nMens\\nWomens\\nTravel\\nNew In\\nSale\\nContent\\nBrands\\n GBP \\n \\n \\nHome  Error\\n404 Error - Page not found\\n\\nUh oh, look\"},{\"targetUrl\":\"https://ultralightoutdoorgear.co.uk/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Skip to main content\\nFree UK Delivery when you spend over £ 15\\nEquipment\\nMens\\nWomens\\nTravel\\nNew In\\nSale\\nContent\\nBrands\\n GBP \\n \\n \\nHome  Error\\n404 Error - Page not found\\n\\nUh oh, look\"},{\"targetUrl\":\"https://ultralightoutdoorgear.co.uk/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Contact Us\"},{\"targetUrl\":\"https://ultralightoutdoorgear.co.uk/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Skip to main content\\nPrevious\\nSpend over £25 and get our Anniversary Neck Tube for 1p\\nFree UK Delivery when you spend over £ 15\\nTime Saver Guide to Choosing a Waterproof Jacket\\nSpe\"},{\"targetUrl\":\"https://ultralightoutdoorgear.co.uk/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Skip to main content\\nPrevious\\nSpend over £25 and get our Anniversary Neck Tube for 1p\\nFree UK Delivery when you spend over £ 15\\nTime Saver Guide to Choosing a Waterproof Jacket\\nSpe\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
        }
      },
      {
        "id": "google-customer-valhalla-pure-outfitters-website-contact",
        "company": "Valhalla Pure Outfitters",
        "action": "verify_target",
        "platform": "email",
        "targetUrl": "https://vpo.ca/",
        "ok": false,
        "sendStatus": "website_contact_unreachable_skip",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://vpo.ca/help/contact-us",
          "tabId": "C654BCB9F89B834514BF0AF246D2115A",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/C654BCB9F89B834514BF0AF246D2115A",
          "title": "Valhalla Pure Outfitters | VPO Canada"
        },
        "result": {
          "ok": false,
          "engine": "codex-chrome-extension-website-contact",
          "browserEngine": "codex-chrome-extension-cdp",
          "mode": "website_contact_unreachable_skip",
          "targetUrl": "https://vpo.ca/help/contact-us",
          "chromeOpen": {
            "ok": true,
            "engine": "codex-chrome-extension-cdp",
            "port": 9224,
            "targetUrl": "https://vpo.ca/help/contact-us",
            "tabId": "C654BCB9F89B834514BF0AF246D2115A",
            "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/C654BCB9F89B834514BF0AF246D2115A",
            "title": "Valhalla Pure Outfitters | VPO Canada"
          },
          "sendStatus": "website_contact_unreachable_skip",
          "subject": "FLEXTAIL retail partnership | 2026 assortment",
          "draft": "Dear Valhalla Pure Outfitters Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
          "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
          "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Valhalla Pure Outfitters Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://vpo.ca/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://vpo.ca/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Homepage\\n/\\n404\\nOops! This Page Could Not Be Found\\n\\nNot Found\\n\\nBACK TO VPO HOME\"},{\"targetUrl\":\"https://vpo.ca/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Homepage\\n/\\n404\\nOops! This Page Could Not Be Found\\n\\nNot Found\\n\\nBACK TO VPO HOME\"},{\"targetUrl\":\"https://vpo.ca/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Homepage\\n/\\nHomepage\\n404\\nOops! This Page Could Not Be Found\\n\\nhttps://vpo.ca/contact-us could not be found\\n\\nBACK TO VPO HOME\"},{\"targetUrl\":\"https://vpo.ca/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_403: Homepage\\n/\\nContact Us\\nCONTACT US\\ne-Store Customer Service\\nHave a question about an online order?\\nFAQ\\nRead our FAQ\\nEmail\\ncs@vpo.ca\\nPhone\\n(250) 542-9800 ext. 200\\n(8:00 AM - 4:00 PM M\"},{\"targetUrl\":\"https://vpo.ca/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
        }
      }
    ]
  },
  "blockerSummary": [
    {
      "reason": "browser_execution_timeout",
      "count": 1,
      "examples": [
        {
          "id": "google-customer-alpinetrek-website-contact",
          "company": "Alpinetrek",
          "action": "verify_target",
          "platform": "email",
          "targetUrl": "https://www.alpinetrek.co.uk/"
        }
      ]
    }
  ],
  "blockerCounts": {
    "browser_execution_timeout": 1
  },
  "queueGoalStatus": {
    "target": 100,
    "potentialPool": 98,
    "queueCount": 98,
    "googleDiscovered": 74,
    "refillNeeded": 2,
    "reached": false,
    "action": "Add more verified high-ICP sources or unblock existing website/social leads."
  },
  "recoveryHint": "Refill the high-ICP pool with 2 verified leads or unblock existing website/social leads before the next run. Retry with a smaller DAILY_EXECUTE_LIMIT or inspect the current browser page before rerunning social outreach.",
  "recoveryActions": [
    {
      "reason": "daily_queue_goal_not_reached",
      "action": "Refill high-ICP customer pool",
      "description": "Add or unblock 2 verified high-ICP leads to reach the daily 100 target.",
      "hint": "Refill the high-ICP pool with 2 verified leads or unblock existing website/social leads before the next run.",
      "target": 100,
      "potentialPool": 98,
      "refillNeeded": 2
    },
    {
      "reason": "browser_execution_timeout",
      "action": "Reduce browser execution batch",
      "description": "Retry with a smaller DAILY_EXECUTE_LIMIT or inspect the current social page that timed out.",
      "hint": "Retry with a smaller DAILY_EXECUTE_LIMIT or inspect the current browser page before rerunning social outreach."
    }
  ]
};
