window.DAILY_AUTOMATION_EXECUTION_LATEST = {
  "ok": false,
  "browserTransportRequested": "codex-extension-first",
  "browserTransportUsed": "cdp",
  "browserTransportFallbackReason": "extension_bridge_not_available_process_local_cdp",
  "extensionReceiptCount": 0,
  "executionPhase": "browser_execution",
  "chromeStage": "opened",
  "chromeOpened": true,
  "chromeOpenedCount": 3,
  "customerDevelopmentPerformed": false,
  "customerMessageSent": false,
  "realDevelopmentCount": 0,
  "reportingVerdict": "no_customer_development_performed",
  "engine": "Browser transport queue bridge",
  "mode": "serial-single-target",
  "batchMode": "parallel-batches",
  "parallelLimit": 1,
  "limit": 25,
  "queueDate": "2026-08-13",
  "queueSource": "dailyQueue",
  "executed": [
    {
      "id": "google-customer-rabbit-mountain-mexico-website-contact",
      "company": "Rabbit Mountain Mexico",
      "action": "email_priority",
      "platform": "email",
      "targetUrl": "https://rabbitmex.com/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2",
      "timestamp": "2026-08-13T11:23:41.993Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/rabbitmountainmex/",
        "tabId": "F0E84803CB939CC509AF7BB849041397",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/F0E84803CB939CC509AF7BB849041397",
        "title": "Rabbit Mountain de México (@rabbitmountainmex) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "browserEngine": "codex-chrome-cdp",
        "mode": "codex_chrome_cdp",
        "targetUrl": "https://www.instagram.com/rabbitmountainmex/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/rabbitmountainmex/",
          "tabId": "F0E84803CB939CC509AF7BB849041397",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/F0E84803CB939CC509AF7BB849041397",
          "title": "Rabbit Mountain de México (@rabbitmountainmex) · Instagram 照片和视频"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2\",\"nextAction\":\"Composer not detected; pause automation and notify operator only if retry would be unsafe.\",\"draft\":\"Hi Rabbit Mountain Mexico team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 95,
          "reason": "local_codex_extension_template",
          "draft": "Hi Rabbit Mountain Mexico team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Chrome CDP fallback",
        "glmModel": "not_used",
        "followup": false,
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2",
        "socialFallbackEvidence": "instagram_message_button_clicked_composer_not_found"
      }
    },
    {
      "id": "google-customer-punto-vertical-mexico-website-contact",
      "company": "Punto Vertical Mexico",
      "action": "email_priority",
      "platform": "email",
      "targetUrl": "https://www.puntovertical.com.mx/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;public_email_fallback_available:contacto@puntovertical.com.mx;email_sender_not_configured;email_sender_delivery_disabled;sender_identity_dsn_observed;no_send_performed;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-13T11:24:00.369Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.puntovertical.com.mx/help/contact-us",
        "tabId": "776F127CB6BF2C27224605B254FE558E",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/776F127CB6BF2C27224605B254FE558E",
        "title": "Contact Us - PUNTO VERTICAL"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.puntovertical.com.mx/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.puntovertical.com.mx/help/contact-us",
          "tabId": "776F127CB6BF2C27224605B254FE558E",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/776F127CB6BF2C27224605B254FE558E",
          "title": "Contact Us - PUNTO VERTICAL"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Punto Vertical Mexico Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;public_email_fallback_available:contacto@puntovertical.com.mx;email_sender_not_configured;email_sender_delivery_disabled;sender_identity_dsn_observed;no_send_performed;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;public_email_fallback_available:contacto@puntovertical.com.mx;email_sender_not_configured;email_sender_delivery_disabled;sender_identity_dsn_observed;no_send_performed;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Email delivery to contacto@puntovertical.com.mx requires a configured sender; continue with another verified contact path or LinkedIn, Facebook, or Instagram instead of claiming a send.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Punto Vertical Mexico Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.puntovertical.com.mx/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.puntovertical.com.mx/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.puntovertical.com.mx/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.puntovertical.com.mx/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.puntovertical.com.mx/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.puntovertical.com.mx/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
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
      "evidence": "website_contact_entry_not_verified;contact_entry_clicked:Skip to content;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2",
      "timestamp": "2026-08-13T11:25:20.293Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/nomadic.supply/",
        "tabId": "EAF2C72E784BCEA4D9C7F2EC9BBCBAA9",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/EAF2C72E784BCEA4D9C7F2EC9BBCBAA9",
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
          "tabId": "EAF2C72E784BCEA4D9C7F2EC9BBCBAA9",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/EAF2C72E784BCEA4D9C7F2EC9BBCBAA9",
          "title": "Nomadic Supply Company® (@nomadic.supply) · Instagram 照片和视频"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Skip to content;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2\",\"nextAction\":\"Composer not detected; pause automation and notify operator only if retry would be unsafe.\",\"draft\":\"Hi Nomadic Supply Company team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 95,
          "reason": "local_codex_extension_template",
          "draft": "Hi Nomadic Supply Company team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Chrome CDP fallback",
        "glmModel": "not_used",
        "followup": false,
        "evidence": "website_contact_entry_not_verified;contact_entry_clicked:Skip to content;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2",
        "socialFallbackEvidence": "instagram_message_button_clicked_composer_not_found"
      }
    }
  ],
  "results": [
    {
      "id": "google-customer-rabbit-mountain-mexico-website-contact",
      "company": "Rabbit Mountain Mexico",
      "action": "email_priority",
      "platform": "email",
      "targetUrl": "https://rabbitmex.com/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2",
      "timestamp": "2026-08-13T11:23:41.993Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/rabbitmountainmex/",
        "tabId": "F0E84803CB939CC509AF7BB849041397",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/F0E84803CB939CC509AF7BB849041397",
        "title": "Rabbit Mountain de México (@rabbitmountainmex) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "browserEngine": "codex-chrome-cdp",
        "mode": "codex_chrome_cdp",
        "targetUrl": "https://www.instagram.com/rabbitmountainmex/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/rabbitmountainmex/",
          "tabId": "F0E84803CB939CC509AF7BB849041397",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/F0E84803CB939CC509AF7BB849041397",
          "title": "Rabbit Mountain de México (@rabbitmountainmex) · Instagram 照片和视频"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2\",\"nextAction\":\"Composer not detected; pause automation and notify operator only if retry would be unsafe.\",\"draft\":\"Hi Rabbit Mountain Mexico team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 95,
          "reason": "local_codex_extension_template",
          "draft": "Hi Rabbit Mountain Mexico team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Chrome CDP fallback",
        "glmModel": "not_used",
        "followup": false,
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2",
        "socialFallbackEvidence": "instagram_message_button_clicked_composer_not_found"
      }
    },
    {
      "id": "google-customer-punto-vertical-mexico-website-contact",
      "company": "Punto Vertical Mexico",
      "action": "email_priority",
      "platform": "email",
      "targetUrl": "https://www.puntovertical.com.mx/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;public_email_fallback_available:contacto@puntovertical.com.mx;email_sender_not_configured;email_sender_delivery_disabled;sender_identity_dsn_observed;no_send_performed;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "timestamp": "2026-08-13T11:24:00.369Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.puntovertical.com.mx/help/contact-us",
        "tabId": "776F127CB6BF2C27224605B254FE558E",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/776F127CB6BF2C27224605B254FE558E",
        "title": "Contact Us - PUNTO VERTICAL"
      },
      "result": {
        "ok": false,
        "engine": "dedicated-chrome-cdp-website-contact",
        "browserEngine": "codex-chrome-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.puntovertical.com.mx/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.puntovertical.com.mx/help/contact-us",
          "tabId": "776F127CB6BF2C27224605B254FE558E",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/776F127CB6BF2C27224605B254FE558E",
          "title": "Contact Us - PUNTO VERTICAL"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Punto Vertical Mexico Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;public_email_fallback_available:contacto@puntovertical.com.mx;email_sender_not_configured;email_sender_delivery_disabled;sender_identity_dsn_observed;no_send_performed;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;public_email_fallback_available:contacto@puntovertical.com.mx;email_sender_not_configured;email_sender_delivery_disabled;sender_identity_dsn_observed;no_send_performed;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Email delivery to contacto@puntovertical.com.mx requires a configured sender; continue with another verified contact path or LinkedIn, Facebook, or Instagram instead of claiming a send.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Punto Vertical Mexico Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.puntovertical.com.mx/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.puntovertical.com.mx/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.puntovertical.com.mx/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.puntovertical.com.mx/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.puntovertical.com.mx/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.puntovertical.com.mx/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
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
      "evidence": "website_contact_entry_not_verified;contact_entry_clicked:Skip to content;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2",
      "timestamp": "2026-08-13T11:25:20.293Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/nomadic.supply/",
        "tabId": "EAF2C72E784BCEA4D9C7F2EC9BBCBAA9",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/EAF2C72E784BCEA4D9C7F2EC9BBCBAA9",
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
          "tabId": "EAF2C72E784BCEA4D9C7F2EC9BBCBAA9",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/EAF2C72E784BCEA4D9C7F2EC9BBCBAA9",
          "title": "Nomadic Supply Company® (@nomadic.supply) · Instagram 照片和视频"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Skip to content;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2\",\"nextAction\":\"Composer not detected; pause automation and notify operator only if retry would be unsafe.\",\"draft\":\"Hi Nomadic Supply Company team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 95,
          "reason": "local_codex_extension_template",
          "draft": "Hi Nomadic Supply Company team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Chrome CDP fallback",
        "glmModel": "not_used",
        "followup": false,
        "evidence": "website_contact_entry_not_verified;contact_entry_clicked:Skip to content;official_social_fallback:instagram;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2",
        "socialFallbackEvidence": "instagram_message_button_clicked_composer_not_found"
      }
    }
  ],
  "skipped": [
    {
      "id": "google-customer-pro-line-sports-website-contact",
      "company": "Pro Line Sports",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-avenue-distribution-website-contact",
      "company": "Avenue Distribution",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-gravel-agency-website-contact",
      "company": "Gravel Agency",
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
      "id": "google-customer-rock-gear-distribution-website-contact",
      "company": "Rock Gear Distribution",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-base-camp-agency-website-contact",
      "company": "Base Camp Agency",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-blueriver-trading-website-contact",
      "company": "BlueRiver Trading",
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
      "id": "google-customer-rv-lifestyle-website-contact",
      "company": "RV Lifestyle",
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
      "id": "google-customer-our-habit-sales-website-contact",
      "company": "Our Habit Sales",
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
      "id": "google-customer-rock-creek-website-contact",
      "company": "Rock/Creek",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-blue-ridge-knives-website-contact",
      "company": "Blue Ridge Knives",
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
      "id": "google-customer-rtic-mexico-website-contact",
      "company": "RTIC Mexico",
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
      "id": "google-customer-level-8-outdoor-website-contact",
      "company": "Level 8 Outdoor",
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
      "id": "google-customer-salvation-sales-website-contact",
      "company": "Salvation Sales",
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
      "id": "google-customer-sky-lines-website-contact",
      "company": "Sky-Lines",
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
      "id": "google-customer-garibaldi-supply-co-website-contact",
      "company": "Garibaldi Supply Co.",
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
      "id": "google-customer-premium-living-products-website-contact",
      "company": "Premium Living Products",
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
      "id": "google-customer-young-mackenzie-distribution-linkedin",
      "company": "Young & MacKenzie Distribution",
      "action": "verify_target",
      "platform": "linkedin",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "google-customer-elevated-outdoor-sales-linkedin",
      "company": "Elevated Outdoor Sales",
      "action": "verify_target",
      "platform": "linkedin",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "google-customer-northern-exposure-sporting-group-linkedin",
      "company": "Northern Exposure Sporting Group",
      "action": "verify_target",
      "platform": "linkedin",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "google-customer-360-adventure-collective-linkedin",
      "company": "360 Adventure Collective",
      "action": "verify_target",
      "platform": "linkedin",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "google-customer-front-point-sales-linkedin",
      "company": "Front Point Sales",
      "action": "verify_target",
      "platform": "linkedin",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "google-customer-onwardup-facebook",
      "company": "OnwardUP",
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
      "id": "google-customer-three-mountain-associates-facebook",
      "company": "Three Mountain Associates",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-caraway-co-facebook",
      "company": "Caraway & Co.",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-outdoor-gear-canada-facebook",
      "company": "Outdoor Gear Canada",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-revassa-facebook",
      "company": "REVASSA",
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
      "id": "google-customer-parallel-45-sales-group-instagram",
      "company": "Parallel 45 Sales Group",
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
      "id": "google-customer-eastern-mountain-sports-instagram",
      "company": "Eastern Mountain Sports",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-fjellsport-website-contact",
      "company": "Fjellsport",
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
      "id": "google-customer-mountain-source-website-contact",
      "company": "Mountain Source",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-sespe-group-website-contact",
      "company": "Sespe Group",
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
      "id": "google-customer-pacific-coast-sports-marketing-website-contact",
      "company": "Pacific Coast Sports Marketing",
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
      "id": "google-customer-howe-sound-sales-website-contact",
      "company": "Howe Sound Sales",
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
      "id": "google-customer-4-point-sales-website-contact",
      "company": "4 Point Sales",
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
      "id": "google-customer-babbling-brook-sales-website-contact",
      "company": "Babbling Brook Sales",
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
      "id": "google-customer-crf-agency-website-contact",
      "company": "CRF Agency",
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
      "id": "google-customer-mutinous-sales-and-marketing-website-contact",
      "company": "Mutinous Sales and Marketing",
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
      "id": "google-customer-atmosphere-website-contact",
      "company": "Atmosphere",
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
      "id": "google-customer-young-mackenzie-distribution-linkedin",
      "company": "Young & MacKenzie Distribution",
      "action": "verify_target",
      "platform": "linkedin",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "google-customer-elevated-outdoor-sales-linkedin",
      "company": "Elevated Outdoor Sales",
      "action": "verify_target",
      "platform": "linkedin",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "google-customer-northern-exposure-sporting-group-linkedin",
      "company": "Northern Exposure Sporting Group",
      "action": "verify_target",
      "platform": "linkedin",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "google-customer-360-adventure-collective-linkedin",
      "company": "360 Adventure Collective",
      "action": "verify_target",
      "platform": "linkedin",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "google-customer-front-point-sales-linkedin",
      "company": "Front Point Sales",
      "action": "verify_target",
      "platform": "linkedin",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "google-customer-onwardup-facebook",
      "company": "OnwardUP",
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
      "id": "google-customer-three-mountain-associates-facebook",
      "company": "Three Mountain Associates",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-caraway-co-facebook",
      "company": "Caraway & Co.",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-outdoor-gear-canada-facebook",
      "company": "Outdoor Gear Canada",
      "action": "develop",
      "platform": "facebook",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-revassa-facebook",
      "company": "REVASSA",
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
      "id": "google-customer-parallel-45-sales-group-instagram",
      "company": "Parallel 45 Sales Group",
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
      "id": "google-customer-eastern-mountain-sports-instagram",
      "company": "Eastern Mountain Sports",
      "action": "develop",
      "platform": "instagram",
      "reason": "official_website_social_channel_verified"
    },
    {
      "id": "google-customer-pro-line-sports-website-contact",
      "company": "Pro Line Sports",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-avenue-distribution-website-contact",
      "company": "Avenue Distribution",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-gravel-agency-website-contact",
      "company": "Gravel Agency",
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
      "id": "google-customer-rock-gear-distribution-website-contact",
      "company": "Rock Gear Distribution",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-base-camp-agency-website-contact",
      "company": "Base Camp Agency",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-blueriver-trading-website-contact",
      "company": "BlueRiver Trading",
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
      "id": "google-customer-rv-lifestyle-website-contact",
      "company": "RV Lifestyle",
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
      "id": "google-customer-our-habit-sales-website-contact",
      "company": "Our Habit Sales",
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
      "id": "google-customer-rock-creek-website-contact",
      "company": "Rock/Creek",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-blue-ridge-knives-website-contact",
      "company": "Blue Ridge Knives",
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
      "id": "google-customer-rtic-mexico-website-contact",
      "company": "RTIC Mexico",
      "action": "email_priority",
      "platform": "email",
      "reason": "official_public_business_email_verified"
    },
    {
      "id": "google-customer-mountain-source-website-contact",
      "company": "Mountain Source",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-sespe-group-website-contact",
      "company": "Sespe Group",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
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
      "id": "google-customer-waypoint-outdoor-website-contact",
      "company": "Waypoint Outdoor",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
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
      "id": "google-customer-pacific-coast-sports-marketing-website-contact",
      "company": "Pacific Coast Sports Marketing",
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
      "id": "google-customer-howe-sound-sales-website-contact",
      "company": "Howe Sound Sales",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-salvation-sales-website-contact",
      "company": "Salvation Sales",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-terra-outdoor-gear-distribution-website-contact",
      "company": "Terra Outdoor Gear Distribution",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-4-point-sales-website-contact",
      "company": "4 Point Sales",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-action-sports-agency-website-contact",
      "company": "Action Sports Agency",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-sky-lines-website-contact",
      "company": "Sky-Lines",
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
      "id": "google-customer-babbling-brook-sales-website-contact",
      "company": "Babbling Brook Sales",
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
    },
    {
      "id": "google-customer-edgeline-collective-website-contact",
      "company": "Edgeline Collective",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-garibaldi-supply-co-website-contact",
      "company": "Garibaldi Supply Co.",
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
      "id": "google-customer-d-m-a-distributing-website-contact",
      "company": "D.M.A. Distributing",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
    },
    {
      "id": "google-customer-gmd-wholesale-website-contact",
      "company": "GMD Wholesale",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
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
      "id": "google-customer-crf-agency-website-contact",
      "company": "CRF Agency",
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
      "id": "google-customer-premium-living-products-website-contact",
      "company": "Premium Living Products",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    },
    {
      "id": "google-customer-mutinous-sales-and-marketing-website-contact",
      "company": "Mutinous Sales and Marketing",
      "action": "verify_target",
      "platform": "website_form",
      "reason": "website_contact_capability_not_verified"
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
      "id": "google-customer-atmosphere-website-contact",
      "company": "Atmosphere",
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
    },
    {
      "id": "google-customer-rona-website-contact",
      "company": "RONA",
      "action": "develop",
      "platform": "website_form",
      "reason": "official_website_contact_channel"
    }
  ],
  "summary": {
    "totalLeads": 16,
    "highIcp": 16,
    "readyToDevelop": 33,
    "dueNow": 100,
    "visibleTodayQueue": 92,
    "potentialPool": 92,
    "potentialPoolTarget": 100,
    "customerTableHighIcp": 0,
    "refillNeeded": 8,
    "executableCompanies": 67,
    "executableReserveTarget": 130,
    "executableReserveNeeded": 63,
    "executableByChannel": {
      "linkedin": 5,
      "facebook": 10,
      "instagram": 4,
      "email": 26,
      "website_form": 22
    },
    "verifiedSocialCompanies": 19,
    "verifiedSocialReserveTarget": 20,
    "verifiedSocialReserveNeeded": 1,
    "enrichmentBacklogCount": 25,
    "googleDiscovered": 100,
    "facebookDiscovered": 10,
    "websiteContactDiscovered": 31,
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
      "count": 53
    },
    {
      "reason": "official_website_contact_channel",
      "status": "skipped",
      "count": 44
    },
    {
      "reason": "official_website_social_channel_verified",
      "status": "skipped",
      "count": 28
    },
    {
      "reason": "homepage_only_contact_path_requires_verification",
      "status": "skipped",
      "count": 26
    },
    {
      "reason": "website_contact_capability_not_verified",
      "status": "skipped",
      "count": 25
    },
    {
      "reason": "linkedin_channel_requires_supported_executor",
      "status": "skipped",
      "count": 10
    },
    {
      "reason": "failed_open",
      "status": "failed_open",
      "count": 2
    }
  ],
  "blockerCounts": {
    "official_public_business_email_verified": 53,
    "official_website_contact_channel": 44,
    "official_website_social_channel_verified": 28,
    "homepage_only_contact_path_requires_verification": 26,
    "website_contact_capability_not_verified": 25,
    "linkedin_channel_requires_supported_executor": 10,
    "failed_open": 2
  },
  "queueGoalStatus": {
    "target": 100,
    "potentialPool": 92,
    "queueCount": 100,
    "googleDiscovered": 100,
    "refillNeeded": 8,
    "confirmedToday": 24,
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
  "userVisibleStatus": "Customer development was not performed. Blockers: official_public_business_email_verified (53); official_website_contact_channel (44); official_website_social_channel_verified (28).",
  "recoveryHint": "Refill the high-ICP pool with 8 verified leads or unblock existing website/social leads before the next run. Verify the official profile opens and exposes a safe message composer, or switch to another verified channel.",
  "recoveryActions": [
    {
      "reason": "daily_queue_goal_not_reached",
      "action": "Refill high-ICP customer pool",
      "description": "Add or unblock 8 verified high-ICP leads to reach the daily 100 target.",
      "hint": "Refill the high-ICP pool with 8 verified leads or unblock existing website/social leads before the next run.",
      "target": 100,
      "potentialPool": 92,
      "refillNeeded": 8
    },
    {
      "reason": "failed_open",
      "action": "Verify profile accessibility",
      "description": "Open the official profile manually or switch to another verified channel before retrying.",
      "hint": "Verify the official profile opens and exposes a safe message composer, or switch to another verified channel."
    }
  ],
  "systemRefresh": {
    "ok": false,
    "stdout": "",
    "stderr": "node:fs:3104\r\n  binding.copyFile(\r\n          ^\r\n\r\nError: UNKNOWN: unknown error, copyfile 'E:\\New project\\outreach-dashboard\\system-visibility-latest.js' -> 'E:\\New project\\outreach-dashboard\\public\\system-visibility-latest.js'\r\n    at Object.copyFileSync (node:fs:3104:11)\r\n    at copyPublicArtifact (E:\\New project\\outreach-dashboard\\daily-automation-runner.js:959:6)\r\n    at Array.forEach (<anonymous>)\r\n    at writeSystemVisibilityArtifact (E:\\New project\\outreach-dashboard\\daily-automation-runner.js:1023:5)\r\n    at writeRunArtifacts (E:\\New project\\outreach-dashboard\\daily-automation-runner.js:950:3)\r\n    at main (E:\\New project\\outreach-dashboard\\daily-automation-runner.js:1652:17)\r\n    at Object.<anonymous> (E:\\New project\\outreach-dashboard\\daily-automation-runner.js:1672:3)\r\n    at Module._compile (node:internal/modules/cjs/loader:1812:14)\r\n    at Object..js (node:internal/modules/cjs/loader:1943:10)\r\n    at Module.load (node:internal/modules/cjs/loader:1533:32) {\r\n  errno: -4094,\r\n  code: 'UNKNOWN',\r\n  syscall: 'copyfile',\r\n  path: 'E:\\\\New project\\\\outreach-dashboard\\\\system-visibility-latest.js',\r\n  dest: 'E:\\\\New project\\\\outreach-dashboard\\\\public\\\\system-visibility-latest.js'\r\n}\r\n\r\nNode.js v24.14.0",
    "error": "Command failed: node E:\\New project\\outreach-dashboard\\daily-automation-runner.js --fix\nnode:fs:3104\r\n  binding.copyFile(\r\n          ^\r\n\r\nError: UNKNOWN: unknown error, copyfile 'E:\\New project\\outreach-dashboard\\system-visibility-latest.js' -> 'E:\\New project\\outreach-dashboard\\public\\system-visibility-latest.js'\r\n    at Object.copyFileSync (node:fs:3104:11)\r\n    at copyPublicArtifact (E:\\New project\\outreach-dashboard\\daily-automation-runner.js:959:6)\r\n    at Array.forEach (<anonymous>)\r\n    at writeSystemVisibilityArtifact (E:\\New project\\outreach-dashboard\\daily-automation-runner.js:1023:5)\r\n    at writeRunArtifacts (E:\\New project\\outreach-dashboard\\daily-automation-runner.js:950:3)\r\n    at main (E:\\New project\\outreach-dashboard\\daily-automation-runner.js:1652:17)\r\n    at Object.<anonymous> (E:\\New project\\outreach-dashboard\\daily-automation-runner.js:1672:3)\r\n    at Module._compile (node:internal/modules/cjs/loader:1812:14)\r\n    at Object..js (node:internal/modules/cjs/loader:1943:10)\r\n    at Module.load (node:internal/modules/cjs/loader:1533:32) {\r\n  errno: -4094,\r\n  code: 'UNKNOWN',\r\n  syscall: 'copyfile',\r\n  path: 'E:\\\\New project\\\\outreach-dashboard\\\\system-visibility-latest.js',\r\n  dest: 'E:\\\\New project\\\\outreach-dashboard\\\\public\\\\system-visibility-latest.js'\r\n}\r\n\r\nNode.js v24.14.0\r\n",
    "visibility": {
      "updatedAt": "2026-08-13T11:25:22.447Z",
      "source": "main-refreshDailyAutomationArtifacts",
      "runDate": "2026-08-13",
      "artifactGeneratedAt": "2026-08-13T11:25:20.519Z",
      "executionGeneratedAt": "2026-08-13T10:31:37.472Z",
      "githubSyncUpdatedAt": "2026-08-13T10:34:20.192Z",
      "counts": {
        "dailyQueue": 100,
        "googleDiscovered": 100,
        "websiteContact": 81,
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
        "potentialPool": 92,
        "refillNeeded": 8,
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
    "senderIdentityFailures": 13
  },
  "ledgerReconciliationCount": 0,
  "externalEvidenceReconciliationCount": 0,
  "completedAt": "2026-08-13T11:25:23.524Z"
};
