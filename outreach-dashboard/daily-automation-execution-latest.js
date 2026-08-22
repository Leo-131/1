window.DAILY_AUTOMATION_EXECUTION_LATEST = {
  "ok": false,
  "browserTransportRequested": "codex-extension-first",
  "browserTransportUsed": "cdp",
  "browserTransportFallbackReason": "extension_bridge_not_available_process_local_cdp",
  "extensionReceiptCount": 0,
  "executionPhase": "browser_execution",
  "chromeStage": "opened",
  "chromeOpened": true,
  "chromeOpenedCount": 12,
  "customerDevelopmentPerformed": false,
  "customerMessageSent": false,
  "realDevelopmentCount": 0,
  "reportingVerdict": "no_customer_development_performed",
  "engine": "Browser transport queue bridge",
  "mode": "serial-single-target",
  "batchMode": "parallel-batches",
  "parallelLimit": 1,
  "limit": 13,
  "queueDate": "2026-08-23",
  "queueSource": "dailyPotentialPool",
  "executed": [
    {
      "id": "google-customer-palisade-trading-website-contact",
      "company": "Palisade Trading",
      "action": "develop",
      "platform": "website_form",
      "targetUrl": "https://www.palisadetrading.com/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "customer_execution_timeout:90000;queue_continued_to_next_customer",
      "timestamp": "2026-08-22T19:09:25.032Z",
      "chromeOpen": null,
      "result": {
        "ok": false,
        "timedOut": true,
        "sendStatus": "failed_open",
        "reason": "customer_execution_timeout",
        "evidence": "customer_execution_timeout:90000;queue_continued_to_next_customer",
        "chromeOpen": null,
        "output": "{\"verdict\":\"failed_open\",\"sendStatus\":\"failed_open\",\"evidence\":\"customer_execution_timeout:90000;queue_continued_to_next_customer\",\"nextAction\":\"The customer exceeded its bounded execution window. Its automation tabs were closed and the queue continued without retrying or claiming a send.\",\"company\":\"Palisade Trading\"}"
      }
    },
    {
      "id": "google-customer-wwsra-website-contact",
      "company": "WWSRA",
      "action": "email_priority",
      "platform": "website_form",
      "targetUrl": "https://wwsra.com/brands-seeking-reps-submission/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "unavailable_profile_page: Page not found - WWSRA;website_contact_all_targets_failed:7;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:10:20.004Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://wwsra.com/help/contact-us",
        "tabId": "4EC6B38B25844294E7D3A4FDBB7AC3CD",
        "title": "Page not found - WWSRA",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "unavailable_profile_page: Page not found - WWSRA"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://wwsra.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://wwsra.com/help/contact-us",
          "tabId": "4EC6B38B25844294E7D3A4FDBB7AC3CD",
          "title": "Page not found - WWSRA",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "unavailable_profile_page: Page not found - WWSRA"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear WWSRA Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "unavailable_profile_page: Page not found - WWSRA;website_contact_all_targets_failed:7;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"unavailable_profile_page: Page not found - WWSRA;website_contact_all_targets_failed:7;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear WWSRA Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://wwsra.com/brands-seeking-reps-submission/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://wwsra.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:CONTACT\"},{\"targetUrl\":\"https://wwsra.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Skip to content\\nSHOWS\\nJOIN\\nSPONSORSHIPS\\nFAQ\\nREPS/LINES\\nCONTACT\\nLOG IN\\n404\\n\\nOH NO! THIS PAGE MUST BE AT A SHOW (NOT HERE)!\\n\\nPLEASE CONTACT US IF YOU NEED HELP NAVIGATING OUR SITE,\\nO\"},{\"targetUrl\":\"https://wwsra.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:SHOWS\"},{\"targetUrl\":\"https://wwsra.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Page not found - WWSRA\"},{\"targetUrl\":\"https://wwsra.com/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:SHOWS\"},{\"targetUrl\":\"https://wwsra.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Page not found - WWSRA\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    },
    {
      "id": "google-customer-four-corners-uk-website-contact",
      "company": "Four Corners UK",
      "action": "email_priority",
      "platform": "website_form",
      "targetUrl": "https://www.fourcornersuk.com/contact",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_page_unavailable_404: 404\n\n错误 - 找不到网页\n\n请检查 URL。\n\n否则， 请点击这里被重定向到主页。;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:10:39.913Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.fourcornersuk.com/help/contact-us",
        "tabId": "3BA8DC74006AD7FEA082F0D9EC2C07BB",
        "title": "404 - 找不到页面",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "website_page_unavailable_404: 404\n\n错误 - 找不到网页\n\n请检查 URL。\n\n否则， 请点击这里被重定向到主页。"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.fourcornersuk.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.fourcornersuk.com/help/contact-us",
          "tabId": "3BA8DC74006AD7FEA082F0D9EC2C07BB",
          "title": "404 - 找不到页面",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "website_page_unavailable_404: 404\n\n错误 - 找不到网页\n\n请检查 URL。\n\n否则， 请点击这里被重定向到主页。"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Four Corners UK Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_page_unavailable_404: 404\n\n错误 - 找不到网页\n\n请检查 URL。\n\n否则， 请点击这里被重定向到主页。;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_page_unavailable_404: 404\\n\\n错误 - 找不到网页\\n\\n请检查 URL。\\n\\n否则， 请点击这里被重定向到主页。;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Four Corners UK Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.fourcornersuk.com/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.fourcornersuk.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.fourcornersuk.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404\\n\\n错误 - 找不到网页\\n\\n请检查 URL。\\n\\n否则， 请点击这里被重定向到主页。\"},{\"targetUrl\":\"https://www.fourcornersuk.com/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404\\n\\n错误 - 找不到网页\\n\\n请检查 URL。\\n\\n否则， 请点击这里被重定向到主页。\"},{\"targetUrl\":\"https://www.fourcornersuk.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404\\n\\n错误 - 找不到网页\\n\\n请检查 URL。\\n\\n否则， 请点击这里被重定向到主页。\"},{\"targetUrl\":\"https://www.fourcornersuk.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404\\n\\n错误 - 找不到网页\\n\\n请检查 URL。\\n\\n否则， 请点击这里被重定向到主页。\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    },
    {
      "id": "google-customer-ludwikoski-associates-website-contact",
      "company": "Ludwikoski & Associates",
      "action": "email_priority",
      "platform": "website_form",
      "targetUrl": "https://www.ludreps.com/about-us/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:7;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:11:14.216Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.ludreps.com/help/contact-us",
        "tabId": "8C8D5F6F2A38CA0FA265C00044321A47",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/8C8D5F6F2A38CA0FA265C00044321A47",
        "title": "WordPress › Error"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.ludreps.com/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.ludreps.com/help/contact-us",
          "tabId": "8C8D5F6F2A38CA0FA265C00044321A47",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/8C8D5F6F2A38CA0FA265C00044321A47",
          "title": "WordPress › Error"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Ludwikoski & Associates Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:7;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:7;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Ludwikoski & Associates Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.ludreps.com/about-us/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.ludreps.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.ludreps.com/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.ludreps.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.ludreps.com/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.ludreps.com/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.ludreps.com/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
      }
    },
    {
      "id": "google-customer-nomadic-supply-company-website-contact",
      "company": "Nomadic Supply Company",
      "action": "develop",
      "platform": "website_form",
      "targetUrl": "https://nomadicsupply.com/sell-your-products-with-nomadic-supply-company/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "website_page_unavailable_403: 403 Forbidden\nnginx;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:12:24.111Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/nomadic.supply/",
        "tabId": "B8CA130A226D045B80DFE25B5D1D9C1A",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/B8CA130A226D045B80DFE25B5D1D9C1A",
        "title": "Nomadic Supply Company® (@nomadic.supply) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "browserEngine": "codex-chrome-cdp",
        "mode": "codex_chrome_cdp",
        "targetUrl": "https://www.instagram.com/nomadic.supply/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/nomadic.supply/",
          "tabId": "B8CA130A226D045B80DFE25B5D1D9C1A",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/B8CA130A226D045B80DFE25B5D1D9C1A",
          "title": "Nomadic Supply Company® (@nomadic.supply) · Instagram 照片和视频"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"website_page_unavailable_403: 403 Forbidden\\nnginx;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2\",\"nextAction\":\"Composer not detected; pause automation and notify operator only if retry would be unsafe.\",\"draft\":\"Hi Nomadic Supply Company team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 95,
          "reason": "local_codex_extension_template",
          "draft": "Hi Nomadic Supply Company team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Chrome CDP fallback",
        "glmModel": "not_used",
        "followup": false,
        "evidence": "website_page_unavailable_403: 403 Forbidden\nnginx;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2",
        "socialFallbackEvidence": "instagram_message_button_clicked_composer_not_found"
      }
    },
    {
      "id": "google-customer-alpinewaves-website-contact",
      "company": "AlpineWaves",
      "action": "develop",
      "platform": "website_form",
      "targetUrl": "https://www.alpinewaves.co.uk/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:13:38.433Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/alpinewavesco",
        "tabId": "3C92EA26A8877DC3CF6636F92EDBC22C",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/3C92EA26A8877DC3CF6636F92EDBC22C",
        "title": "ALPINE ~ WAVES (@alpinewavesco) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "browserEngine": "codex-chrome-cdp",
        "mode": "codex_chrome_cdp",
        "targetUrl": "https://www.instagram.com/alpinewavesco",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/alpinewavesco",
          "tabId": "3C92EA26A8877DC3CF6636F92EDBC22C",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/3C92EA26A8877DC3CF6636F92EDBC22C",
          "title": "ALPINE ~ WAVES (@alpinewavesco) · Instagram 照片和视频"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2\",\"nextAction\":\"Composer not detected; pause automation and notify operator only if retry would be unsafe.\",\"draft\":\"Hi AlpineWaves team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a distributor/importer, the strongest fit is regional sell-through, channel fit, margin-ready product line, and whether they cover outdoor/travel electronics buyers; your UK and Ireland outdoor brand sales agency focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the owner of distribution evaluation or the best time for a short intro video meeting?\",\"sendStatus\":\"failed_open\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 94,
          "reason": "local_codex_extension_template",
          "draft": "Hi AlpineWaves team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a distributor/importer, the strongest fit is regional sell-through, channel fit, margin-ready product line, and whether they cover outdoor/travel electronics buyers; your UK and Ireland outdoor brand sales agency focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the owner of distribution evaluation or the best time for a short intro video meeting?"
        },
        "executionLayer": "Chrome CDP fallback",
        "glmModel": "not_used",
        "followup": false,
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2",
        "socialFallbackEvidence": "instagram_message_button_clicked_composer_not_found"
      }
    },
    {
      "id": "google-customer-sanitas-sales-group-website-contact",
      "company": "Sanitas Sales Group",
      "action": "email_priority",
      "platform": "website_form",
      "targetUrl": "https://sanitassalesgroup.com/contact/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "unavailable_profile_page: Skip to primary navigation\nSkip to main content\nSkip to footer\n\nSANITAS SALES GROUP\n\nSales and marketing contractors serving the greater Rocky Mountain region\n\nBRANDS\n \nOUR TERRITO;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:14:22.152Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://sanitassalesgroup.com/help/contact-us",
        "tabId": "CE5FBB19DFBA6288FDA837DDE109C8D0",
        "title": "Page not found – Sanitas Sales Group",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "unavailable_profile_page: Skip to primary navigation\nSkip to main content\nSkip to footer\n\nSANITAS SALES GROUP\n\nSales and marketing contractors serving the greater Rocky Mountain region\n\nBRANDS\n \nOUR TERRITO"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://sanitassalesgroup.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://sanitassalesgroup.com/help/contact-us",
          "tabId": "CE5FBB19DFBA6288FDA837DDE109C8D0",
          "title": "Page not found – Sanitas Sales Group",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "unavailable_profile_page: Skip to primary navigation\nSkip to main content\nSkip to footer\n\nSANITAS SALES GROUP\n\nSales and marketing contractors serving the greater Rocky Mountain region\n\nBRANDS\n \nOUR TERRITO"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Sanitas Sales Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "unavailable_profile_page: Skip to primary navigation\nSkip to main content\nSkip to footer\n\nSANITAS SALES GROUP\n\nSales and marketing contractors serving the greater Rocky Mountain region\n\nBRANDS\n \nOUR TERRITO;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"unavailable_profile_page: Skip to primary navigation\\nSkip to main content\\nSkip to footer\\n\\nSANITAS SALES GROUP\\n\\nSales and marketing contractors serving the greater Rocky Mountain region\\n\\nBRANDS\\n \\nOUR TERRITO;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Sanitas Sales Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://sanitassalesgroup.com/contact/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://sanitassalesgroup.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Skip to primary navigation\"},{\"targetUrl\":\"https://sanitassalesgroup.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Skip to primary navigation\\nSkip to main content\\nSkip to footer\\n\\nSANITAS SALES GROUP\\n\\nSales and marketing contractors serving the greater Rocky Mountain region\\n\\nBRANDS\\n \\nOUR TERRITO\"},{\"targetUrl\":\"https://sanitassalesgroup.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Skip to primary navigation\"},{\"targetUrl\":\"https://sanitassalesgroup.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Skip to primary navigation\\nSkip to main content\\nSkip to footer\\n\\nSANITAS SALES GROUP\\n\\nSales and marketing contractors serving the greater Rocky Mountain region\\n\\nBRANDS\\n \\nOUR TERRITO\"},{\"targetUrl\":\"https://sanitassalesgroup.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Skip to primary navigation\\nSkip to main content\\nSkip to footer\\n\\nSANITAS SALES GROUP\\n\\nSales and marketing contractors serving the greater Rocky Mountain region\\n\\nBRANDS\\n \\nOUR TERRITO\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    },
    {
      "id": "google-customer-excell-marketing-website-contact",
      "company": "Excell Marketing",
      "action": "email_priority",
      "platform": "website_form",
      "targetUrl": "https://www.excellmarketing.com/Contact/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "unavailable_profile_page: Home\nWho We Are\nWhat We Do\nProduct Lines\nContact\n920-662-1884\n404\nPage Not Found\nWe couldn't find the page you were looking for\nContact\n1 920 662 1884\nAddress\n2121 Woodale Avenue\nG;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:15:09.176Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.excellmarketing.com/help/contact-us",
        "tabId": "5DFDD03FB69A35CA85CB38AA8AAFBFAD",
        "title": "",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "unavailable_profile_page: Home\nWho We Are\nWhat We Do\nProduct Lines\nContact\n920-662-1884\n404\nPage Not Found\nWe couldn't find the page you were looking for\nContact\n1 920 662 1884\nAddress\n2121 Woodale Avenue\nG"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.excellmarketing.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.excellmarketing.com/help/contact-us",
          "tabId": "5DFDD03FB69A35CA85CB38AA8AAFBFAD",
          "title": "",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "unavailable_profile_page: Home\nWho We Are\nWhat We Do\nProduct Lines\nContact\n920-662-1884\n404\nPage Not Found\nWe couldn't find the page you were looking for\nContact\n1 920 662 1884\nAddress\n2121 Woodale Avenue\nG"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Excell Marketing Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "unavailable_profile_page: Home\nWho We Are\nWhat We Do\nProduct Lines\nContact\n920-662-1884\n404\nPage Not Found\nWe couldn't find the page you were looking for\nContact\n1 920 662 1884\nAddress\n2121 Woodale Avenue\nG;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"unavailable_profile_page: Home\\nWho We Are\\nWhat We Do\\nProduct Lines\\nContact\\n920-662-1884\\n404\\nPage Not Found\\nWe couldn't find the page you were looking for\\nContact\\n1 920 662 1884\\nAddress\\n2121 Woodale Avenue\\nG;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Excell Marketing Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.excellmarketing.com/Contact/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Contact\"},{\"targetUrl\":\"https://www.excellmarketing.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Contact\"},{\"targetUrl\":\"https://www.excellmarketing.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Home\\nWho We Are\\nWhat We Do\\nProduct Lines\\nContact\\n920-662-1884\\n404\\nPage Not Found\\nWe couldn't find the page you were looking for\\nContact\\n1 920 662 1884\\nAddress\\n2121 Woodale Avenue\\nG\"},{\"targetUrl\":\"https://www.excellmarketing.com/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Home\\nWho We Are\\nWhat We Do\\nProduct Lines\\nContact\\n920-662-1884\\n404\\nPage Not Found\\nWe couldn't find the page you were looking for\\nContact\\n1 920 662 1884\\nAddress\\n2121 Woodale Avenue\\nG\"},{\"targetUrl\":\"https://www.excellmarketing.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Home\\nWho We Are\\nWhat We Do\\nProduct Lines\\nContact\\n920-662-1884\\n404\\nPage Not Found\\nWe couldn't find the page you were looking for\\nContact\\n1 920 662 1884\\nAddress\\n2121 Woodale Avenue\\nG\"},{\"targetUrl\":\"https://www.excellmarketing.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Home\\nWho We Are\\nWhat We Do\\nProduct Lines\\nContact\\n920-662-1884\\n404\\nPage Not Found\\nWe couldn't find the page you were looking for\\nContact\\n1 920 662 1884\\nAddress\\n2121 Woodale Avenue\\nG\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    },
    {
      "id": "google-customer-ascension-sales-group-website-contact",
      "company": "Ascension Sales Group",
      "action": "develop",
      "platform": "website_form",
      "targetUrl": "https://www.ascensionsalesgroup.com/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_page_unavailable_404: 404 Not Found | Ascension Sales Group;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:15:28.457Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.ascensionsalesgroup.com/help/contact-us",
        "tabId": "824A3F16BE52328AC8594286A4605F13",
        "title": "404 Not Found | Ascension Sales Group",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "website_page_unavailable_404: 404 Not Found | Ascension Sales Group"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.ascensionsalesgroup.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.ascensionsalesgroup.com/help/contact-us",
          "tabId": "824A3F16BE52328AC8594286A4605F13",
          "title": "404 Not Found | Ascension Sales Group",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "website_page_unavailable_404: 404 Not Found | Ascension Sales Group"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Ascension Sales Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_page_unavailable_404: 404 Not Found | Ascension Sales Group;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_page_unavailable_404: 404 Not Found | Ascension Sales Group;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Ascension Sales Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.ascensionsalesgroup.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.ascensionsalesgroup.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404 Not Found | Ascension Sales Group\"},{\"targetUrl\":\"https://www.ascensionsalesgroup.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.ascensionsalesgroup.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404 Not Found | Ascension Sales Group\"},{\"targetUrl\":\"https://www.ascensionsalesgroup.com/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404 Not Found | Ascension Sales Group\"},{\"targetUrl\":\"https://www.ascensionsalesgroup.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404 Not Found | Ascension Sales Group\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    },
    {
      "id": "google-customer-suggs-nicholas-shea-website-contact",
      "company": "Suggs-Nicholas-Shea",
      "action": "email_priority",
      "platform": "website_form",
      "targetUrl": "https://suggsnicholasshea.com/contact/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "unavailable_profile_page: Skip to content\nSuggs-Nicholas-Shea, Inc.\nEastern US Outdoor Manufacturer Representatives\nHome\nAbout\nTeam\nVendors\nContact\nPage not found\nYou are here:\nHomeError 404\nOops! That page;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:16:26.214Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://suggsnicholasshea.com/help/contact-us",
        "tabId": "9E4568B98C3FC1265EECD1E5A7B03912",
        "title": "Page not found – Suggs-Nicholas-Shea, Inc.",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "unavailable_profile_page: Skip to content\nSuggs-Nicholas-Shea, Inc.\nEastern US Outdoor Manufacturer Representatives\nHome\nAbout\nTeam\nVendors\nContact\nPage not found\nYou are here:\nHomeError 404\nOops! That page"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://suggsnicholasshea.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://suggsnicholasshea.com/help/contact-us",
          "tabId": "9E4568B98C3FC1265EECD1E5A7B03912",
          "title": "Page not found – Suggs-Nicholas-Shea, Inc.",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "unavailable_profile_page: Skip to content\nSuggs-Nicholas-Shea, Inc.\nEastern US Outdoor Manufacturer Representatives\nHome\nAbout\nTeam\nVendors\nContact\nPage not found\nYou are here:\nHomeError 404\nOops! That page"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Suggs-Nicholas-Shea Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "unavailable_profile_page: Skip to content\nSuggs-Nicholas-Shea, Inc.\nEastern US Outdoor Manufacturer Representatives\nHome\nAbout\nTeam\nVendors\nContact\nPage not found\nYou are here:\nHomeError 404\nOops! That page;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"unavailable_profile_page: Skip to content\\nSuggs-Nicholas-Shea, Inc.\\nEastern US Outdoor Manufacturer Representatives\\nHome\\nAbout\\nTeam\\nVendors\\nContact\\nPage not found\\nYou are here:\\nHomeError 404\\nOops! That page;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Suggs-Nicholas-Shea Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://suggsnicholasshea.com/contact/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Vendors\"},{\"targetUrl\":\"https://suggsnicholasshea.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Vendors\"},{\"targetUrl\":\"https://suggsnicholasshea.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Skip to content\\nSuggs-Nicholas-Shea, Inc.\\nEastern US Outdoor Manufacturer Representatives\\nHome\\nAbout\\nTeam\\nVendors\\nContact\\nPage not found\\nYou are here:\\nHomeError 404\\nOops! That page\"},{\"targetUrl\":\"https://suggsnicholasshea.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Vendors\"},{\"targetUrl\":\"https://suggsnicholasshea.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Skip to content\\nSuggs-Nicholas-Shea, Inc.\\nEastern US Outdoor Manufacturer Representatives\\nHome\\nAbout\\nTeam\\nVendors\\nContact\\nPage not found\\nYou are here:\\nHomeError 404\\nOops! That page\"},{\"targetUrl\":\"https://suggsnicholasshea.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Skip to content\\nSuggs-Nicholas-Shea, Inc.\\nEastern US Outdoor Manufacturer Representatives\\nHome\\nAbout\\nTeam\\nVendors\\nContact\\nPage not found\\nYou are here:\\nHomeError 404\\nOops! That page\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    },
    {
      "id": "google-customer-gargano-atkins-sales-marketing-website-contact",
      "company": "Gargano Atkins Sales & Marketing",
      "action": "develop",
      "platform": "website_form",
      "targetUrl": "https://garganoatkins.com/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_page_unavailable_404: File not found (404 error)\n\nIf you think what you're looking for should be here, please contact the site owner.;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:16:48.648Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://garganoatkins.com/help/contact-us",
        "tabId": "4214E0B9EC69C3B2A4DA22B8FC087E10",
        "title": "404 Not Found",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "website_page_unavailable_404: File not found (404 error)\n\nIf you think what you're looking for should be here, please contact the site owner."
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://garganoatkins.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://garganoatkins.com/help/contact-us",
          "tabId": "4214E0B9EC69C3B2A4DA22B8FC087E10",
          "title": "404 Not Found",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "website_page_unavailable_404: File not found (404 error)\n\nIf you think what you're looking for should be here, please contact the site owner."
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Gargano Atkins Sales & Marketing Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_page_unavailable_404: File not found (404 error)\n\nIf you think what you're looking for should be here, please contact the site owner.;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Gargano Atkins Sales & Marketing Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://garganoatkins.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://garganoatkins.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.\"},{\"targetUrl\":\"https://garganoatkins.com/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.\"},{\"targetUrl\":\"https://garganoatkins.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.\"},{\"targetUrl\":\"https://garganoatkins.com/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.\"},{\"targetUrl\":\"https://garganoatkins.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    },
    {
      "id": "google-customer-haynes-florance-associates-website-contact",
      "company": "Haynes Florance & Associates",
      "action": "develop",
      "platform": "website_form",
      "targetUrl": "https://haynes-florance.com/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_page_unavailable_404: File not found (404 error)\n\nIf you think what you're looking for should be here, please contact the site owner.;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:17:30.560Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://haynes-florance.com/help/contact-us",
        "tabId": "ED5F790E3656D990A779FFE3F294418B",
        "title": "404 Not Found",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "website_page_unavailable_404: File not found (404 error)\n\nIf you think what you're looking for should be here, please contact the site owner."
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://haynes-florance.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://haynes-florance.com/help/contact-us",
          "tabId": "ED5F790E3656D990A779FFE3F294418B",
          "title": "404 Not Found",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "website_page_unavailable_404: File not found (404 error)\n\nIf you think what you're looking for should be here, please contact the site owner."
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Haynes Florance & Associates Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_page_unavailable_404: File not found (404 error)\n\nIf you think what you're looking for should be here, please contact the site owner.;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Haynes Florance & Associates Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://haynes-florance.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:CONTACT\"},{\"targetUrl\":\"https://haynes-florance.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.\"},{\"targetUrl\":\"https://haynes-florance.com/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.\"},{\"targetUrl\":\"https://haynes-florance.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.\"},{\"targetUrl\":\"https://haynes-florance.com/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:CONTACT\"},{\"targetUrl\":\"https://haynes-florance.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    },
    {
      "id": "google-customer-motion-sports-website-contact",
      "company": "Motion Sports",
      "action": "email_priority",
      "platform": "website_form",
      "targetUrl": "https://www.motion-sports.co.uk/contact",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_page_unavailable_404: 404 錯誤：找不到頁面;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:18:16.995Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.motion-sports.co.uk/help/contact-us",
        "tabId": "5CC85D6FCDABEAD5CE941D759C339478",
        "title": "404 錯誤：找不到頁面",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "website_page_unavailable_404: 404 錯誤：找不到頁面"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.motion-sports.co.uk/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.motion-sports.co.uk/help/contact-us",
          "tabId": "5CC85D6FCDABEAD5CE941D759C339478",
          "title": "404 錯誤：找不到頁面",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "website_page_unavailable_404: 404 錯誤：找不到頁面"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Motion Sports Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_page_unavailable_404: 404 錯誤：找不到頁面;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_page_unavailable_404: 404 錯誤：找不到頁面;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Motion Sports Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.motion-sports.co.uk/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:CONTACT\"},{\"targetUrl\":\"https://www.motion-sports.co.uk/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:CONTACT\"},{\"targetUrl\":\"https://www.motion-sports.co.uk/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404 錯誤：找不到頁面\"},{\"targetUrl\":\"https://www.motion-sports.co.uk/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404 錯誤：找不到頁面\"},{\"targetUrl\":\"https://www.motion-sports.co.uk/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404 錯誤：找不到頁面\"},{\"targetUrl\":\"https://www.motion-sports.co.uk/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404 錯誤：找不到頁面\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    }
  ],
  "results": [
    {
      "id": "google-customer-palisade-trading-website-contact",
      "company": "Palisade Trading",
      "action": "develop",
      "platform": "website_form",
      "targetUrl": "https://www.palisadetrading.com/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "customer_execution_timeout:90000;queue_continued_to_next_customer",
      "timestamp": "2026-08-22T19:09:25.032Z",
      "chromeOpen": null,
      "result": {
        "ok": false,
        "timedOut": true,
        "sendStatus": "failed_open",
        "reason": "customer_execution_timeout",
        "evidence": "customer_execution_timeout:90000;queue_continued_to_next_customer",
        "chromeOpen": null,
        "output": "{\"verdict\":\"failed_open\",\"sendStatus\":\"failed_open\",\"evidence\":\"customer_execution_timeout:90000;queue_continued_to_next_customer\",\"nextAction\":\"The customer exceeded its bounded execution window. Its automation tabs were closed and the queue continued without retrying or claiming a send.\",\"company\":\"Palisade Trading\"}"
      }
    },
    {
      "id": "google-customer-wwsra-website-contact",
      "company": "WWSRA",
      "action": "email_priority",
      "platform": "website_form",
      "targetUrl": "https://wwsra.com/brands-seeking-reps-submission/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "unavailable_profile_page: Page not found - WWSRA;website_contact_all_targets_failed:7;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:10:20.004Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://wwsra.com/help/contact-us",
        "tabId": "4EC6B38B25844294E7D3A4FDBB7AC3CD",
        "title": "Page not found - WWSRA",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "unavailable_profile_page: Page not found - WWSRA"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://wwsra.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://wwsra.com/help/contact-us",
          "tabId": "4EC6B38B25844294E7D3A4FDBB7AC3CD",
          "title": "Page not found - WWSRA",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "unavailable_profile_page: Page not found - WWSRA"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear WWSRA Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "unavailable_profile_page: Page not found - WWSRA;website_contact_all_targets_failed:7;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"unavailable_profile_page: Page not found - WWSRA;website_contact_all_targets_failed:7;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear WWSRA Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://wwsra.com/brands-seeking-reps-submission/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://wwsra.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:CONTACT\"},{\"targetUrl\":\"https://wwsra.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Skip to content\\nSHOWS\\nJOIN\\nSPONSORSHIPS\\nFAQ\\nREPS/LINES\\nCONTACT\\nLOG IN\\n404\\n\\nOH NO! THIS PAGE MUST BE AT A SHOW (NOT HERE)!\\n\\nPLEASE CONTACT US IF YOU NEED HELP NAVIGATING OUR SITE,\\nO\"},{\"targetUrl\":\"https://wwsra.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:SHOWS\"},{\"targetUrl\":\"https://wwsra.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Page not found - WWSRA\"},{\"targetUrl\":\"https://wwsra.com/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:SHOWS\"},{\"targetUrl\":\"https://wwsra.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Page not found - WWSRA\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    },
    {
      "id": "google-customer-four-corners-uk-website-contact",
      "company": "Four Corners UK",
      "action": "email_priority",
      "platform": "website_form",
      "targetUrl": "https://www.fourcornersuk.com/contact",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_page_unavailable_404: 404\n\n错误 - 找不到网页\n\n请检查 URL。\n\n否则， 请点击这里被重定向到主页。;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:10:39.913Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.fourcornersuk.com/help/contact-us",
        "tabId": "3BA8DC74006AD7FEA082F0D9EC2C07BB",
        "title": "404 - 找不到页面",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "website_page_unavailable_404: 404\n\n错误 - 找不到网页\n\n请检查 URL。\n\n否则， 请点击这里被重定向到主页。"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.fourcornersuk.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.fourcornersuk.com/help/contact-us",
          "tabId": "3BA8DC74006AD7FEA082F0D9EC2C07BB",
          "title": "404 - 找不到页面",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "website_page_unavailable_404: 404\n\n错误 - 找不到网页\n\n请检查 URL。\n\n否则， 请点击这里被重定向到主页。"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Four Corners UK Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_page_unavailable_404: 404\n\n错误 - 找不到网页\n\n请检查 URL。\n\n否则， 请点击这里被重定向到主页。;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_page_unavailable_404: 404\\n\\n错误 - 找不到网页\\n\\n请检查 URL。\\n\\n否则， 请点击这里被重定向到主页。;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Four Corners UK Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.fourcornersuk.com/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.fourcornersuk.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.fourcornersuk.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404\\n\\n错误 - 找不到网页\\n\\n请检查 URL。\\n\\n否则， 请点击这里被重定向到主页。\"},{\"targetUrl\":\"https://www.fourcornersuk.com/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404\\n\\n错误 - 找不到网页\\n\\n请检查 URL。\\n\\n否则， 请点击这里被重定向到主页。\"},{\"targetUrl\":\"https://www.fourcornersuk.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404\\n\\n错误 - 找不到网页\\n\\n请检查 URL。\\n\\n否则， 请点击这里被重定向到主页。\"},{\"targetUrl\":\"https://www.fourcornersuk.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404\\n\\n错误 - 找不到网页\\n\\n请检查 URL。\\n\\n否则， 请点击这里被重定向到主页。\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    },
    {
      "id": "google-customer-ludwikoski-associates-website-contact",
      "company": "Ludwikoski & Associates",
      "action": "email_priority",
      "platform": "website_form",
      "targetUrl": "https://www.ludreps.com/about-us/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:7;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:11:14.216Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.ludreps.com/help/contact-us",
        "tabId": "8C8D5F6F2A38CA0FA265C00044321A47",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/8C8D5F6F2A38CA0FA265C00044321A47",
        "title": "WordPress › Error"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.ludreps.com/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.ludreps.com/help/contact-us",
          "tabId": "8C8D5F6F2A38CA0FA265C00044321A47",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/8C8D5F6F2A38CA0FA265C00044321A47",
          "title": "WordPress › Error"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Ludwikoski & Associates Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:7;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:7;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Ludwikoski & Associates Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.ludreps.com/about-us/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.ludreps.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.ludreps.com/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.ludreps.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.ludreps.com/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.ludreps.com/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.ludreps.com/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
      }
    },
    {
      "id": "google-customer-nomadic-supply-company-website-contact",
      "company": "Nomadic Supply Company",
      "action": "develop",
      "platform": "website_form",
      "targetUrl": "https://nomadicsupply.com/sell-your-products-with-nomadic-supply-company/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "website_page_unavailable_403: 403 Forbidden\nnginx;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:12:24.111Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/nomadic.supply/",
        "tabId": "B8CA130A226D045B80DFE25B5D1D9C1A",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/B8CA130A226D045B80DFE25B5D1D9C1A",
        "title": "Nomadic Supply Company® (@nomadic.supply) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "browserEngine": "codex-chrome-cdp",
        "mode": "codex_chrome_cdp",
        "targetUrl": "https://www.instagram.com/nomadic.supply/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/nomadic.supply/",
          "tabId": "B8CA130A226D045B80DFE25B5D1D9C1A",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/B8CA130A226D045B80DFE25B5D1D9C1A",
          "title": "Nomadic Supply Company® (@nomadic.supply) · Instagram 照片和视频"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"website_page_unavailable_403: 403 Forbidden\\nnginx;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2\",\"nextAction\":\"Composer not detected; pause automation and notify operator only if retry would be unsafe.\",\"draft\":\"Hi Nomadic Supply Company team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 95,
          "reason": "local_codex_extension_template",
          "draft": "Hi Nomadic Supply Company team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Chrome CDP fallback",
        "glmModel": "not_used",
        "followup": false,
        "evidence": "website_page_unavailable_403: 403 Forbidden\nnginx;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2",
        "socialFallbackEvidence": "instagram_message_button_clicked_composer_not_found"
      }
    },
    {
      "id": "google-customer-alpinewaves-website-contact",
      "company": "AlpineWaves",
      "action": "develop",
      "platform": "website_form",
      "targetUrl": "https://www.alpinewaves.co.uk/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:13:38.433Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/alpinewavesco",
        "tabId": "3C92EA26A8877DC3CF6636F92EDBC22C",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/3C92EA26A8877DC3CF6636F92EDBC22C",
        "title": "ALPINE ~ WAVES (@alpinewavesco) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "browserEngine": "codex-chrome-cdp",
        "mode": "codex_chrome_cdp",
        "targetUrl": "https://www.instagram.com/alpinewavesco",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/alpinewavesco",
          "tabId": "3C92EA26A8877DC3CF6636F92EDBC22C",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/3C92EA26A8877DC3CF6636F92EDBC22C",
          "title": "ALPINE ~ WAVES (@alpinewavesco) · Instagram 照片和视频"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2\",\"nextAction\":\"Composer not detected; pause automation and notify operator only if retry would be unsafe.\",\"draft\":\"Hi AlpineWaves team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a distributor/importer, the strongest fit is regional sell-through, channel fit, margin-ready product line, and whether they cover outdoor/travel electronics buyers; your UK and Ireland outdoor brand sales agency focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the owner of distribution evaluation or the best time for a short intro video meeting?\",\"sendStatus\":\"failed_open\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 94,
          "reason": "local_codex_extension_template",
          "draft": "Hi AlpineWaves team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a distributor/importer, the strongest fit is regional sell-through, channel fit, margin-ready product line, and whether they cover outdoor/travel electronics buyers; your UK and Ireland outdoor brand sales agency focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the owner of distribution evaluation or the best time for a short intro video meeting?"
        },
        "executionLayer": "Chrome CDP fallback",
        "glmModel": "not_used",
        "followup": false,
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2",
        "socialFallbackEvidence": "instagram_message_button_clicked_composer_not_found"
      }
    },
    {
      "id": "google-customer-sanitas-sales-group-website-contact",
      "company": "Sanitas Sales Group",
      "action": "email_priority",
      "platform": "website_form",
      "targetUrl": "https://sanitassalesgroup.com/contact/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "unavailable_profile_page: Skip to primary navigation\nSkip to main content\nSkip to footer\n\nSANITAS SALES GROUP\n\nSales and marketing contractors serving the greater Rocky Mountain region\n\nBRANDS\n \nOUR TERRITO;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:14:22.152Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://sanitassalesgroup.com/help/contact-us",
        "tabId": "CE5FBB19DFBA6288FDA837DDE109C8D0",
        "title": "Page not found – Sanitas Sales Group",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "unavailable_profile_page: Skip to primary navigation\nSkip to main content\nSkip to footer\n\nSANITAS SALES GROUP\n\nSales and marketing contractors serving the greater Rocky Mountain region\n\nBRANDS\n \nOUR TERRITO"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://sanitassalesgroup.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://sanitassalesgroup.com/help/contact-us",
          "tabId": "CE5FBB19DFBA6288FDA837DDE109C8D0",
          "title": "Page not found – Sanitas Sales Group",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "unavailable_profile_page: Skip to primary navigation\nSkip to main content\nSkip to footer\n\nSANITAS SALES GROUP\n\nSales and marketing contractors serving the greater Rocky Mountain region\n\nBRANDS\n \nOUR TERRITO"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Sanitas Sales Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "unavailable_profile_page: Skip to primary navigation\nSkip to main content\nSkip to footer\n\nSANITAS SALES GROUP\n\nSales and marketing contractors serving the greater Rocky Mountain region\n\nBRANDS\n \nOUR TERRITO;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"unavailable_profile_page: Skip to primary navigation\\nSkip to main content\\nSkip to footer\\n\\nSANITAS SALES GROUP\\n\\nSales and marketing contractors serving the greater Rocky Mountain region\\n\\nBRANDS\\n \\nOUR TERRITO;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Sanitas Sales Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://sanitassalesgroup.com/contact/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://sanitassalesgroup.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Skip to primary navigation\"},{\"targetUrl\":\"https://sanitassalesgroup.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Skip to primary navigation\\nSkip to main content\\nSkip to footer\\n\\nSANITAS SALES GROUP\\n\\nSales and marketing contractors serving the greater Rocky Mountain region\\n\\nBRANDS\\n \\nOUR TERRITO\"},{\"targetUrl\":\"https://sanitassalesgroup.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Skip to primary navigation\"},{\"targetUrl\":\"https://sanitassalesgroup.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Skip to primary navigation\\nSkip to main content\\nSkip to footer\\n\\nSANITAS SALES GROUP\\n\\nSales and marketing contractors serving the greater Rocky Mountain region\\n\\nBRANDS\\n \\nOUR TERRITO\"},{\"targetUrl\":\"https://sanitassalesgroup.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Skip to primary navigation\\nSkip to main content\\nSkip to footer\\n\\nSANITAS SALES GROUP\\n\\nSales and marketing contractors serving the greater Rocky Mountain region\\n\\nBRANDS\\n \\nOUR TERRITO\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    },
    {
      "id": "google-customer-excell-marketing-website-contact",
      "company": "Excell Marketing",
      "action": "email_priority",
      "platform": "website_form",
      "targetUrl": "https://www.excellmarketing.com/Contact/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "unavailable_profile_page: Home\nWho We Are\nWhat We Do\nProduct Lines\nContact\n920-662-1884\n404\nPage Not Found\nWe couldn't find the page you were looking for\nContact\n1 920 662 1884\nAddress\n2121 Woodale Avenue\nG;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:15:09.176Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.excellmarketing.com/help/contact-us",
        "tabId": "5DFDD03FB69A35CA85CB38AA8AAFBFAD",
        "title": "",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "unavailable_profile_page: Home\nWho We Are\nWhat We Do\nProduct Lines\nContact\n920-662-1884\n404\nPage Not Found\nWe couldn't find the page you were looking for\nContact\n1 920 662 1884\nAddress\n2121 Woodale Avenue\nG"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.excellmarketing.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.excellmarketing.com/help/contact-us",
          "tabId": "5DFDD03FB69A35CA85CB38AA8AAFBFAD",
          "title": "",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "unavailable_profile_page: Home\nWho We Are\nWhat We Do\nProduct Lines\nContact\n920-662-1884\n404\nPage Not Found\nWe couldn't find the page you were looking for\nContact\n1 920 662 1884\nAddress\n2121 Woodale Avenue\nG"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Excell Marketing Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "unavailable_profile_page: Home\nWho We Are\nWhat We Do\nProduct Lines\nContact\n920-662-1884\n404\nPage Not Found\nWe couldn't find the page you were looking for\nContact\n1 920 662 1884\nAddress\n2121 Woodale Avenue\nG;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"unavailable_profile_page: Home\\nWho We Are\\nWhat We Do\\nProduct Lines\\nContact\\n920-662-1884\\n404\\nPage Not Found\\nWe couldn't find the page you were looking for\\nContact\\n1 920 662 1884\\nAddress\\n2121 Woodale Avenue\\nG;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Excell Marketing Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.excellmarketing.com/Contact/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Contact\"},{\"targetUrl\":\"https://www.excellmarketing.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Contact\"},{\"targetUrl\":\"https://www.excellmarketing.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Home\\nWho We Are\\nWhat We Do\\nProduct Lines\\nContact\\n920-662-1884\\n404\\nPage Not Found\\nWe couldn't find the page you were looking for\\nContact\\n1 920 662 1884\\nAddress\\n2121 Woodale Avenue\\nG\"},{\"targetUrl\":\"https://www.excellmarketing.com/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Home\\nWho We Are\\nWhat We Do\\nProduct Lines\\nContact\\n920-662-1884\\n404\\nPage Not Found\\nWe couldn't find the page you were looking for\\nContact\\n1 920 662 1884\\nAddress\\n2121 Woodale Avenue\\nG\"},{\"targetUrl\":\"https://www.excellmarketing.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Home\\nWho We Are\\nWhat We Do\\nProduct Lines\\nContact\\n920-662-1884\\n404\\nPage Not Found\\nWe couldn't find the page you were looking for\\nContact\\n1 920 662 1884\\nAddress\\n2121 Woodale Avenue\\nG\"},{\"targetUrl\":\"https://www.excellmarketing.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Home\\nWho We Are\\nWhat We Do\\nProduct Lines\\nContact\\n920-662-1884\\n404\\nPage Not Found\\nWe couldn't find the page you were looking for\\nContact\\n1 920 662 1884\\nAddress\\n2121 Woodale Avenue\\nG\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    },
    {
      "id": "google-customer-ascension-sales-group-website-contact",
      "company": "Ascension Sales Group",
      "action": "develop",
      "platform": "website_form",
      "targetUrl": "https://www.ascensionsalesgroup.com/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_page_unavailable_404: 404 Not Found | Ascension Sales Group;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:15:28.457Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.ascensionsalesgroup.com/help/contact-us",
        "tabId": "824A3F16BE52328AC8594286A4605F13",
        "title": "404 Not Found | Ascension Sales Group",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "website_page_unavailable_404: 404 Not Found | Ascension Sales Group"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.ascensionsalesgroup.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.ascensionsalesgroup.com/help/contact-us",
          "tabId": "824A3F16BE52328AC8594286A4605F13",
          "title": "404 Not Found | Ascension Sales Group",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "website_page_unavailable_404: 404 Not Found | Ascension Sales Group"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Ascension Sales Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_page_unavailable_404: 404 Not Found | Ascension Sales Group;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_page_unavailable_404: 404 Not Found | Ascension Sales Group;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Ascension Sales Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.ascensionsalesgroup.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.ascensionsalesgroup.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404 Not Found | Ascension Sales Group\"},{\"targetUrl\":\"https://www.ascensionsalesgroup.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.ascensionsalesgroup.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404 Not Found | Ascension Sales Group\"},{\"targetUrl\":\"https://www.ascensionsalesgroup.com/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404 Not Found | Ascension Sales Group\"},{\"targetUrl\":\"https://www.ascensionsalesgroup.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404 Not Found | Ascension Sales Group\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    },
    {
      "id": "google-customer-suggs-nicholas-shea-website-contact",
      "company": "Suggs-Nicholas-Shea",
      "action": "email_priority",
      "platform": "website_form",
      "targetUrl": "https://suggsnicholasshea.com/contact/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "unavailable_profile_page: Skip to content\nSuggs-Nicholas-Shea, Inc.\nEastern US Outdoor Manufacturer Representatives\nHome\nAbout\nTeam\nVendors\nContact\nPage not found\nYou are here:\nHomeError 404\nOops! That page;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:16:26.214Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://suggsnicholasshea.com/help/contact-us",
        "tabId": "9E4568B98C3FC1265EECD1E5A7B03912",
        "title": "Page not found – Suggs-Nicholas-Shea, Inc.",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "unavailable_profile_page: Skip to content\nSuggs-Nicholas-Shea, Inc.\nEastern US Outdoor Manufacturer Representatives\nHome\nAbout\nTeam\nVendors\nContact\nPage not found\nYou are here:\nHomeError 404\nOops! That page"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://suggsnicholasshea.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://suggsnicholasshea.com/help/contact-us",
          "tabId": "9E4568B98C3FC1265EECD1E5A7B03912",
          "title": "Page not found – Suggs-Nicholas-Shea, Inc.",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "unavailable_profile_page: Skip to content\nSuggs-Nicholas-Shea, Inc.\nEastern US Outdoor Manufacturer Representatives\nHome\nAbout\nTeam\nVendors\nContact\nPage not found\nYou are here:\nHomeError 404\nOops! That page"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Suggs-Nicholas-Shea Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "unavailable_profile_page: Skip to content\nSuggs-Nicholas-Shea, Inc.\nEastern US Outdoor Manufacturer Representatives\nHome\nAbout\nTeam\nVendors\nContact\nPage not found\nYou are here:\nHomeError 404\nOops! That page;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"unavailable_profile_page: Skip to content\\nSuggs-Nicholas-Shea, Inc.\\nEastern US Outdoor Manufacturer Representatives\\nHome\\nAbout\\nTeam\\nVendors\\nContact\\nPage not found\\nYou are here:\\nHomeError 404\\nOops! That page;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Suggs-Nicholas-Shea Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://suggsnicholasshea.com/contact/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Vendors\"},{\"targetUrl\":\"https://suggsnicholasshea.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Vendors\"},{\"targetUrl\":\"https://suggsnicholasshea.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Skip to content\\nSuggs-Nicholas-Shea, Inc.\\nEastern US Outdoor Manufacturer Representatives\\nHome\\nAbout\\nTeam\\nVendors\\nContact\\nPage not found\\nYou are here:\\nHomeError 404\\nOops! That page\"},{\"targetUrl\":\"https://suggsnicholasshea.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Vendors\"},{\"targetUrl\":\"https://suggsnicholasshea.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Skip to content\\nSuggs-Nicholas-Shea, Inc.\\nEastern US Outdoor Manufacturer Representatives\\nHome\\nAbout\\nTeam\\nVendors\\nContact\\nPage not found\\nYou are here:\\nHomeError 404\\nOops! That page\"},{\"targetUrl\":\"https://suggsnicholasshea.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Skip to content\\nSuggs-Nicholas-Shea, Inc.\\nEastern US Outdoor Manufacturer Representatives\\nHome\\nAbout\\nTeam\\nVendors\\nContact\\nPage not found\\nYou are here:\\nHomeError 404\\nOops! That page\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    },
    {
      "id": "google-customer-gargano-atkins-sales-marketing-website-contact",
      "company": "Gargano Atkins Sales & Marketing",
      "action": "develop",
      "platform": "website_form",
      "targetUrl": "https://garganoatkins.com/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_page_unavailable_404: File not found (404 error)\n\nIf you think what you're looking for should be here, please contact the site owner.;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:16:48.648Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://garganoatkins.com/help/contact-us",
        "tabId": "4214E0B9EC69C3B2A4DA22B8FC087E10",
        "title": "404 Not Found",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "website_page_unavailable_404: File not found (404 error)\n\nIf you think what you're looking for should be here, please contact the site owner."
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://garganoatkins.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://garganoatkins.com/help/contact-us",
          "tabId": "4214E0B9EC69C3B2A4DA22B8FC087E10",
          "title": "404 Not Found",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "website_page_unavailable_404: File not found (404 error)\n\nIf you think what you're looking for should be here, please contact the site owner."
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Gargano Atkins Sales & Marketing Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_page_unavailable_404: File not found (404 error)\n\nIf you think what you're looking for should be here, please contact the site owner.;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Gargano Atkins Sales & Marketing Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://garganoatkins.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://garganoatkins.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.\"},{\"targetUrl\":\"https://garganoatkins.com/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.\"},{\"targetUrl\":\"https://garganoatkins.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.\"},{\"targetUrl\":\"https://garganoatkins.com/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.\"},{\"targetUrl\":\"https://garganoatkins.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    },
    {
      "id": "google-customer-haynes-florance-associates-website-contact",
      "company": "Haynes Florance & Associates",
      "action": "develop",
      "platform": "website_form",
      "targetUrl": "https://haynes-florance.com/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_page_unavailable_404: File not found (404 error)\n\nIf you think what you're looking for should be here, please contact the site owner.;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:17:30.560Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://haynes-florance.com/help/contact-us",
        "tabId": "ED5F790E3656D990A779FFE3F294418B",
        "title": "404 Not Found",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "website_page_unavailable_404: File not found (404 error)\n\nIf you think what you're looking for should be here, please contact the site owner."
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://haynes-florance.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://haynes-florance.com/help/contact-us",
          "tabId": "ED5F790E3656D990A779FFE3F294418B",
          "title": "404 Not Found",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "website_page_unavailable_404: File not found (404 error)\n\nIf you think what you're looking for should be here, please contact the site owner."
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Haynes Florance & Associates Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_page_unavailable_404: File not found (404 error)\n\nIf you think what you're looking for should be here, please contact the site owner.;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Haynes Florance & Associates Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://haynes-florance.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:CONTACT\"},{\"targetUrl\":\"https://haynes-florance.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.\"},{\"targetUrl\":\"https://haynes-florance.com/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.\"},{\"targetUrl\":\"https://haynes-florance.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.\"},{\"targetUrl\":\"https://haynes-florance.com/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:CONTACT\"},{\"targetUrl\":\"https://haynes-florance.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: File not found (404 error)\\n\\nIf you think what you're looking for should be here, please contact the site owner.\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    },
    {
      "id": "google-customer-motion-sports-website-contact",
      "company": "Motion Sports",
      "action": "email_priority",
      "platform": "website_form",
      "targetUrl": "https://www.motion-sports.co.uk/contact",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_page_unavailable_404: 404 錯誤：找不到頁面;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-22T19:18:16.995Z",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.motion-sports.co.uk/help/contact-us",
        "tabId": "5CC85D6FCDABEAD5CE941D759C339478",
        "title": "404 錯誤：找不到頁面",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "website_page_unavailable_404: 404 錯誤：找不到頁面"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.motion-sports.co.uk/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.motion-sports.co.uk/help/contact-us",
          "tabId": "5CC85D6FCDABEAD5CE941D759C339478",
          "title": "404 錯誤：找不到頁面",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "website_page_unavailable_404: 404 錯誤：找不到頁面"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Motion Sports Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_page_unavailable_404: 404 錯誤：找不到頁面;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_page_unavailable_404: 404 錯誤：找不到頁面;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Motion Sports Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.motion-sports.co.uk/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:CONTACT\"},{\"targetUrl\":\"https://www.motion-sports.co.uk/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:CONTACT\"},{\"targetUrl\":\"https://www.motion-sports.co.uk/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404 錯誤：找不到頁面\"},{\"targetUrl\":\"https://www.motion-sports.co.uk/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404 錯誤：找不到頁面\"},{\"targetUrl\":\"https://www.motion-sports.co.uk/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404 錯誤：找不到頁面\"},{\"targetUrl\":\"https://www.motion-sports.co.uk/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: 404 錯誤：找不到頁面\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
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
      "id": "google-customer-trailcross-website-contact",
      "company": "TrailCross",
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
      "id": "google-customer-alexander-townsend-website-contact",
      "company": "Alexander & Townsend",
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
      "id": "google-customer-nw-road-reps-website-contact",
      "company": "NW Road Reps",
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
      "id": "google-customer-outdoor-brands-uk-website-contact",
      "company": "Outdoor Brands UK",
      "action": "develop",
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
      "id": "google-customer-wire-to-wire-partners-website-contact",
      "company": "Wire to Wire Partners",
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
      "id": "google-customer-ken-jefferies-associates-website-contact",
      "company": "Ken Jefferies & Associates",
      "action": "email_priority",
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
      "id": "google-customer-taunton-leisure-website-contact",
      "company": "Taunton Leisure",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-next-adventure-website-contact",
      "company": "Next Adventure",
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
      "id": "google-customer-novo-brands-website-contact",
      "company": "Novo Brands",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-bvc-holdings-website-contact",
      "company": "BVC Holdings",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-alpine-waves-linkedin",
      "company": "Alpine Waves",
      "action": "develop",
      "platform": "linkedin",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-elevated-outdoor-sales-linkedin",
      "company": "Elevated Outdoor Sales",
      "action": "develop",
      "platform": "linkedin",
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
      "id": "google-customer-powers-pedersen-sales-group-facebook",
      "company": "Powers Pedersen Sales Group",
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
      "id": "google-customer-awesome-outdoors-group-facebook",
      "company": "Awesome Outdoors Group",
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
      "id": "google-customer-perspective-outdoor-instagram",
      "company": "Perspective Outdoor",
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
      "id": "google-customer-shiner-distribution-website-contact",
      "company": "Shiner Distribution",
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
      "id": "google-customer-perpetual-motion-nw-website-contact",
      "company": "Perpetual Motion NW",
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
      "id": "google-customer-northern-exposure-sporting-group-website-contact",
      "company": "Northern Exposure Sporting Group",
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
      "id": "google-customer-alpine-waves-linkedin",
      "company": "Alpine Waves",
      "action": "develop",
      "platform": "linkedin",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-elevated-outdoor-sales-linkedin",
      "company": "Elevated Outdoor Sales",
      "action": "develop",
      "platform": "linkedin",
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
      "id": "google-customer-powers-pedersen-sales-group-facebook",
      "company": "Powers Pedersen Sales Group",
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
      "id": "google-customer-awesome-outdoors-group-facebook",
      "company": "Awesome Outdoors Group",
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
      "id": "google-customer-perspective-outdoor-instagram",
      "company": "Perspective Outdoor",
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
      "id": "google-customer-trailcross-website-contact",
      "company": "TrailCross",
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
      "id": "google-customer-alexander-townsend-website-contact",
      "company": "Alexander & Townsend",
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
      "id": "google-customer-nw-road-reps-website-contact",
      "company": "NW Road Reps",
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
      "id": "google-customer-shiner-distribution-website-contact",
      "company": "Shiner Distribution",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-outdoor-brands-uk-website-contact",
      "company": "Outdoor Brands UK",
      "action": "develop",
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
      "id": "google-customer-wire-to-wire-partners-website-contact",
      "company": "Wire to Wire Partners",
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
      "id": "google-customer-ken-jefferies-associates-website-contact",
      "company": "Ken Jefferies & Associates",
      "action": "email_priority",
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
      "id": "google-customer-taunton-leisure-website-contact",
      "company": "Taunton Leisure",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-next-adventure-website-contact",
      "company": "Next Adventure",
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
    },
    {
      "id": "google-customer-novo-brands-website-contact",
      "company": "Novo Brands",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-bvc-holdings-website-contact",
      "company": "BVC Holdings",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-ld-mountain-centre-facebook",
      "company": "LD Mountain Centre",
      "action": "develop",
      "platform": "facebook",
      "reason": "social_profile_not_first_party_verified"
    },
    {
      "id": "google-customer-rock-creek-facebook",
      "company": "Rock/Creek",
      "action": "develop",
      "platform": "facebook",
      "reason": "social_profile_not_first_party_verified"
    }
  ],
  "summary": {
    "totalLeads": 16,
    "highIcp": 16,
    "readyToDevelop": 35,
    "dueNow": 100,
    "visibleTodayQueue": 74,
    "potentialPool": 75,
    "potentialPoolTarget": 100,
    "customerTableHighIcp": 0,
    "refillNeeded": 25,
    "executableCompanies": 57,
    "executableReserveTarget": 130,
    "executableReserveNeeded": 73,
    "executableByChannel": {
      "linkedin": 2,
      "facebook": 5,
      "instagram": 2,
      "email": 13,
      "website_form": 35
    },
    "verifiedSocialCompanies": 9,
    "verifiedSocialReserveTarget": 20,
    "verifiedSocialReserveNeeded": 11,
    "enrichmentBacklogCount": 18,
    "googleDiscovered": 100,
    "facebookDiscovered": 5,
    "websiteContactDiscovered": 28,
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
      "count": 47
    },
    {
      "reason": "official_public_business_email_verified",
      "status": "skipped",
      "count": 41
    },
    {
      "reason": "homepage_only_contact_path_requires_verification",
      "status": "skipped",
      "count": 25
    },
    {
      "reason": "official_website_social_channel_verified",
      "status": "skipped",
      "count": 18
    },
    {
      "reason": "website_contact_capability_not_verified",
      "status": "skipped",
      "count": 10
    },
    {
      "reason": "personal_email_domain_not_allowed",
      "status": "skipped",
      "count": 6
    },
    {
      "reason": "failed_open",
      "status": "failed_open",
      "count": 2
    },
    {
      "reason": "social_profile_not_first_party_verified",
      "status": "skipped",
      "count": 2
    },
    {
      "reason": "customer_execution_timeout",
      "status": "failed_open",
      "count": 1
    }
  ],
  "blockerCounts": {
    "official_website_contact_channel": 47,
    "official_public_business_email_verified": 41,
    "homepage_only_contact_path_requires_verification": 25,
    "official_website_social_channel_verified": 18,
    "website_contact_capability_not_verified": 10,
    "personal_email_domain_not_allowed": 6,
    "failed_open": 2,
    "social_profile_not_first_party_verified": 2,
    "customer_execution_timeout": 1
  },
  "queueGoalStatus": {
    "target": 100,
    "potentialPool": 75,
    "queueCount": 100,
    "googleDiscovered": 100,
    "refillNeeded": 25,
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
  "userVisibleStatus": "Customer development was not performed. Blockers: official_website_contact_channel (47); official_public_business_email_verified (41); homepage_only_contact_path_requires_verification (25).",
  "recoveryHint": "Refill the high-ICP pool with 25 verified leads or unblock existing website/social leads before the next run. Verify the official profile opens and exposes a safe message composer, or switch to another verified channel.",
  "recoveryActions": [
    {
      "reason": "daily_queue_goal_not_reached",
      "action": "Refill high-ICP customer pool",
      "description": "Add or unblock 25 verified high-ICP leads to reach the daily 100 target.",
      "hint": "Refill the high-ICP pool with 25 verified leads or unblock existing website/social leads before the next run.",
      "target": 100,
      "potentialPool": 75,
      "refillNeeded": 25
    },
    {
      "reason": "failed_open",
      "action": "Verify profile accessibility",
      "description": "Open the official profile manually or switch to another verified channel before retrying.",
      "hint": "Verify the official profile opens and exposes a safe message composer, or switch to another verified channel."
    }
  ],
  "systemRefresh": {
    "ok": true,
    "stdout": "{\n  \"date\": \"2026-08-23\",\n  \"summary\": {\n    \"totalLeads\": 16,\n    \"highIcp\": 16,\n    \"readyToDevelop\": 31,\n    \"dueNow\": 100,\n    \"visibleTodayQueue\": 70,\n    \"potentialPool\": 71,\n    \"potentialPoolTarget\": 100,\n    \"customerTableHighIcp\": 0,\n    \"refillNeeded\": 29,\n    \"executableCompanies\": 53,\n    \"executableReserveTarget\": 130,\n    \"executableReserveNeeded\": 77,\n    \"executableByChannel\": {\n      \"linkedin\": 1,\n      \"facebook\": 5,\n      \"instagram\": 2,\n      \"email\": 13,\n      \"website_form\": 32\n    },\n    \"verifiedSocialCompanies\": 8,\n    \"verifiedSocialReserveTarget\": 20,\n    \"verifiedSocialReserveNeeded\": 12,\n    \"enrichmentBacklogCount\": 18,\n    \"googleDiscovered\": 100,\n    \"facebookDiscovered\": 5,\n    \"websiteContactDiscovered\": 28,\n    \"scheduledLater\": 0,\n    \"cooldown\": 30,\n    \"emailPriority\": 0,\n    \"openAgencyMarket\": 15,\n    \"exclusiveAgencySkipped\": 1,\n    \"needsVerification\": 0,\n    \"retainedLowIcp\": 0\n  },\n  \"bugErrors\": 13,\n  \"queueFile\": \"E:\\\\New project\\\\outreach-dashboard\\\\daily-runs\\\\2026-08-23-daily-automation.json\",\n  \"csvFile\": \"E:\\\\New project\\\\outreach-dashboard\\\\daily-runs\\\\2026-08-23-daily-queue.csv\"\n}",
    "stderr": "",
    "error": "",
    "visibility": {
      "updatedAt": "2026-08-22T19:18:21.202Z",
      "source": "main-refreshDailyAutomationArtifacts",
      "runDate": "2026-08-23",
      "artifactGeneratedAt": "2026-08-22T19:18:18.295Z",
      "executionGeneratedAt": "2026-08-22T16:19:56.766Z",
      "githubSyncUpdatedAt": "2026-08-22T16:20:25.590Z",
      "counts": {
        "dailyQueue": 100,
        "googleDiscovered": 100,
        "websiteContact": 92,
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
        "potentialPool": 71,
        "refillNeeded": 29,
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
    "ok": true,
    "reason": "bounce_scan_complete",
    "scanned": 25,
    "updated": 0,
    "senderIdentityFailures": 5,
    "historicalSenderIdentityFailures": 9,
    "senderRestoredAt": "2026-08-14T05:43:37.464Z"
  },
  "ledgerReconciliationCount": 13,
  "externalEvidenceReconciliationCount": 0,
  "completedAt": "2026-08-22T19:18:22.332Z"
};
