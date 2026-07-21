window.DAILY_AUTOMATION_EXECUTION_LATEST = {
  "ok": false,
  "executionPhase": "browser_execution",
  "chromeStage": "opened",
  "chromeOpened": true,
  "chromeOpenedCount": 1,
  "customerDevelopmentPerformed": false,
  "customerMessageSent": false,
  "realDevelopmentCount": 0,
  "reportingVerdict": "no_customer_development_performed",
  "engine": "Codex Chrome Extension queue bridge",
  "mode": "serial-single-target",
  "batchMode": "parallel-batches",
  "parallelLimit": 1,
  "limit": 13,
  "queueDate": "2026-07-21",
  "queueSource": "dailyQueue",
  "executed": [
    {
      "id": "google-customer-bergfreunde-instagram",
      "company": "Bergfreunde",
      "action": "develop",
      "platform": "instagram",
      "targetUrl": "https://www.instagram.com/bergfreunde/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "instagram_message_button_clicked_composer_not_found",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/bergfreunde/",
        "tabId": "72551E0CBABF2D1993327884A45A4E33",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/72551E0CBABF2D1993327884A45A4E33",
        "title": "Bergfreunde (@bergfreunde) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_extension_only",
        "targetUrl": "https://www.instagram.com/bergfreunde/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/bergfreunde/",
          "tabId": "72551E0CBABF2D1993327884A45A4E33",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/72551E0CBABF2D1993327884A45A4E33",
          "title": "Bergfreunde (@bergfreunde) · Instagram 照片和视频"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"instagram_message_button_clicked_composer_not_found\",\"nextAction\":\"Composer not detected; pause automation and notify operator only if retry would be unsafe.\",\"draft\":\"Hi Bergfreunde team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 91,
          "reason": "local_codex_extension_template",
          "draft": "Hi Bergfreunde team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Codex Chrome Extension only",
        "glmModel": "not_used",
        "followup": false
      }
    },
    {
      "id": "google-customer-jax-outdoor-gear-instagram",
      "company": "Jax Outdoor Gear",
      "action": "develop",
      "platform": "instagram",
      "targetUrl": "https://www.instagram.com/jaxoutdoor/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "unavailable_profile_page: SKIP TO CONTENT\n\nJAX Store Locations\n\nSearch\nSearch\nLog in\nBag\n404\n\nPAGE NOT FOUND\n\nSorry, the page you are looking for does not exist.\n\nBACK TO HOME\nExplore JAX\nGift Cards\nLocatio;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.jaxgoods.com/help/contact-us",
        "tabId": "47CAF97AFE031AE2A96B68667FDB5017",
        "title": "404 Not Found – JAXOutdoorGearFarmandRanch",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "unavailable_profile_page: SKIP TO CONTENT\n\nJAX Store Locations\n\nSearch\nSearch\nLog in\nBag\n404\n\nPAGE NOT FOUND\n\nSorry, the page you are looking for does not exist.\n\nBACK TO HOME\nExplore JAX\nGift Cards\nLocatio"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.jaxgoods.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.jaxgoods.com/help/contact-us",
          "tabId": "47CAF97AFE031AE2A96B68667FDB5017",
          "title": "404 Not Found – JAXOutdoorGearFarmandRanch",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "unavailable_profile_page: SKIP TO CONTENT\n\nJAX Store Locations\n\nSearch\nSearch\nLog in\nBag\n404\n\nPAGE NOT FOUND\n\nSorry, the page you are looking for does not exist.\n\nBACK TO HOME\nExplore JAX\nGift Cards\nLocatio"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Jax Outdoor Gear Team,\n\nI’m Leo from FLEXTAIL. Your focus on verified outdoor, camping and travel retail social refill channel looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "unavailable_profile_page: SKIP TO CONTENT\n\nJAX Store Locations\n\nSearch\nSearch\nLog in\nBag\n404\n\nPAGE NOT FOUND\n\nSorry, the page you are looking for does not exist.\n\nBACK TO HOME\nExplore JAX\nGift Cards\nLocatio;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"unavailable_profile_page: SKIP TO CONTENT\\n\\nJAX Store Locations\\n\\nSearch\\nSearch\\nLog in\\nBag\\n404\\n\\nPAGE NOT FOUND\\n\\nSorry, the page you are looking for does not exist.\\n\\nBACK TO HOME\\nExplore JAX\\nGift Cards\\nLocatio;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Jax Outdoor Gear Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on verified outdoor, camping and travel retail social refill channel looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.jaxgoods.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:SKIP TO CONTENT\"},{\"targetUrl\":\"https://www.jaxgoods.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: SKIP TO CONTENT\\n\\nJAX Store Locations\\n\\nSearch\\nSearch\\nLog in\\nBag\\n404\\n\\nPAGE NOT FOUND\\n\\nSorry, the page you are looking for does not exist.\\n\\nBACK TO HOME\\nExplore JAX\\nGift Cards\\nLocatio\"},{\"targetUrl\":\"https://www.jaxgoods.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:SKIP TO CONTENT\"},{\"targetUrl\":\"https://www.jaxgoods.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Something went wrong.\\n\\nWhat happened?\\n404 Not Found\\nWhat can I do?\\nReturn to the previous page.\"},{\"targetUrl\":\"https://www.jaxgoods.com/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Something went wrong.\\n\\nWhat happened?\\n404 Not Found\\nWhat can I do?\\nReturn to the previous page.\"},{\"targetUrl\":\"https://www.jaxgoods.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: SKIP TO CONTENT\\n\\nJAX Store Locations\\n\\nSearch\\nSearch\\nLog in\\nBag\\n404\\n\\nPAGE NOT FOUND\\n\\nSorry, the page you are looking for does not exist.\\n\\nBACK TO HOME\\nExplore JAX\\nGift Cards\\nLocatio\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\",\"fallbackFrom\":\"https://www.instagram.com/jaxoutdoor/\",\"fallbackPlatform\":\"email\",\"fallbackReason\":\"instagram_message_button_clicked_composer_not_found\"}",
        "fallbackFrom": "https://www.instagram.com/jaxoutdoor/",
        "fallbackPlatform": "email",
        "decision": {
          "verdict": "develop",
          "fitScore": 84,
          "reason": "local_codex_extension_template",
          "draft": "Hi Jax Outdoor Gear team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Codex Chrome Extension only",
        "glmModel": "not_used",
        "followup": false
      }
    },
    {
      "id": "google-customer-sportler-instagram",
      "company": "Sportler",
      "action": "develop",
      "platform": "instagram",
      "targetUrl": "https://www.instagram.com/sportler_com/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\n\n您未获授权，无法查看此网页。\n\nHTTP ERROR 403\n重新加载;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.sportler.com/help/contact-us",
        "tabId": "A2CB0A824C670AB505C38BFCABDA1883",
        "title": "www.sportler.com",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\n\n您未获授权，无法查看此网页。\n\nHTTP ERROR 403\n重新加载"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.sportler.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.sportler.com/help/contact-us",
          "tabId": "A2CB0A824C670AB505C38BFCABDA1883",
          "title": "www.sportler.com",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\n\n您未获授权，无法查看此网页。\n\nHTTP ERROR 403\n重新加载"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Sportler Team,\n\nI’m Leo from FLEXTAIL. Your focus on verified outdoor, camping and travel retail social refill channel looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\n\n您未获授权，无法查看此网页。\n\nHTTP ERROR 403\n重新加载;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\\n\\n您未获授权，无法查看此网页。\\n\\nHTTP ERROR 403\\n重新加载;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Sportler Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on verified outdoor, camping and travel retail social refill channel looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.sportler.com/\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\\n\\n您未获授权，无法查看此网页。\\n\\nHTTP ERROR 403\\n重新加载\"},{\"targetUrl\":\"https://www.sportler.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\\n\\n您未获授权，无法查看此网页。\\n\\nHTTP ERROR 403\\n重新加载\"},{\"targetUrl\":\"https://www.sportler.com/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\\n\\n您未获授权，无法查看此网页。\\n\\nHTTP ERROR 403\\n重新加载\"},{\"targetUrl\":\"https://www.sportler.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\\n\\n您未获授权，无法查看此网页。\\n\\nHTTP ERROR 403\\n重新加载\"},{\"targetUrl\":\"https://www.sportler.com/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\\n\\n您未获授权，无法查看此网页。\\n\\nHTTP ERROR 403\\n重新加载\"},{\"targetUrl\":\"https://www.sportler.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\\n\\n您未获授权，无法查看此网页。\\n\\nHTTP ERROR 403\\n重新加载\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\",\"fallbackFrom\":\"https://www.instagram.com/sportler_com/\",\"fallbackPlatform\":\"email\",\"fallbackReason\":\"instagram_engagement_completed_message_unavailable;instagram_message_button_clicked_composer_not_found;follow_already_active;instagram_post_opened;post_liked;comment_submitted\"}",
        "fallbackFrom": "https://www.instagram.com/sportler_com/",
        "fallbackPlatform": "email",
        "decision": {
          "verdict": "develop",
          "fitScore": 84,
          "reason": "local_codex_extension_template",
          "draft": "Hi Sportler team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Codex Chrome Extension only",
        "glmModel": "not_used",
        "followup": false
      }
    }
  ],
  "results": [
    {
      "id": "google-customer-bergfreunde-instagram",
      "company": "Bergfreunde",
      "action": "develop",
      "platform": "instagram",
      "targetUrl": "https://www.instagram.com/bergfreunde/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "instagram_message_button_clicked_composer_not_found",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/bergfreunde/",
        "tabId": "72551E0CBABF2D1993327884A45A4E33",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/72551E0CBABF2D1993327884A45A4E33",
        "title": "Bergfreunde (@bergfreunde) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_extension_only",
        "targetUrl": "https://www.instagram.com/bergfreunde/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/bergfreunde/",
          "tabId": "72551E0CBABF2D1993327884A45A4E33",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/72551E0CBABF2D1993327884A45A4E33",
          "title": "Bergfreunde (@bergfreunde) · Instagram 照片和视频"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"instagram_message_button_clicked_composer_not_found\",\"nextAction\":\"Composer not detected; pause automation and notify operator only if retry would be unsafe.\",\"draft\":\"Hi Bergfreunde team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 91,
          "reason": "local_codex_extension_template",
          "draft": "Hi Bergfreunde team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Codex Chrome Extension only",
        "glmModel": "not_used",
        "followup": false
      }
    },
    {
      "id": "google-customer-jax-outdoor-gear-instagram",
      "company": "Jax Outdoor Gear",
      "action": "develop",
      "platform": "instagram",
      "targetUrl": "https://www.instagram.com/jaxoutdoor/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "unavailable_profile_page: SKIP TO CONTENT\n\nJAX Store Locations\n\nSearch\nSearch\nLog in\nBag\n404\n\nPAGE NOT FOUND\n\nSorry, the page you are looking for does not exist.\n\nBACK TO HOME\nExplore JAX\nGift Cards\nLocatio;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.jaxgoods.com/help/contact-us",
        "tabId": "47CAF97AFE031AE2A96B68667FDB5017",
        "title": "404 Not Found – JAXOutdoorGearFarmandRanch",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "unavailable_profile_page: SKIP TO CONTENT\n\nJAX Store Locations\n\nSearch\nSearch\nLog in\nBag\n404\n\nPAGE NOT FOUND\n\nSorry, the page you are looking for does not exist.\n\nBACK TO HOME\nExplore JAX\nGift Cards\nLocatio"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.jaxgoods.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.jaxgoods.com/help/contact-us",
          "tabId": "47CAF97AFE031AE2A96B68667FDB5017",
          "title": "404 Not Found – JAXOutdoorGearFarmandRanch",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "unavailable_profile_page: SKIP TO CONTENT\n\nJAX Store Locations\n\nSearch\nSearch\nLog in\nBag\n404\n\nPAGE NOT FOUND\n\nSorry, the page you are looking for does not exist.\n\nBACK TO HOME\nExplore JAX\nGift Cards\nLocatio"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Jax Outdoor Gear Team,\n\nI’m Leo from FLEXTAIL. Your focus on verified outdoor, camping and travel retail social refill channel looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "unavailable_profile_page: SKIP TO CONTENT\n\nJAX Store Locations\n\nSearch\nSearch\nLog in\nBag\n404\n\nPAGE NOT FOUND\n\nSorry, the page you are looking for does not exist.\n\nBACK TO HOME\nExplore JAX\nGift Cards\nLocatio;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"unavailable_profile_page: SKIP TO CONTENT\\n\\nJAX Store Locations\\n\\nSearch\\nSearch\\nLog in\\nBag\\n404\\n\\nPAGE NOT FOUND\\n\\nSorry, the page you are looking for does not exist.\\n\\nBACK TO HOME\\nExplore JAX\\nGift Cards\\nLocatio;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Jax Outdoor Gear Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on verified outdoor, camping and travel retail social refill channel looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.jaxgoods.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:SKIP TO CONTENT\"},{\"targetUrl\":\"https://www.jaxgoods.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: SKIP TO CONTENT\\n\\nJAX Store Locations\\n\\nSearch\\nSearch\\nLog in\\nBag\\n404\\n\\nPAGE NOT FOUND\\n\\nSorry, the page you are looking for does not exist.\\n\\nBACK TO HOME\\nExplore JAX\\nGift Cards\\nLocatio\"},{\"targetUrl\":\"https://www.jaxgoods.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:SKIP TO CONTENT\"},{\"targetUrl\":\"https://www.jaxgoods.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Something went wrong.\\n\\nWhat happened?\\n404 Not Found\\nWhat can I do?\\nReturn to the previous page.\"},{\"targetUrl\":\"https://www.jaxgoods.com/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Something went wrong.\\n\\nWhat happened?\\n404 Not Found\\nWhat can I do?\\nReturn to the previous page.\"},{\"targetUrl\":\"https://www.jaxgoods.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: SKIP TO CONTENT\\n\\nJAX Store Locations\\n\\nSearch\\nSearch\\nLog in\\nBag\\n404\\n\\nPAGE NOT FOUND\\n\\nSorry, the page you are looking for does not exist.\\n\\nBACK TO HOME\\nExplore JAX\\nGift Cards\\nLocatio\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\",\"fallbackFrom\":\"https://www.instagram.com/jaxoutdoor/\",\"fallbackPlatform\":\"email\",\"fallbackReason\":\"instagram_message_button_clicked_composer_not_found\"}",
        "fallbackFrom": "https://www.instagram.com/jaxoutdoor/",
        "fallbackPlatform": "email",
        "decision": {
          "verdict": "develop",
          "fitScore": 84,
          "reason": "local_codex_extension_template",
          "draft": "Hi Jax Outdoor Gear team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Codex Chrome Extension only",
        "glmModel": "not_used",
        "followup": false
      }
    },
    {
      "id": "google-customer-sportler-instagram",
      "company": "Sportler",
      "action": "develop",
      "platform": "instagram",
      "targetUrl": "https://www.instagram.com/sportler_com/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\n\n您未获授权，无法查看此网页。\n\nHTTP ERROR 403\n重新加载;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.sportler.com/help/contact-us",
        "tabId": "A2CB0A824C670AB505C38BFCABDA1883",
        "title": "www.sportler.com",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\n\n您未获授权，无法查看此网页。\n\nHTTP ERROR 403\n重新加载"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.sportler.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.sportler.com/help/contact-us",
          "tabId": "A2CB0A824C670AB505C38BFCABDA1883",
          "title": "www.sportler.com",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\n\n您未获授权，无法查看此网页。\n\nHTTP ERROR 403\n重新加载"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Sportler Team,\n\nI’m Leo from FLEXTAIL. Your focus on verified outdoor, camping and travel retail social refill channel looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\n\n您未获授权，无法查看此网页。\n\nHTTP ERROR 403\n重新加载;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\\n\\n您未获授权，无法查看此网页。\\n\\nHTTP ERROR 403\\n重新加载;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Sportler Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on verified outdoor, camping and travel retail social refill channel looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.sportler.com/\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\\n\\n您未获授权，无法查看此网页。\\n\\nHTTP ERROR 403\\n重新加载\"},{\"targetUrl\":\"https://www.sportler.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\\n\\n您未获授权，无法查看此网页。\\n\\nHTTP ERROR 403\\n重新加载\"},{\"targetUrl\":\"https://www.sportler.com/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\\n\\n您未获授权，无法查看此网页。\\n\\nHTTP ERROR 403\\n重新加载\"},{\"targetUrl\":\"https://www.sportler.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\\n\\n您未获授权，无法查看此网页。\\n\\nHTTP ERROR 403\\n重新加载\"},{\"targetUrl\":\"https://www.sportler.com/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\\n\\n您未获授权，无法查看此网页。\\n\\nHTTP ERROR 403\\n重新加载\"},{\"targetUrl\":\"https://www.sportler.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_403: 访问 www.sportler.com 的请求遭到拒绝\\n\\n您未获授权，无法查看此网页。\\n\\nHTTP ERROR 403\\n重新加载\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\",\"fallbackFrom\":\"https://www.instagram.com/sportler_com/\",\"fallbackPlatform\":\"email\",\"fallbackReason\":\"instagram_engagement_completed_message_unavailable;instagram_message_button_clicked_composer_not_found;follow_already_active;instagram_post_opened;post_liked;comment_submitted\"}",
        "fallbackFrom": "https://www.instagram.com/sportler_com/",
        "fallbackPlatform": "email",
        "decision": {
          "verdict": "develop",
          "fitScore": 84,
          "reason": "local_codex_extension_template",
          "draft": "Hi Sportler team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Codex Chrome Extension only",
        "glmModel": "not_used",
        "followup": false
      }
    }
  ],
  "skipped": [
    {
      "id": "google-customer-tentworld-website-contact",
      "company": "Tentworld",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-wildfire-sports-website-contact",
      "company": "Wildfire Sports",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-tentworld-australia-facebook",
      "company": "Tentworld Australia",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-tentworld-australia-instagram",
      "company": "Tentworld Australia",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-bergfreunde-website-contact",
      "company": "Bergfreunde",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-obelink-website-contact",
      "company": "Obelink",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-au-vieux-campeur-website-contact",
      "company": "Au Vieux Campeur",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-fjellsport-website-contact",
      "company": "Fjellsport",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-naturkompaniet-website-contact",
      "company": "Naturkompaniet",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-outnorth-website-contact",
      "company": "Outnorth",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-trekitt-website-contact",
      "company": "Trekitt",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-ultralight-outdoor-gear-website-contact",
      "company": "Ultralight Outdoor Gear",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-alpinetrek-website-contact",
      "company": "Alpinetrek",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-barrabes-website-contact",
      "company": "Barrabes",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-de-wit-schijndel-website-contact",
      "company": "De Wit Schijndel",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-ekosport-website-contact",
      "company": "Ekosport",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-scandinavian-outdoor-website-contact",
      "company": "Scandinavian Outdoor",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-snowleader-website-contact",
      "company": "Snowleader",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-friluftsland-website-contact",
      "company": "Friluftsland",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-outdoorxl-website-contact",
      "company": "OutdoorXL",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-spejder-sport-website-contact",
      "company": "Spejder Sport",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-taunton-leisure-website-contact",
      "company": "Taunton Leisure",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-hardloop-website-contact",
      "company": "Hardloop",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-kampeerwereld-hendriks-website-contact",
      "company": "Kampeerwereld Hendriks",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-sportpursuit-website-contact",
      "company": "SportPursuit",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-varuste-website-contact",
      "company": "Varuste",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-next-adventure-website-contact",
      "company": "Next Adventure",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-valhalla-pure-outfitters-website-contact",
      "company": "Valhalla Pure Outfitters",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-kittery-trading-post-website-contact",
      "company": "Kittery Trading Post",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-backcountry-experience-website-contact",
      "company": "Backcountry Experience",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-la-cordee-website-contact",
      "company": "La Cordee",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-latulippe-website-contact",
      "company": "Latulippe",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-neptune-mountaineering-website-contact",
      "company": "Neptune Mountaineering",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-ute-mountaineer-website-contact",
      "company": "Ute Mountaineer",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-arizona-hiking-shack-website-contact",
      "company": "Arizona Hiking Shack",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-bentgate-mountaineering-website-contact",
      "company": "Bentgate Mountaineering",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-the-great-outdoor-shop-website-contact",
      "company": "The Great Outdoor Shop",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-avidmax-outfitters-website-contact",
      "company": "AvidMax Outfitters",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-gear-west-website-contact",
      "company": "Gear West",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-bivouac-outdoor-website-contact",
      "company": "Bivouac Outdoor",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-further-faster-website-contact",
      "company": "Further Faster",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-transa-website-contact",
      "company": "Transa",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "sheet_1779293110195_9myxa520z",
      "company": "ARROW TIRE DISTRIBUTORS",
      "action": "email_priority",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "sheet_1779293110195_g43uimg3f",
      "company": "ARROW TIRE DISTRIBUTORS",
      "action": "email_priority",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "sheet_1779293110195_u24j2gdmq",
      "company": "FAUNA OUTDOOR",
      "action": "email_priority",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "sheet_1779293110195_vwshd681i",
      "company": "FAUNA OUTDOOR",
      "action": "email_priority",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "sheet_1779293110195_g0uwgglwc",
      "company": "JOHN DOYLE DISTRIBUTORS",
      "action": "email_priority",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "sheet_1779293110195_0f1r27koe",
      "company": "TAHOE SPORTS HUB",
      "action": "email_priority",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "sheet_1779293110195_kcsohl3dy",
      "company": "TAHOE SPORTS HUB",
      "action": "email_priority",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "sheet_1779293110195_4akfr27wz",
      "company": "TAHOE SPORTS HUB",
      "action": "email_priority",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-above-and-beyond-facebook",
      "company": "Above and Beyond",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-campz-facebook",
      "company": "Campz",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-doorout-facebook",
      "company": "Doorout",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-facewest-facebook",
      "company": "Facewest",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-ld-mountain-centre-facebook",
      "company": "LD Mountain Centre",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-tiso-facebook",
      "company": "Tiso",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-rock-creek-facebook",
      "company": "Rock/Creek",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-72hours-facebook",
      "company": "72hours",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-atmosphere-facebook",
      "company": "Atmosphere",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-eastern-mountain-sports-facebook",
      "company": "Eastern Mountain Sports",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-jax-outdoor-gear-facebook",
      "company": "Jax Outdoor Gear",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-moosejaw-facebook",
      "company": "Moosejaw",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-the-mountaineer-facebook",
      "company": "The Mountaineer",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-tentworld-nz-facebook",
      "company": "Tentworld NZ",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-8a-pl-instagram",
      "company": "8a.pl",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-above-and-beyond-instagram",
      "company": "Above and Beyond",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-campz-instagram",
      "company": "Campz",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-doorout-instagram",
      "company": "Doorout",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-facewest-instagram",
      "company": "Facewest",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-ld-mountain-centre-instagram",
      "company": "LD Mountain Centre",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-outdoor-specialist-instagram",
      "company": "Outdoor Specialist",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-sklep-podroznika-instagram",
      "company": "Sklep Podroznika",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-tiso-instagram",
      "company": "Tiso",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-rock-creek-instagram",
      "company": "Rock/Creek",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-next-adventure-instagram",
      "company": "Next Adventure",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-72hours-instagram",
      "company": "72hours",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-atmosphere-instagram",
      "company": "Atmosphere",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-the-mountaineer-instagram",
      "company": "The Mountaineer",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-tentworld-nz-instagram",
      "company": "Tentworld NZ",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": 23,
      "company": "Ace Hardware",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 7,
      "company": "AutoZone",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 10,
      "company": "Backcountry.com",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 20,
      "company": "Harbor Freight",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 6,
      "company": "L.L.Bean",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 17,
      "company": "Target",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 22,
      "company": "Thor Industries",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 13,
      "company": "Walgreens",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 18,
      "company": "Winnebago",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 11,
      "company": "Best Buy",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 9,
      "company": "Canadian Tire",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 19,
      "company": "MEC (Mountain Equipment Co-op)",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 16,
      "company": "Airstream",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 5,
      "company": "Pacific Outdoor Group",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 14,
      "company": "Rural King",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 21,
      "company": "RVDA (RV Dealers Association)",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": "google-customer-bergfreunde-website-contact",
      "company": "Bergfreunde",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-obelink-website-contact",
      "company": "Obelink",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-au-vieux-campeur-website-contact",
      "company": "Au Vieux Campeur",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-fjellsport-website-contact",
      "company": "Fjellsport",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-naturkompaniet-website-contact",
      "company": "Naturkompaniet",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-outnorth-website-contact",
      "company": "Outnorth",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-trekitt-website-contact",
      "company": "Trekitt",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-ultralight-outdoor-gear-website-contact",
      "company": "Ultralight Outdoor Gear",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-alpinetrek-website-contact",
      "company": "Alpinetrek",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-barrabes-website-contact",
      "company": "Barrabes",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-de-wit-schijndel-website-contact",
      "company": "De Wit Schijndel",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-ekosport-website-contact",
      "company": "Ekosport",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-scandinavian-outdoor-website-contact",
      "company": "Scandinavian Outdoor",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-snowleader-website-contact",
      "company": "Snowleader",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-friluftsland-website-contact",
      "company": "Friluftsland",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-outdoorxl-website-contact",
      "company": "OutdoorXL",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-spejder-sport-website-contact",
      "company": "Spejder Sport",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-taunton-leisure-website-contact",
      "company": "Taunton Leisure",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-hardloop-website-contact",
      "company": "Hardloop",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-kampeerwereld-hendriks-website-contact",
      "company": "Kampeerwereld Hendriks",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-sportpursuit-website-contact",
      "company": "SportPursuit",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-varuste-website-contact",
      "company": "Varuste",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-next-adventure-website-contact",
      "company": "Next Adventure",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-valhalla-pure-outfitters-website-contact",
      "company": "Valhalla Pure Outfitters",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-kittery-trading-post-website-contact",
      "company": "Kittery Trading Post",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-backcountry-experience-website-contact",
      "company": "Backcountry Experience",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-la-cordee-website-contact",
      "company": "La Cordee",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-latulippe-website-contact",
      "company": "Latulippe",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-neptune-mountaineering-website-contact",
      "company": "Neptune Mountaineering",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-ute-mountaineer-website-contact",
      "company": "Ute Mountaineer",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-arizona-hiking-shack-website-contact",
      "company": "Arizona Hiking Shack",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-bentgate-mountaineering-website-contact",
      "company": "Bentgate Mountaineering",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-the-great-outdoor-shop-website-contact",
      "company": "The Great Outdoor Shop",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-avidmax-outfitters-website-contact",
      "company": "AvidMax Outfitters",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-gear-west-website-contact",
      "company": "Gear West",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-tentworld-website-contact",
      "company": "Tentworld",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-bivouac-outdoor-website-contact",
      "company": "Bivouac Outdoor",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-wildfire-sports-website-contact",
      "company": "Wildfire Sports",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-further-faster-website-contact",
      "company": "Further Faster",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-transa-website-contact",
      "company": "Transa",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-above-and-beyond-facebook",
      "company": "Above and Beyond",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-campz-facebook",
      "company": "Campz",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-doorout-facebook",
      "company": "Doorout",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-facewest-facebook",
      "company": "Facewest",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-ld-mountain-centre-facebook",
      "company": "LD Mountain Centre",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-tiso-facebook",
      "company": "Tiso",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-rock-creek-facebook",
      "company": "Rock/Creek",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-72hours-facebook",
      "company": "72hours",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-atmosphere-facebook",
      "company": "Atmosphere",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-eastern-mountain-sports-facebook",
      "company": "Eastern Mountain Sports",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-jax-outdoor-gear-facebook",
      "company": "Jax Outdoor Gear",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-moosejaw-facebook",
      "company": "Moosejaw",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-the-mountaineer-facebook",
      "company": "The Mountaineer",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-tentworld-australia-facebook",
      "company": "Tentworld Australia",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-tentworld-nz-facebook",
      "company": "Tentworld NZ",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-8a-pl-instagram",
      "company": "8a.pl",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-above-and-beyond-instagram",
      "company": "Above and Beyond",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-campz-instagram",
      "company": "Campz",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-doorout-instagram",
      "company": "Doorout",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-facewest-instagram",
      "company": "Facewest",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-ld-mountain-centre-instagram",
      "company": "LD Mountain Centre",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-outdoor-specialist-instagram",
      "company": "Outdoor Specialist",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-sklep-podroznika-instagram",
      "company": "Sklep Podroznika",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-tiso-instagram",
      "company": "Tiso",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-rock-creek-instagram",
      "company": "Rock/Creek",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-next-adventure-instagram",
      "company": "Next Adventure",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-72hours-instagram",
      "company": "72hours",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-atmosphere-instagram",
      "company": "Atmosphere",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-the-mountaineer-instagram",
      "company": "The Mountaineer",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-tentworld-australia-instagram",
      "company": "Tentworld Australia",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-tentworld-nz-instagram",
      "company": "Tentworld NZ",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "sheet_1779293110195_9myxa520z",
      "company": "ARROW TIRE DISTRIBUTORS",
      "action": "email_priority",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "sheet_1779293110195_g43uimg3f",
      "company": "ARROW TIRE DISTRIBUTORS",
      "action": "email_priority",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "sheet_1779293110195_u24j2gdmq",
      "company": "FAUNA OUTDOOR",
      "action": "email_priority",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "sheet_1779293110195_vwshd681i",
      "company": "FAUNA OUTDOOR",
      "action": "email_priority",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "sheet_1779293110195_g0uwgglwc",
      "company": "JOHN DOYLE DISTRIBUTORS",
      "action": "email_priority",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "sheet_1779293110195_0f1r27koe",
      "company": "TAHOE SPORTS HUB",
      "action": "email_priority",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "sheet_1779293110195_kcsohl3dy",
      "company": "TAHOE SPORTS HUB",
      "action": "email_priority",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "sheet_1779293110195_4akfr27wz",
      "company": "TAHOE SPORTS HUB",
      "action": "email_priority",
      "reason": "official_website_contact_channel"
    },
    {
      "id": 23,
      "company": "Ace Hardware",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 7,
      "company": "AutoZone",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 10,
      "company": "Backcountry.com",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 20,
      "company": "Harbor Freight",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 6,
      "company": "L.L.Bean",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 17,
      "company": "Target",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 22,
      "company": "Thor Industries",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 13,
      "company": "Walgreens",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 18,
      "company": "Winnebago",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 11,
      "company": "Best Buy",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 9,
      "company": "Canadian Tire",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 19,
      "company": "MEC (Mountain Equipment Co-op)",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 16,
      "company": "Airstream",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 5,
      "company": "Pacific Outdoor Group",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 14,
      "company": "Rural King",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    },
    {
      "id": 21,
      "company": "RVDA (RV Dealers Association)",
      "action": "verify_target",
      "reason": "missing_verified_profile_url"
    }
  ],
  "summary": {
    "totalLeads": 16,
    "highIcp": 16,
    "readyToDevelop": 34,
    "dueNow": 98,
    "visibleTodayQueue": 44,
    "potentialPool": 98,
    "potentialPoolTarget": 100,
    "customerTableHighIcp": 24,
    "refillNeeded": 2,
    "googleDiscovered": 74,
    "facebookDiscovered": 15,
    "websiteContactDiscovered": 40,
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
      "reason": "homepage_only_contact_path_requires_verification",
      "status": "skipped",
      "count": 80
    },
    {
      "reason": "concrete_google_discovered_major_customer_instagram",
      "status": "skipped",
      "count": 32
    },
    {
      "reason": "missing_verified_profile_url",
      "status": "skipped",
      "count": 32
    },
    {
      "reason": "concrete_google_discovered_major_customer_facebook",
      "status": "skipped",
      "count": 30
    },
    {
      "reason": "official_website_contact_channel",
      "status": "skipped",
      "count": 16
    },
    {
      "reason": "failed_open",
      "status": "failed_open",
      "count": 1
    }
  ],
  "blockerCounts": {
    "homepage_only_contact_path_requires_verification": 80,
    "concrete_google_discovered_major_customer_instagram": 32,
    "missing_verified_profile_url": 32,
    "concrete_google_discovered_major_customer_facebook": 30,
    "official_website_contact_channel": 16,
    "failed_open": 1
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
  "userVisibleStatus": "Customer development was not performed. Blockers: homepage_only_contact_path_requires_verification (80); concrete_google_discovered_major_customer_instagram (32); missing_verified_profile_url (32).",
  "recoveryHint": "Refill the high-ICP pool with 2 verified leads or unblock existing website/social leads before the next run. Add a verified Facebook or Instagram profile URL before retrying social outreach. Confirm the official social profile and safe message entry before rerunning Google-discovered social outreach. Verify the official profile opens and exposes a safe message composer, or switch to another verified channel.",
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
      "reason": "missing_verified_profile_url",
      "action": "Verify official social profile URL",
      "description": "Add a verified Facebook or Instagram profile URL before retrying social outreach.",
      "hint": "Add a verified Facebook or Instagram profile URL before retrying social outreach."
    },
    {
      "reason": "google_social_profile_not_executable",
      "action": "Complete Google social channel verification",
      "description": "Confirm the official social profile and safe message entry before rerunning Google-discovered social outreach.",
      "hint": "Confirm the official social profile and safe message entry before rerunning Google-discovered social outreach."
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
    "stdout": "{\n  \"date\": \"2026-07-21\",\n  \"summary\": {\n    \"totalLeads\": 16,\n    \"highIcp\": 16,\n    \"readyToDevelop\": 34,\n    \"dueNow\": 98,\n    \"visibleTodayQueue\": 44,\n    \"potentialPool\": 98,\n    \"potentialPoolTarget\": 100,\n    \"customerTableHighIcp\": 24,\n    \"refillNeeded\": 2,\n    \"googleDiscovered\": 74,\n    \"facebookDiscovered\": 15,\n    \"websiteContactDiscovered\": 40,\n    \"scheduledLater\": 0,\n    \"cooldown\": 30,\n    \"emailPriority\": 0,\n    \"openAgencyMarket\": 15,\n    \"exclusiveAgencySkipped\": 1,\n    \"needsVerification\": 0,\n    \"retainedLowIcp\": 0\n  },\n  \"bugErrors\": 0,\n  \"queueFile\": \"E:\\\\New project\\\\outreach-dashboard\\\\daily-runs\\\\2026-07-21-daily-automation.json\",\n  \"csvFile\": \"E:\\\\New project\\\\outreach-dashboard\\\\daily-runs\\\\2026-07-21-daily-queue.csv\"\n}",
    "stderr": "",
    "error": "",
    "visibility": {
      "updatedAt": "2026-07-21T05:05:50.685Z",
      "source": "main-refreshDailyAutomationArtifacts",
      "runDate": "2026-07-21",
      "artifactGeneratedAt": "2026-07-21T05:05:49.125Z",
      "executionGeneratedAt": "2026-07-21T04:21:08.394Z",
      "githubSyncUpdatedAt": "2026-07-21T04:21:55.578Z",
      "counts": {
        "dailyQueue": 98,
        "googleDiscovered": 74,
        "websiteContact": 40,
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
        "potentialPool": 98,
        "refillNeeded": 2,
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
  "completedAt": "2026-07-21T05:05:51.952Z"
};
