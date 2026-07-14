window.DAILY_AUTOMATION_EXECUTION_LATEST = {
  "ok": false,
  "executionPhase": "browser_execution",
  "chromeStage": "opened",
  "chromeOpened": true,
  "chromeOpenedCount": 7,
  "customerDevelopmentPerformed": false,
  "customerMessageSent": false,
  "realDevelopmentCount": 0,
  "reportingVerdict": "no_customer_development_performed",
  "engine": "Codex Chrome Extension queue bridge",
  "mode": "serial-single-target",
  "batchMode": "parallel-batches",
  "parallelLimit": 1,
  "limit": 10,
  "queueDate": "2026-07-14",
  "queueSource": "dailyQueue",
  "executed": [
    {
      "id": "google-customer-esprinet-group-linkedin",
      "company": "Esprinet Group",
      "action": "develop",
      "platform": "linkedin",
      "targetUrl": "https://www.linkedin.com/company/esprinet-group/",
      "ok": false,
      "sendStatus": "send_unconfirmed",
      "evidence": "linkedin_send_clicked_but_confirmation_missing",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.linkedin.com/company/esprinet-group/",
        "tabId": "26BB0847E781EEE768DA996F01AC857F",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/26BB0847E781EEE768DA996F01AC857F",
        "title": "(31) Esprinet Group: Overview | LinkedIn"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_primary_no_autoglm",
        "targetUrl": "https://www.linkedin.com/company/esprinet-group/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.linkedin.com/company/esprinet-group/",
          "tabId": "26BB0847E781EEE768DA996F01AC857F",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/26BB0847E781EEE768DA996F01AC857F",
          "title": "(31) Esprinet Group: Overview | LinkedIn"
        },
        "sendStatus": "send_unconfirmed",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"linkedin_send_clicked_but_confirmation_missing\",\"nextAction\":\"Send confirmation missing; pause and notify operator before any retry to avoid duplicate sending.\",\"draft\":\"Thanks, Esprinet Group team. Email or WhatsApp works well. Could you share the best buyer/category contact for camping accessories vendor review? I will send a concise FLEXTAIL and Vollyc brand intro, line sheet, and current product specs through that channel.\",\"sendStatus\":\"send_unconfirmed\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 99,
          "reason": "local_template_fallback_after_glm_error: GLM request failed: 429 余额不足或无可用资源包,请充值。",
          "draft": "Hi Esprinet Group team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a distributor/importer, the strongest fit is regional sell-through, channel fit, margin-ready product line, and whether they cover outdoor/travel electronics buyers; your Southern Europe technology and consumer electronics distributor focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the owner of distribution evaluation or the best time for a short intro video meeting?"
        },
        "glmModel": "local-professional-template-fallback",
        "followup": false
      }
    },
    {
      "id": "google-customer-cms-distribution-linkedin",
      "company": "CMS Distribution",
      "action": "develop",
      "platform": "linkedin",
      "targetUrl": "https://www.linkedin.com/company/cms-distribution",
      "ok": false,
      "sendStatus": "send_unconfirmed",
      "evidence": "linkedin_draft_not_inserted_before_send",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.linkedin.com/company/cms-distribution",
        "tabId": "0D12F45E08D2536304D7CB10F4EA65F7",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/0D12F45E08D2536304D7CB10F4EA65F7",
        "title": "(31) CMS Distribution: Overview | LinkedIn"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_primary_no_autoglm",
        "targetUrl": "https://www.linkedin.com/company/cms-distribution",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.linkedin.com/company/cms-distribution",
          "tabId": "0D12F45E08D2536304D7CB10F4EA65F7",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/0D12F45E08D2536304D7CB10F4EA65F7",
          "title": "(31) CMS Distribution: Overview | LinkedIn"
        },
        "sendStatus": "send_unconfirmed",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"linkedin_draft_not_inserted_before_send\",\"nextAction\":\"Marketing draft was not detected in the message composer; do not click Send or retry blindly.\",\"draft\":\"Hi CMS Distribution team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a distributor/importer, the strongest fit is regional sell-through, channel fit, margin-ready product line, and whether they cover outdoor/travel electronics buyers; your European value-added consumer electronics and technology distributor focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the owner of distribution evaluation or the best time for a short intro video meeting?\",\"sendStatus\":\"send_unconfirmed\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 97,
          "reason": "local_template_fallback_after_glm_error: GLM request failed: 429 余额不足或无可用资源包,请充值。",
          "draft": "Hi CMS Distribution team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a distributor/importer, the strongest fit is regional sell-through, channel fit, margin-ready product line, and whether they cover outdoor/travel electronics buyers; your European value-added consumer electronics and technology distributor focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the owner of distribution evaluation or the best time for a short intro video meeting?"
        },
        "glmModel": "local-professional-template-fallback",
        "followup": false
      }
    },
    {
      "id": "google-customer-snowys-outdoors-facebook",
      "company": "Snowys Outdoors",
      "action": "develop",
      "platform": "facebook",
      "targetUrl": "https://www.facebook.com/SnowysOutdoors/",
      "ok": false,
      "sendStatus": "send_unconfirmed",
      "evidence": "facebook_draft_not_inserted_after_composer_refocus;editable_count:3;composer_text_length:2;active:BODY",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.facebook.com/SnowysOutdoors/",
        "tabId": "E19197A8BA50618CFB346FDBCEB1192A",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/E19197A8BA50618CFB346FDBCEB1192A",
        "title": "Facebook"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_primary_no_autoglm",
        "targetUrl": "https://www.facebook.com/SnowysOutdoors/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.facebook.com/SnowysOutdoors/",
          "tabId": "E19197A8BA50618CFB346FDBCEB1192A",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/E19197A8BA50618CFB346FDBCEB1192A",
          "title": "Facebook"
        },
        "sendStatus": "send_unconfirmed",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"facebook_draft_not_inserted_after_composer_refocus;editable_count:3;composer_text_length:2;active:BODY\",\"nextAction\":\"Marketing draft was not detected in the message composer; do not click Send or retry blindly.\",\"draft\":\"Thanks, Snowys Outdoors team. Email or WhatsApp works well. Could you share the best buyer/category contact for camping accessories vendor review? I will send a concise FLEXTAIL and Vollyc brand intro, line sheet, and current product specs through that channel.\",\"sendStatus\":\"send_unconfirmed\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 87,
          "reason": "local_template_fallback_after_glm_error: GLM request failed: 429 余额不足或无可用资源包,请充值。",
          "draft": "Hi Snowys Outdoors team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your camping and hiking ecommerce retailer focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "glmModel": "local-professional-template-fallback",
        "followup": false
      }
    },
    {
      "id": "google-customer-garage-grown-gear-instagram",
      "company": "Garage Grown Gear",
      "action": "develop",
      "platform": "instagram",
      "targetUrl": "https://www.instagram.com/garagegrowngear/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "instagram_message_button_clicked_composer_not_found",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/garagegrowngear/",
        "tabId": "56AAB98188E96674EF978E5224212B72",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/56AAB98188E96674EF978E5224212B72",
        "title": "Garage Grown Gear (@garagegrowngear) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_primary_no_autoglm",
        "targetUrl": "https://www.instagram.com/garagegrowngear/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/garagegrowngear/",
          "tabId": "56AAB98188E96674EF978E5224212B72",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/56AAB98188E96674EF978E5224212B72",
          "title": "Garage Grown Gear (@garagegrowngear) · Instagram 照片和视频"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"instagram_message_button_clicked_composer_not_found\",\"nextAction\":\"Composer not detected; pause automation and notify operator only if retry would be unsafe.\",\"draft\":\"Hi Garage Grown Gear team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 91,
          "reason": "local_template_fallback_after_glm_error: GLM request failed: 429 余额不足或无可用资源包,请充值。",
          "draft": "Hi Garage Grown Gear team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "glmModel": "local-professional-template-fallback",
        "followup": false
      }
    },
    {
      "id": "google-customer-snowys-outdoors-instagram",
      "company": "Snowys Outdoors",
      "action": "develop",
      "platform": "instagram",
      "targetUrl": "https://www.instagram.com/snowys_outdoors/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "instagram_message_button_clicked_composer_not_found",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/snowys_outdoors/",
        "tabId": "614B26F9967ACFC5BBCA50419DD81D9F",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/614B26F9967ACFC5BBCA50419DD81D9F",
        "title": "Snowys Outdoors (@snowys_outdoors) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_primary_no_autoglm",
        "targetUrl": "https://www.instagram.com/snowys_outdoors/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/snowys_outdoors/",
          "tabId": "614B26F9967ACFC5BBCA50419DD81D9F",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/614B26F9967ACFC5BBCA50419DD81D9F",
          "title": "Snowys Outdoors (@snowys_outdoors) · Instagram 照片和视频"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"instagram_message_button_clicked_composer_not_found\",\"nextAction\":\"Composer not detected; pause automation and notify operator only if retry would be unsafe.\",\"draft\":\"Hi Snowys Outdoors team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your camping and hiking ecommerce retailer focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 87,
          "reason": "local_template_fallback_after_glm_error: GLM request failed: 429 余额不足或无可用资源包,请充值。",
          "draft": "Hi Snowys Outdoors team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your camping and hiking ecommerce retailer focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "glmModel": "local-professional-template-fallback",
        "followup": false
      }
    },
    {
      "id": "google-customer-esprinet-group-website-contact",
      "company": "Esprinet Group",
      "action": "email_priority",
      "platform": "email",
      "targetUrl": "https://www.esprinet.com/en/become-a-supplier/",
      "ok": false,
      "skipped": true,
      "sendStatus": "skipped",
      "evidence": "same_day_customer_already_developed",
      "chromeOpen": null,
      "result": {
        "ok": false,
        "skipped": true,
        "sendStatus": "skipped",
        "evidence": "same_day_customer_already_developed"
      }
    },
    {
      "id": "google-customer-cms-distribution-website-contact",
      "company": "CMS Distribution",
      "action": "email_priority",
      "platform": "email",
      "targetUrl": "https://www.cmsdistribution.com/contact-us",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;contact_entry_clicked:Skip to content;website_contact_all_targets_failed:2",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.cmsdistribution.com/",
        "tabId": "9AD013B91C857C5C5CD37B05A25CEEC1",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/9AD013B91C857C5C5CD37B05A25CEEC1",
        "title": "Connecting People to Technology | CMS Distribution"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.cmsdistribution.com/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.cmsdistribution.com/",
          "tabId": "9AD013B91C857C5C5CD37B05A25CEEC1",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/9AD013B91C857C5C5CD37B05A25CEEC1",
          "title": "Connecting People to Technology | CMS Distribution"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "Flextail & Vollyc | Lightweight Outdoor & 3C Electronics – Potential Cooperation",
        "draft": "Dear CMS Distribution Team,\n\nNice to e-meet you.\nI am Leo, from Flextail & Vollyc.\n\nFlextail is our first and core brand, specializing in ultralight electric products for outdoor, travel, and home use. The brand is currently Top 1 on Amazon, with strong global sell-through and a proven product-market fit.\nVollyc, our second brand, focuses on 3C electronics, targeting practical, high-rotation consumer use cases.\n\nFrom our perspective, your platform and positioning are highly aligned with Flextail’s product philosophy, especially in lightweight outdoor and travel-oriented electrics.\n\nWe have already contacted with your team, and we are now actively exploring opportunities in other regions.\nAttached, you will find a brief introduction to our brands and current product catalog for your reference.\n\nLooking ahead, we are planning to launch over 36 new SKUs in 2026, covering multiple usage scenarios and price tiers, which we believe could be of interest to your assortment strategy.\n\nIf you are available, I would greatly appreciate the opportunity to arrange a short introductory video meeting to present our brands and discuss potential collaboration opportunities.\n\nThank you for your time and consideration. I look forward to your reply.\n\n[Flextail.com](https://www.flextail.com/), [vollyc.com](https://vollyc.com/)\n\n[Sincerely](https://wa.me/8617321028184)\n[Best Regard](https://wa.me/8617321028184)\n[Leo Liu](https://wa.me/8617321028184)\n[Sales](https://wa.me/8617321028184) [& Operations Director](https://wa.me/8617321028184)\n[Brand & ODM Department](https://wa.me/8617321028184)\n[Tel/whatsapp:  +86 17321028184](https://wa.me/8617321028184)\n\n[Email:  Leo@flextailgear.com](https://wa.me/8617321028184)\n[SHANGHAI FLEXTAIL TECHNOLOGY CO.,LTD.](https://wa.me/8617321028184)\n[Room103, Building No.6, No.1 Yanjiaqiao, Pudong District, ShangHai, China](https://wa.me/8617321028184)",
        "evidence": "website_contact_entry_not_verified;contact_entry_clicked:Skip to content;website_contact_all_targets_failed:2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Skip to content;website_contact_all_targets_failed:2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"Flextail & Vollyc | Lightweight Outdoor & 3C Electronics – Potential Cooperation\",\"draft\":\"Dear CMS Distribution Team,\\n\\nNice to e-meet you.\\nI am Leo, from Flextail & Vollyc.\\n\\nFlextail is our first and core brand, specializing in ultralight electric products for outdoor, travel, and home use. The brand is currently Top 1 on Amazon, with strong global sell-through and a proven product-market fit.\\nVollyc, our second brand, focuses on 3C electronics, targeting practical, high-rotation consumer use cases.\\n\\nFrom our perspective, your platform and positioning are highly aligned with Flextail’s product philosophy, especially in lightweight outdoor and travel-oriented electrics.\\n\\nWe have already contacted with your team, and we are now actively exploring opportunities in other regions.\\nAttached, you will find a brief introduction to our brands and current product catalog for your reference.\\n\\nLooking ahead, we are planning to launch over 36 new SKUs in 2026, covering multiple usage scenarios and price tiers, which we believe could be of interest to your assortment strategy.\\n\\nIf you are available, I would greatly appreciate the opportunity to arrange a short introductory video meeting to present our brands and discuss potential collaboration opportunities.\\n\\nThank you for your time and consideration. I look forward to your reply.\\n\\n[Flextail.com](https://www.flextail.com/), [vollyc.com](https://vollyc.com/)\\n\\n[Sincerely](https://wa.me/8617321028184)\\n[Best Regard](https://wa.me/8617321028184)\\n[Leo Liu](https://wa.me/8617321028184)\\n[Sales](https://wa.me/8617321028184) [& Operations Director](https://wa.me/8617321028184)\\n[Brand & ODM Department](https://wa.me/8617321028184)\\n[Tel/whatsapp:  +86 17321028184](https://wa.me/8617321028184)\\n\\n[Email:  Leo@flextailgear.com](https://wa.me/8617321028184)\\n[SHANGHAI FLEXTAIL TECHNOLOGY CO.,LTD.](https://wa.me/8617321028184)\\n[Room103, Building No.6, No.1 Yanjiaqiao, Pudong District, ShangHai, China](https://wa.me/8617321028184)\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.cmsdistribution.com/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Skip to content\"},{\"targetUrl\":\"https://www.cmsdistribution.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Skip to content\"}]}"
      }
    },
    {
      "id": "google-customer-snowys-outdoors-website-contact",
      "company": "Snowys Outdoors",
      "action": "email_priority",
      "platform": "email",
      "targetUrl": "https://www.snowys.com.au/contact-us",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:2",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.snowys.com.au/",
        "tabId": "5C61E6FFF768A4F4602E502BD107776F",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/5C61E6FFF768A4F4602E502BD107776F",
        "title": "Snowys Outdoors | Australia's Best Online Camping Gear Store"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.snowys.com.au/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.snowys.com.au/",
          "tabId": "5C61E6FFF768A4F4602E502BD107776F",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/5C61E6FFF768A4F4602E502BD107776F",
          "title": "Snowys Outdoors | Australia's Best Online Camping Gear Store"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "Flextail & Vollyc | Lightweight Outdoor & 3C Electronics – Potential Cooperation",
        "draft": "Dear Snowys Outdoors Team,\n\nNice to e-meet you.\nI am Leo, from Flextail & Vollyc.\n\nFlextail is our first and core brand, specializing in ultralight electric products for outdoor, travel, and home use. The brand is currently Top 1 on Amazon, with strong global sell-through and a proven product-market fit.\nVollyc, our second brand, focuses on 3C electronics, targeting practical, high-rotation consumer use cases.\n\nFrom our perspective, your platform and positioning are highly aligned with Flextail’s product philosophy, especially in lightweight outdoor and travel-oriented electrics.\n\nWe have already contacted with your team, and we are now actively exploring opportunities in other regions.\nAttached, you will find a brief introduction to our brands and current product catalog for your reference.\n\nLooking ahead, we are planning to launch over 36 new SKUs in 2026, covering multiple usage scenarios and price tiers, which we believe could be of interest to your assortment strategy.\n\nIf you are available, I would greatly appreciate the opportunity to arrange a short introductory video meeting to present our brands and discuss potential collaboration opportunities.\n\nThank you for your time and consideration. I look forward to your reply.\n\n[Flextail.com](https://www.flextail.com/), [vollyc.com](https://vollyc.com/)\n\n[Sincerely](https://wa.me/8617321028184)\n[Best Regard](https://wa.me/8617321028184)\n[Leo Liu](https://wa.me/8617321028184)\n[Sales](https://wa.me/8617321028184) [& Operations Director](https://wa.me/8617321028184)\n[Brand & ODM Department](https://wa.me/8617321028184)\n[Tel/whatsapp:  +86 17321028184](https://wa.me/8617321028184)\n\n[Email:  Leo@flextailgear.com](https://wa.me/8617321028184)\n[SHANGHAI FLEXTAIL TECHNOLOGY CO.,LTD.](https://wa.me/8617321028184)\n[Room103, Building No.6, No.1 Yanjiaqiao, Pudong District, ShangHai, China](https://wa.me/8617321028184)",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"Flextail & Vollyc | Lightweight Outdoor & 3C Electronics – Potential Cooperation\",\"draft\":\"Dear Snowys Outdoors Team,\\n\\nNice to e-meet you.\\nI am Leo, from Flextail & Vollyc.\\n\\nFlextail is our first and core brand, specializing in ultralight electric products for outdoor, travel, and home use. The brand is currently Top 1 on Amazon, with strong global sell-through and a proven product-market fit.\\nVollyc, our second brand, focuses on 3C electronics, targeting practical, high-rotation consumer use cases.\\n\\nFrom our perspective, your platform and positioning are highly aligned with Flextail’s product philosophy, especially in lightweight outdoor and travel-oriented electrics.\\n\\nWe have already contacted with your team, and we are now actively exploring opportunities in other regions.\\nAttached, you will find a brief introduction to our brands and current product catalog for your reference.\\n\\nLooking ahead, we are planning to launch over 36 new SKUs in 2026, covering multiple usage scenarios and price tiers, which we believe could be of interest to your assortment strategy.\\n\\nIf you are available, I would greatly appreciate the opportunity to arrange a short introductory video meeting to present our brands and discuss potential collaboration opportunities.\\n\\nThank you for your time and consideration. I look forward to your reply.\\n\\n[Flextail.com](https://www.flextail.com/), [vollyc.com](https://vollyc.com/)\\n\\n[Sincerely](https://wa.me/8617321028184)\\n[Best Regard](https://wa.me/8617321028184)\\n[Leo Liu](https://wa.me/8617321028184)\\n[Sales](https://wa.me/8617321028184) [& Operations Director](https://wa.me/8617321028184)\\n[Brand & ODM Department](https://wa.me/8617321028184)\\n[Tel/whatsapp:  +86 17321028184](https://wa.me/8617321028184)\\n\\n[Email:  Leo@flextailgear.com](https://wa.me/8617321028184)\\n[SHANGHAI FLEXTAIL TECHNOLOGY CO.,LTD.](https://wa.me/8617321028184)\\n[Room103, Building No.6, No.1 Yanjiaqiao, Pudong District, ShangHai, China](https://wa.me/8617321028184)\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.snowys.com.au/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.snowys.com.au/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
      }
    }
  ],
  "results": [
    {
      "id": "google-customer-esprinet-group-linkedin",
      "company": "Esprinet Group",
      "action": "develop",
      "platform": "linkedin",
      "targetUrl": "https://www.linkedin.com/company/esprinet-group/",
      "ok": false,
      "sendStatus": "send_unconfirmed",
      "evidence": "linkedin_send_clicked_but_confirmation_missing",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.linkedin.com/company/esprinet-group/",
        "tabId": "26BB0847E781EEE768DA996F01AC857F",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/26BB0847E781EEE768DA996F01AC857F",
        "title": "(31) Esprinet Group: Overview | LinkedIn"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_primary_no_autoglm",
        "targetUrl": "https://www.linkedin.com/company/esprinet-group/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.linkedin.com/company/esprinet-group/",
          "tabId": "26BB0847E781EEE768DA996F01AC857F",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/26BB0847E781EEE768DA996F01AC857F",
          "title": "(31) Esprinet Group: Overview | LinkedIn"
        },
        "sendStatus": "send_unconfirmed",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"linkedin_send_clicked_but_confirmation_missing\",\"nextAction\":\"Send confirmation missing; pause and notify operator before any retry to avoid duplicate sending.\",\"draft\":\"Thanks, Esprinet Group team. Email or WhatsApp works well. Could you share the best buyer/category contact for camping accessories vendor review? I will send a concise FLEXTAIL and Vollyc brand intro, line sheet, and current product specs through that channel.\",\"sendStatus\":\"send_unconfirmed\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 99,
          "reason": "local_template_fallback_after_glm_error: GLM request failed: 429 余额不足或无可用资源包,请充值。",
          "draft": "Hi Esprinet Group team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a distributor/importer, the strongest fit is regional sell-through, channel fit, margin-ready product line, and whether they cover outdoor/travel electronics buyers; your Southern Europe technology and consumer electronics distributor focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the owner of distribution evaluation or the best time for a short intro video meeting?"
        },
        "glmModel": "local-professional-template-fallback",
        "followup": false
      }
    },
    {
      "id": "google-customer-cms-distribution-linkedin",
      "company": "CMS Distribution",
      "action": "develop",
      "platform": "linkedin",
      "targetUrl": "https://www.linkedin.com/company/cms-distribution",
      "ok": false,
      "sendStatus": "send_unconfirmed",
      "evidence": "linkedin_draft_not_inserted_before_send",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.linkedin.com/company/cms-distribution",
        "tabId": "0D12F45E08D2536304D7CB10F4EA65F7",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/0D12F45E08D2536304D7CB10F4EA65F7",
        "title": "(31) CMS Distribution: Overview | LinkedIn"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_primary_no_autoglm",
        "targetUrl": "https://www.linkedin.com/company/cms-distribution",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.linkedin.com/company/cms-distribution",
          "tabId": "0D12F45E08D2536304D7CB10F4EA65F7",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/0D12F45E08D2536304D7CB10F4EA65F7",
          "title": "(31) CMS Distribution: Overview | LinkedIn"
        },
        "sendStatus": "send_unconfirmed",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"linkedin_draft_not_inserted_before_send\",\"nextAction\":\"Marketing draft was not detected in the message composer; do not click Send or retry blindly.\",\"draft\":\"Hi CMS Distribution team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a distributor/importer, the strongest fit is regional sell-through, channel fit, margin-ready product line, and whether they cover outdoor/travel electronics buyers; your European value-added consumer electronics and technology distributor focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the owner of distribution evaluation or the best time for a short intro video meeting?\",\"sendStatus\":\"send_unconfirmed\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 97,
          "reason": "local_template_fallback_after_glm_error: GLM request failed: 429 余额不足或无可用资源包,请充值。",
          "draft": "Hi CMS Distribution team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a distributor/importer, the strongest fit is regional sell-through, channel fit, margin-ready product line, and whether they cover outdoor/travel electronics buyers; your European value-added consumer electronics and technology distributor focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the owner of distribution evaluation or the best time for a short intro video meeting?"
        },
        "glmModel": "local-professional-template-fallback",
        "followup": false
      }
    },
    {
      "id": "google-customer-snowys-outdoors-facebook",
      "company": "Snowys Outdoors",
      "action": "develop",
      "platform": "facebook",
      "targetUrl": "https://www.facebook.com/SnowysOutdoors/",
      "ok": false,
      "sendStatus": "send_unconfirmed",
      "evidence": "facebook_draft_not_inserted_after_composer_refocus;editable_count:3;composer_text_length:2;active:BODY",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.facebook.com/SnowysOutdoors/",
        "tabId": "E19197A8BA50618CFB346FDBCEB1192A",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/E19197A8BA50618CFB346FDBCEB1192A",
        "title": "Facebook"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_primary_no_autoglm",
        "targetUrl": "https://www.facebook.com/SnowysOutdoors/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.facebook.com/SnowysOutdoors/",
          "tabId": "E19197A8BA50618CFB346FDBCEB1192A",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/E19197A8BA50618CFB346FDBCEB1192A",
          "title": "Facebook"
        },
        "sendStatus": "send_unconfirmed",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"facebook_draft_not_inserted_after_composer_refocus;editable_count:3;composer_text_length:2;active:BODY\",\"nextAction\":\"Marketing draft was not detected in the message composer; do not click Send or retry blindly.\",\"draft\":\"Thanks, Snowys Outdoors team. Email or WhatsApp works well. Could you share the best buyer/category contact for camping accessories vendor review? I will send a concise FLEXTAIL and Vollyc brand intro, line sheet, and current product specs through that channel.\",\"sendStatus\":\"send_unconfirmed\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 87,
          "reason": "local_template_fallback_after_glm_error: GLM request failed: 429 余额不足或无可用资源包,请充值。",
          "draft": "Hi Snowys Outdoors team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your camping and hiking ecommerce retailer focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "glmModel": "local-professional-template-fallback",
        "followup": false
      }
    },
    {
      "id": "google-customer-garage-grown-gear-instagram",
      "company": "Garage Grown Gear",
      "action": "develop",
      "platform": "instagram",
      "targetUrl": "https://www.instagram.com/garagegrowngear/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "instagram_message_button_clicked_composer_not_found",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/garagegrowngear/",
        "tabId": "56AAB98188E96674EF978E5224212B72",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/56AAB98188E96674EF978E5224212B72",
        "title": "Garage Grown Gear (@garagegrowngear) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_primary_no_autoglm",
        "targetUrl": "https://www.instagram.com/garagegrowngear/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/garagegrowngear/",
          "tabId": "56AAB98188E96674EF978E5224212B72",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/56AAB98188E96674EF978E5224212B72",
          "title": "Garage Grown Gear (@garagegrowngear) · Instagram 照片和视频"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"instagram_message_button_clicked_composer_not_found\",\"nextAction\":\"Composer not detected; pause automation and notify operator only if retry would be unsafe.\",\"draft\":\"Hi Garage Grown Gear team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 91,
          "reason": "local_template_fallback_after_glm_error: GLM request failed: 429 余额不足或无可用资源包,请充值。",
          "draft": "Hi Garage Grown Gear team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping, travel and consumer electronics retail channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "glmModel": "local-professional-template-fallback",
        "followup": false
      }
    },
    {
      "id": "google-customer-snowys-outdoors-instagram",
      "company": "Snowys Outdoors",
      "action": "develop",
      "platform": "instagram",
      "targetUrl": "https://www.instagram.com/snowys_outdoors/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "instagram_message_button_clicked_composer_not_found",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/snowys_outdoors/",
        "tabId": "614B26F9967ACFC5BBCA50419DD81D9F",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/614B26F9967ACFC5BBCA50419DD81D9F",
        "title": "Snowys Outdoors (@snowys_outdoors) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_primary_no_autoglm",
        "targetUrl": "https://www.instagram.com/snowys_outdoors/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/snowys_outdoors/",
          "tabId": "614B26F9967ACFC5BBCA50419DD81D9F",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/614B26F9967ACFC5BBCA50419DD81D9F",
          "title": "Snowys Outdoors (@snowys_outdoors) · Instagram 照片和视频"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"instagram_message_button_clicked_composer_not_found\",\"nextAction\":\"Composer not detected; pause automation and notify operator only if retry would be unsafe.\",\"draft\":\"Hi Snowys Outdoors team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your camping and hiking ecommerce retailer focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 87,
          "reason": "local_template_fallback_after_glm_error: GLM request failed: 429 余额不足或无可用资源包,请充值。",
          "draft": "Hi Snowys Outdoors team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your camping and hiking ecommerce retailer focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "glmModel": "local-professional-template-fallback",
        "followup": false
      }
    },
    {
      "id": "google-customer-esprinet-group-website-contact",
      "company": "Esprinet Group",
      "action": "email_priority",
      "platform": "email",
      "targetUrl": "https://www.esprinet.com/en/become-a-supplier/",
      "ok": false,
      "skipped": true,
      "sendStatus": "skipped",
      "evidence": "same_day_customer_already_developed",
      "chromeOpen": null,
      "result": {
        "ok": false,
        "skipped": true,
        "sendStatus": "skipped",
        "evidence": "same_day_customer_already_developed"
      }
    },
    {
      "id": "google-customer-cms-distribution-website-contact",
      "company": "CMS Distribution",
      "action": "email_priority",
      "platform": "email",
      "targetUrl": "https://www.cmsdistribution.com/contact-us",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;contact_entry_clicked:Skip to content;website_contact_all_targets_failed:2",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.cmsdistribution.com/",
        "tabId": "9AD013B91C857C5C5CD37B05A25CEEC1",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/9AD013B91C857C5C5CD37B05A25CEEC1",
        "title": "Connecting People to Technology | CMS Distribution"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.cmsdistribution.com/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.cmsdistribution.com/",
          "tabId": "9AD013B91C857C5C5CD37B05A25CEEC1",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/9AD013B91C857C5C5CD37B05A25CEEC1",
          "title": "Connecting People to Technology | CMS Distribution"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "Flextail & Vollyc | Lightweight Outdoor & 3C Electronics – Potential Cooperation",
        "draft": "Dear CMS Distribution Team,\n\nNice to e-meet you.\nI am Leo, from Flextail & Vollyc.\n\nFlextail is our first and core brand, specializing in ultralight electric products for outdoor, travel, and home use. The brand is currently Top 1 on Amazon, with strong global sell-through and a proven product-market fit.\nVollyc, our second brand, focuses on 3C electronics, targeting practical, high-rotation consumer use cases.\n\nFrom our perspective, your platform and positioning are highly aligned with Flextail’s product philosophy, especially in lightweight outdoor and travel-oriented electrics.\n\nWe have already contacted with your team, and we are now actively exploring opportunities in other regions.\nAttached, you will find a brief introduction to our brands and current product catalog for your reference.\n\nLooking ahead, we are planning to launch over 36 new SKUs in 2026, covering multiple usage scenarios and price tiers, which we believe could be of interest to your assortment strategy.\n\nIf you are available, I would greatly appreciate the opportunity to arrange a short introductory video meeting to present our brands and discuss potential collaboration opportunities.\n\nThank you for your time and consideration. I look forward to your reply.\n\n[Flextail.com](https://www.flextail.com/), [vollyc.com](https://vollyc.com/)\n\n[Sincerely](https://wa.me/8617321028184)\n[Best Regard](https://wa.me/8617321028184)\n[Leo Liu](https://wa.me/8617321028184)\n[Sales](https://wa.me/8617321028184) [& Operations Director](https://wa.me/8617321028184)\n[Brand & ODM Department](https://wa.me/8617321028184)\n[Tel/whatsapp:  +86 17321028184](https://wa.me/8617321028184)\n\n[Email:  Leo@flextailgear.com](https://wa.me/8617321028184)\n[SHANGHAI FLEXTAIL TECHNOLOGY CO.,LTD.](https://wa.me/8617321028184)\n[Room103, Building No.6, No.1 Yanjiaqiao, Pudong District, ShangHai, China](https://wa.me/8617321028184)",
        "evidence": "website_contact_entry_not_verified;contact_entry_clicked:Skip to content;website_contact_all_targets_failed:2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Skip to content;website_contact_all_targets_failed:2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"Flextail & Vollyc | Lightweight Outdoor & 3C Electronics – Potential Cooperation\",\"draft\":\"Dear CMS Distribution Team,\\n\\nNice to e-meet you.\\nI am Leo, from Flextail & Vollyc.\\n\\nFlextail is our first and core brand, specializing in ultralight electric products for outdoor, travel, and home use. The brand is currently Top 1 on Amazon, with strong global sell-through and a proven product-market fit.\\nVollyc, our second brand, focuses on 3C electronics, targeting practical, high-rotation consumer use cases.\\n\\nFrom our perspective, your platform and positioning are highly aligned with Flextail’s product philosophy, especially in lightweight outdoor and travel-oriented electrics.\\n\\nWe have already contacted with your team, and we are now actively exploring opportunities in other regions.\\nAttached, you will find a brief introduction to our brands and current product catalog for your reference.\\n\\nLooking ahead, we are planning to launch over 36 new SKUs in 2026, covering multiple usage scenarios and price tiers, which we believe could be of interest to your assortment strategy.\\n\\nIf you are available, I would greatly appreciate the opportunity to arrange a short introductory video meeting to present our brands and discuss potential collaboration opportunities.\\n\\nThank you for your time and consideration. I look forward to your reply.\\n\\n[Flextail.com](https://www.flextail.com/), [vollyc.com](https://vollyc.com/)\\n\\n[Sincerely](https://wa.me/8617321028184)\\n[Best Regard](https://wa.me/8617321028184)\\n[Leo Liu](https://wa.me/8617321028184)\\n[Sales](https://wa.me/8617321028184) [& Operations Director](https://wa.me/8617321028184)\\n[Brand & ODM Department](https://wa.me/8617321028184)\\n[Tel/whatsapp:  +86 17321028184](https://wa.me/8617321028184)\\n\\n[Email:  Leo@flextailgear.com](https://wa.me/8617321028184)\\n[SHANGHAI FLEXTAIL TECHNOLOGY CO.,LTD.](https://wa.me/8617321028184)\\n[Room103, Building No.6, No.1 Yanjiaqiao, Pudong District, ShangHai, China](https://wa.me/8617321028184)\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.cmsdistribution.com/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Skip to content\"},{\"targetUrl\":\"https://www.cmsdistribution.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:Skip to content\"}]}"
      }
    },
    {
      "id": "google-customer-snowys-outdoors-website-contact",
      "company": "Snowys Outdoors",
      "action": "email_priority",
      "platform": "email",
      "targetUrl": "https://www.snowys.com.au/contact-us",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:2",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.snowys.com.au/",
        "tabId": "5C61E6FFF768A4F4602E502BD107776F",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/5C61E6FFF768A4F4602E502BD107776F",
        "title": "Snowys Outdoors | Australia's Best Online Camping Gear Store"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.snowys.com.au/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.snowys.com.au/",
          "tabId": "5C61E6FFF768A4F4602E502BD107776F",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/5C61E6FFF768A4F4602E502BD107776F",
          "title": "Snowys Outdoors | Australia's Best Online Camping Gear Store"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "Flextail & Vollyc | Lightweight Outdoor & 3C Electronics – Potential Cooperation",
        "draft": "Dear Snowys Outdoors Team,\n\nNice to e-meet you.\nI am Leo, from Flextail & Vollyc.\n\nFlextail is our first and core brand, specializing in ultralight electric products for outdoor, travel, and home use. The brand is currently Top 1 on Amazon, with strong global sell-through and a proven product-market fit.\nVollyc, our second brand, focuses on 3C electronics, targeting practical, high-rotation consumer use cases.\n\nFrom our perspective, your platform and positioning are highly aligned with Flextail’s product philosophy, especially in lightweight outdoor and travel-oriented electrics.\n\nWe have already contacted with your team, and we are now actively exploring opportunities in other regions.\nAttached, you will find a brief introduction to our brands and current product catalog for your reference.\n\nLooking ahead, we are planning to launch over 36 new SKUs in 2026, covering multiple usage scenarios and price tiers, which we believe could be of interest to your assortment strategy.\n\nIf you are available, I would greatly appreciate the opportunity to arrange a short introductory video meeting to present our brands and discuss potential collaboration opportunities.\n\nThank you for your time and consideration. I look forward to your reply.\n\n[Flextail.com](https://www.flextail.com/), [vollyc.com](https://vollyc.com/)\n\n[Sincerely](https://wa.me/8617321028184)\n[Best Regard](https://wa.me/8617321028184)\n[Leo Liu](https://wa.me/8617321028184)\n[Sales](https://wa.me/8617321028184) [& Operations Director](https://wa.me/8617321028184)\n[Brand & ODM Department](https://wa.me/8617321028184)\n[Tel/whatsapp:  +86 17321028184](https://wa.me/8617321028184)\n\n[Email:  Leo@flextailgear.com](https://wa.me/8617321028184)\n[SHANGHAI FLEXTAIL TECHNOLOGY CO.,LTD.](https://wa.me/8617321028184)\n[Room103, Building No.6, No.1 Yanjiaqiao, Pudong District, ShangHai, China](https://wa.me/8617321028184)",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"Flextail & Vollyc | Lightweight Outdoor & 3C Electronics – Potential Cooperation\",\"draft\":\"Dear Snowys Outdoors Team,\\n\\nNice to e-meet you.\\nI am Leo, from Flextail & Vollyc.\\n\\nFlextail is our first and core brand, specializing in ultralight electric products for outdoor, travel, and home use. The brand is currently Top 1 on Amazon, with strong global sell-through and a proven product-market fit.\\nVollyc, our second brand, focuses on 3C electronics, targeting practical, high-rotation consumer use cases.\\n\\nFrom our perspective, your platform and positioning are highly aligned with Flextail’s product philosophy, especially in lightweight outdoor and travel-oriented electrics.\\n\\nWe have already contacted with your team, and we are now actively exploring opportunities in other regions.\\nAttached, you will find a brief introduction to our brands and current product catalog for your reference.\\n\\nLooking ahead, we are planning to launch over 36 new SKUs in 2026, covering multiple usage scenarios and price tiers, which we believe could be of interest to your assortment strategy.\\n\\nIf you are available, I would greatly appreciate the opportunity to arrange a short introductory video meeting to present our brands and discuss potential collaboration opportunities.\\n\\nThank you for your time and consideration. I look forward to your reply.\\n\\n[Flextail.com](https://www.flextail.com/), [vollyc.com](https://vollyc.com/)\\n\\n[Sincerely](https://wa.me/8617321028184)\\n[Best Regard](https://wa.me/8617321028184)\\n[Leo Liu](https://wa.me/8617321028184)\\n[Sales](https://wa.me/8617321028184) [& Operations Director](https://wa.me/8617321028184)\\n[Brand & ODM Department](https://wa.me/8617321028184)\\n[Tel/whatsapp:  +86 17321028184](https://wa.me/8617321028184)\\n\\n[Email:  Leo@flextailgear.com](https://wa.me/8617321028184)\\n[SHANGHAI FLEXTAIL TECHNOLOGY CO.,LTD.](https://wa.me/8617321028184)\\n[Room103, Building No.6, No.1 Yanjiaqiao, Pudong District, ShangHai, China](https://wa.me/8617321028184)\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.snowys.com.au/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.snowys.com.au/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
      }
    }
  ],
  "skipped": [
    {
      "id": "google-customer-next-adventure-instagram",
      "company": "Next Adventure",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-summit-international-website-contact",
      "company": "Summit International",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-aqipa-website-contact",
      "company": "Aqipa",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-obelink-website-contact",
      "company": "Obelink",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-globetrotter-website-contact",
      "company": "Globetrotter",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-au-vieux-campeur-website-contact",
      "company": "Au Vieux Campeur",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-bergfreunde-website-contact",
      "company": "Bergfreunde",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-fritz-berger-website-contact",
      "company": "Fritz Berger",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-bergzeit-website-contact",
      "company": "Bergzeit",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-camping-wagner-website-contact",
      "company": "Camping Wagner",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-fjellsport-website-contact",
      "company": "Fjellsport",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-naturkompaniet-website-contact",
      "company": "Naturkompaniet",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-outnorth-website-contact",
      "company": "Outnorth",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-trekitt-website-contact",
      "company": "Trekitt",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-ultralight-outdoor-gear-website-contact",
      "company": "Ultralight Outdoor Gear",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-alpinetrek-website-contact",
      "company": "Alpinetrek",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-barrabes-website-contact",
      "company": "Barrabes",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-de-wit-schijndel-website-contact",
      "company": "De Wit Schijndel",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-ekosport-website-contact",
      "company": "Ekosport",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-scandinavian-outdoor-website-contact",
      "company": "Scandinavian Outdoor",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-snowleader-website-contact",
      "company": "Snowleader",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-friluftsland-website-contact",
      "company": "Friluftsland",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-outdoorxl-website-contact",
      "company": "OutdoorXL",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-spejder-sport-website-contact",
      "company": "Spejder Sport",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-taunton-leisure-website-contact",
      "company": "Taunton Leisure",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-hardloop-website-contact",
      "company": "Hardloop",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-kampeerwereld-hendriks-website-contact",
      "company": "Kampeerwereld Hendriks",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-sportpursuit-website-contact",
      "company": "SportPursuit",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-varuste-website-contact",
      "company": "Varuste",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-garage-grown-gear-website-contact",
      "company": "Garage Grown Gear",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-next-adventure-website-contact",
      "company": "Next Adventure",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-valhalla-pure-outfitters-website-contact",
      "company": "Valhalla Pure Outfitters",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-kittery-trading-post-website-contact",
      "company": "Kittery Trading Post",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-backcountry-experience-website-contact",
      "company": "Backcountry Experience",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-la-cordee-website-contact",
      "company": "La Cordee",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-latulippe-website-contact",
      "company": "Latulippe",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-neptune-mountaineering-website-contact",
      "company": "Neptune Mountaineering",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-ute-mountaineer-website-contact",
      "company": "Ute Mountaineer",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-arizona-hiking-shack-website-contact",
      "company": "Arizona Hiking Shack",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-bentgate-mountaineering-website-contact",
      "company": "Bentgate Mountaineering",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-the-great-outdoor-shop-website-contact",
      "company": "The Great Outdoor Shop",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-avidmax-outfitters-website-contact",
      "company": "AvidMax Outfitters",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-tentworld-website-contact",
      "company": "Tentworld",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-bivouac-outdoor-website-contact",
      "company": "Bivouac Outdoor",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-wildfire-sports-website-contact",
      "company": "Wildfire Sports",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-further-faster-website-contact",
      "company": "Further Faster",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-transa-website-contact",
      "company": "Transa",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAA1NRi4BZrVo6HVn1uzSz_B9rdkK08jc3CI",
      "company": "Oase Outdoors",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAPvtrsBrAgphdMQ7geH0RGqpujdAOUK9-w",
      "company": "Osprey Packs",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAABdGTjsBJP9FWBaEcZQn_z5p4AqEc4hjXUk",
      "company": "Tillys",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAACD1vmIB1dp3mpdxmMt3q9EaOMYQj8BU0EU",
      "company": "Revelyst",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAEYobwBd9xkehRHiy7cLvy95de0MLpkFdg",
      "company": "Absolute Outdoor of America",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAFNe1YB0CzJLtKXBb2qz8-G5sf8mAbAbCQ",
      "company": "Alliant Insurance Services",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAABC48xQBV3vhLnbmzQCp2Qh_MFyVIsSM5hM",
      "company": "Allied Outdoor Solutions",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAACsC4vgBZZxF9dThF38MLzlaUE9JyEb0xP0",
      "company": "Alpha Power Group",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAf5L9IBuQ7KlOnAEMs4u6kBme4zfgUcv9M",
      "company": "Amazon",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAL26X0BoI8K5Eb8a-LVdqDbvq3BhVrvhpE",
      "company": "American Conservation Experience",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAATg-4EBRMFVfbcQRWaMTxuVC1IYpVUh0bg",
      "company": "Angel City Sports",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAA1_hhMBppIhcctaqpnWnJ4tps8U0D77O_c",
      "company": "Arkansas Department of Parks Heritage and Tourism",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAFKeiQBabAKeqEJvCQqS1QjliT-DwU8_GA",
      "company": "Artisan Outdoor Craftsman",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAB1PH5wB-kcuCbKedWZj6GKFmc_g5oN-CXc",
      "company": "artnaturals",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAADcwwsBwIb28iFAwYswskabOhopJyDJsyM",
      "company": "Authentic Brands Group",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAABSq0fABWem1u6CILjjPaHm6W3OLFp_YrI4",
      "company": "Basecamp",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAFtc7EBVeBSmyp8ZCBecl_apCebWRdXyqA",
      "company": "BGA Outdoor Enterprises",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAASwoTYBN7fU5E5VAb25ddqvgiJor6bIZSM",
      "company": "Big Outdoor",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAGdYv4BopIn1OTfDIoQ6mssLlppRB5rwGI",
      "company": "Born Outdoor",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAABtMysBgfMQWuud0bygfWl0Z3Qf5cmdrO4",
      "company": "Bull Outdoor Products",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAACslCD4BbAf9W9wRSSYuEWrElxVi5Arkx8g",
      "company": "Capitol Outdoor",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAC3fhoBZFqQifgW7OVhCCvf-jaD2zSClc8",
      "company": "Clear Channel Outdoor",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAARUPecBmWOeli1pU5ZULwww4jZM5gs3o5M",
      "company": "Dicks Sporting Goods",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAACnzWoBEl-Ubj1JomAEEG3HwxvQSfNnSFc",
      "company": "Duck Camp",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAABOt0QBKF4FoSAolijxg30FmdiKQCtqDag",
      "company": "Electric Outdoors",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAABBE14wBaof_xoZBOidvUYlL68MM736ulY0",
      "company": "Ewing Outdoor Supply",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAB-ahoQB5nEiuFDnhkgFmNZqrZCpmiyaccY",
      "company": "Experian",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAF7VdABmekROCyq4v_sHVsulMqYJv0kptk",
      "company": "Forward Outdoor Apparel Company",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAXD3a4BOOzmHlvdQpsqafTvhFITUauz7Uk",
      "company": "Founded Outdoors",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAACC0bS4BsggLCK6qLX6Luc8a3EP2LlVvHbY",
      "company": "Garmin Italy",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAABr9dMB5Ze-GNXwP3pOz4D9tDDafChlMCY",
      "company": "Gathr Outdoors",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAA28OYBWIhtdIPt4Do46u8OqJUSG7tSxyc",
      "company": "Great Outdoor Provision Company",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAC7KRVwBr-kAAqaawjQ4qfohvRHHxQzjII8",
      "company": "Happen Services",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAKiXboBorgL-k2Bgb1zeKShwLx0X3S1mu0",
      "company": "Harbour Outdoor",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAACEQJsBKyYeFir8IXcOiD0qygfrc6C5Ya0",
      "company": "Highline Outdoor Group",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAEOwmkBwARwMB7g_Wm-U9uqa5ibh-RcfYs",
      "company": "Hyperlite Mountain Gear",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAeR8RQBbMH6y42YyJ7DCVkdlk4287yhptU",
      "company": "Industrial Outdoor Ventures",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAEkyVUBOb8zRjEpTdBoLnb_52WuB8WtZVY",
      "company": "Jensen Outdoor",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAABnAm6YBY19fq27qm8b26DY9JXXe48hRYQY",
      "company": "KAILAS",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAABREDTYBkNPIzvoiMcu_srgYWHHiR9umLB0",
      "company": "Kennedy Outdoor Advertising",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAADJFwABxC81LhVs-qz870ghs-LABOr5mRg",
      "company": "KILLARA",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAABaljzABzILXLXMO6xHCSeClVK5nmVs89uI",
      "company": "MADE Outdoor",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAG04ZYBDquVNY_DYHxFmm50TFsnRUsDLLw",
      "company": "Michigan Economic Development Corporation",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAlt5ngBb1iYHQV5y9asy4XF_LyVKUUph2k",
      "company": "Microsoft",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAhZyUQBNg5Uqhf55Y6QypshLaZtAplMo04",
      "company": "Mountain Hardwear",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "google-customer-next-adventure-instagram",
      "company": "Next Adventure",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-summit-international-website-contact",
      "company": "Summit International",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-aqipa-website-contact",
      "company": "Aqipa",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-obelink-website-contact",
      "company": "Obelink",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-globetrotter-website-contact",
      "company": "Globetrotter",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-au-vieux-campeur-website-contact",
      "company": "Au Vieux Campeur",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-bergfreunde-website-contact",
      "company": "Bergfreunde",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-fritz-berger-website-contact",
      "company": "Fritz Berger",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-bergzeit-website-contact",
      "company": "Bergzeit",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-camping-wagner-website-contact",
      "company": "Camping Wagner",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-fjellsport-website-contact",
      "company": "Fjellsport",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-naturkompaniet-website-contact",
      "company": "Naturkompaniet",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-outnorth-website-contact",
      "company": "Outnorth",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-trekitt-website-contact",
      "company": "Trekitt",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-ultralight-outdoor-gear-website-contact",
      "company": "Ultralight Outdoor Gear",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-alpinetrek-website-contact",
      "company": "Alpinetrek",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-barrabes-website-contact",
      "company": "Barrabes",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-de-wit-schijndel-website-contact",
      "company": "De Wit Schijndel",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-ekosport-website-contact",
      "company": "Ekosport",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-scandinavian-outdoor-website-contact",
      "company": "Scandinavian Outdoor",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-snowleader-website-contact",
      "company": "Snowleader",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-friluftsland-website-contact",
      "company": "Friluftsland",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-outdoorxl-website-contact",
      "company": "OutdoorXL",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-spejder-sport-website-contact",
      "company": "Spejder Sport",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-taunton-leisure-website-contact",
      "company": "Taunton Leisure",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-hardloop-website-contact",
      "company": "Hardloop",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-kampeerwereld-hendriks-website-contact",
      "company": "Kampeerwereld Hendriks",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-sportpursuit-website-contact",
      "company": "SportPursuit",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-varuste-website-contact",
      "company": "Varuste",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-valhalla-pure-outfitters-website-contact",
      "company": "Valhalla Pure Outfitters",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-kittery-trading-post-website-contact",
      "company": "Kittery Trading Post",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-backcountry-experience-website-contact",
      "company": "Backcountry Experience",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-la-cordee-website-contact",
      "company": "La Cordee",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-latulippe-website-contact",
      "company": "Latulippe",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-neptune-mountaineering-website-contact",
      "company": "Neptune Mountaineering",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-ute-mountaineer-website-contact",
      "company": "Ute Mountaineer",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-arizona-hiking-shack-website-contact",
      "company": "Arizona Hiking Shack",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-bentgate-mountaineering-website-contact",
      "company": "Bentgate Mountaineering",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-the-great-outdoor-shop-website-contact",
      "company": "The Great Outdoor Shop",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-avidmax-outfitters-website-contact",
      "company": "AvidMax Outfitters",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-tentworld-website-contact",
      "company": "Tentworld",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-bivouac-outdoor-website-contact",
      "company": "Bivouac Outdoor",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-wildfire-sports-website-contact",
      "company": "Wildfire Sports",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-further-faster-website-contact",
      "company": "Further Faster",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-transa-website-contact",
      "company": "Transa",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAA1NRi4BZrVo6HVn1uzSz_B9rdkK08jc3CI",
      "company": "Oase Outdoors",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAPvtrsBrAgphdMQ7geH0RGqpujdAOUK9-w",
      "company": "Osprey Packs",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAABdGTjsBJP9FWBaEcZQn_z5p4AqEc4hjXUk",
      "company": "Tillys",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAACD1vmIB1dp3mpdxmMt3q9EaOMYQj8BU0EU",
      "company": "Revelyst",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAEYobwBd9xkehRHiy7cLvy95de0MLpkFdg",
      "company": "Absolute Outdoor of America",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAFNe1YB0CzJLtKXBb2qz8-G5sf8mAbAbCQ",
      "company": "Alliant Insurance Services",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAABC48xQBV3vhLnbmzQCp2Qh_MFyVIsSM5hM",
      "company": "Allied Outdoor Solutions",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAACsC4vgBZZxF9dThF38MLzlaUE9JyEb0xP0",
      "company": "Alpha Power Group",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAf5L9IBuQ7KlOnAEMs4u6kBme4zfgUcv9M",
      "company": "Amazon",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAL26X0BoI8K5Eb8a-LVdqDbvq3BhVrvhpE",
      "company": "American Conservation Experience",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAATg-4EBRMFVfbcQRWaMTxuVC1IYpVUh0bg",
      "company": "Angel City Sports",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAA1_hhMBppIhcctaqpnWnJ4tps8U0D77O_c",
      "company": "Arkansas Department of Parks Heritage and Tourism",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAFKeiQBabAKeqEJvCQqS1QjliT-DwU8_GA",
      "company": "Artisan Outdoor Craftsman",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAB1PH5wB-kcuCbKedWZj6GKFmc_g5oN-CXc",
      "company": "artnaturals",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAADcwwsBwIb28iFAwYswskabOhopJyDJsyM",
      "company": "Authentic Brands Group",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAABSq0fABWem1u6CILjjPaHm6W3OLFp_YrI4",
      "company": "Basecamp",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAFtc7EBVeBSmyp8ZCBecl_apCebWRdXyqA",
      "company": "BGA Outdoor Enterprises",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAASwoTYBN7fU5E5VAb25ddqvgiJor6bIZSM",
      "company": "Big Outdoor",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAGdYv4BopIn1OTfDIoQ6mssLlppRB5rwGI",
      "company": "Born Outdoor",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAABtMysBgfMQWuud0bygfWl0Z3Qf5cmdrO4",
      "company": "Bull Outdoor Products",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAACslCD4BbAf9W9wRSSYuEWrElxVi5Arkx8g",
      "company": "Capitol Outdoor",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAC3fhoBZFqQifgW7OVhCCvf-jaD2zSClc8",
      "company": "Clear Channel Outdoor",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAARUPecBmWOeli1pU5ZULwww4jZM5gs3o5M",
      "company": "Dicks Sporting Goods",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAACnzWoBEl-Ubj1JomAEEG3HwxvQSfNnSFc",
      "company": "Duck Camp",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAABOt0QBKF4FoSAolijxg30FmdiKQCtqDag",
      "company": "Electric Outdoors",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAABBE14wBaof_xoZBOidvUYlL68MM736ulY0",
      "company": "Ewing Outdoor Supply",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAB-ahoQB5nEiuFDnhkgFmNZqrZCpmiyaccY",
      "company": "Experian",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAF7VdABmekROCyq4v_sHVsulMqYJv0kptk",
      "company": "Forward Outdoor Apparel Company",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAXD3a4BOOzmHlvdQpsqafTvhFITUauz7Uk",
      "company": "Founded Outdoors",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAACC0bS4BsggLCK6qLX6Luc8a3EP2LlVvHbY",
      "company": "Garmin Italy",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAABr9dMB5Ze-GNXwP3pOz4D9tDDafChlMCY",
      "company": "Gathr Outdoors",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAA28OYBWIhtdIPt4Do46u8OqJUSG7tSxyc",
      "company": "Great Outdoor Provision Company",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAC7KRVwBr-kAAqaawjQ4qfohvRHHxQzjII8",
      "company": "Happen Services",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAKiXboBorgL-k2Bgb1zeKShwLx0X3S1mu0",
      "company": "Harbour Outdoor",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAACEQJsBKyYeFir8IXcOiD0qygfrc6C5Ya0",
      "company": "Highline Outdoor Group",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAEOwmkBwARwMB7g_Wm-U9uqa5ibh-RcfYs",
      "company": "Hyperlite Mountain Gear",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAeR8RQBbMH6y42YyJ7DCVkdlk4287yhptU",
      "company": "Industrial Outdoor Ventures",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAEkyVUBOb8zRjEpTdBoLnb_52WuB8WtZVY",
      "company": "Jensen Outdoor",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAABnAm6YBY19fq27qm8b26DY9JXXe48hRYQY",
      "company": "KAILAS",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAABREDTYBkNPIzvoiMcu_srgYWHHiR9umLB0",
      "company": "Kennedy Outdoor Advertising",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAADJFwABxC81LhVs-qz870ghs-LABOr5mRg",
      "company": "KILLARA",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAABaljzABzILXLXMO6xHCSeClVK5nmVs89uI",
      "company": "MADE Outdoor",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAG04ZYBDquVNY_DYHxFmm50TFsnRUsDLLw",
      "company": "Michigan Economic Development Corporation",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAlt5ngBb1iYHQV5y9asy4XF_LyVKUUph2k",
      "company": "Microsoft",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAhZyUQBNg5Uqhf55Y6QypshLaZtAplMo04",
      "company": "Mountain Hardwear",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAEoswIBbxjFqoXzthYIPbDiNXX3oKEpG1g",
      "company": "New Balance",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAABZRZkBTTm-SXQY0YvjD3Ig1cbVzY2EHbo",
      "company": "Oaktree Outdoor Advertising",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAAAyWacBF7d2RB3sRfpqqFzbhvxeCRRi5rw",
      "company": "Outdoor Afro",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAADUTbkB8LekBz7hI8RD3dBNQEs9x_8NjBI",
      "company": "Outdoor Collective",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAACPDypgBobenWW4cVrPZWOcMo9yq3ReXrfw",
      "company": "Outdoor Fire and Patio",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "https://www.linkedin.com/in/ACoAAFARRT4B2_27xyykdjyiytSYmeSv9uanUpY",
      "company": "Outdoor Industry Jobs",
      "action": "verify_target",
      "reason": "linkedin_channel_requires_supported_executor"
    },
    {
      "id": "google-customer-esprinet-group-website-contact",
      "company": "Esprinet Group",
      "action": "email_priority",
      "reason": "same_day_customer_already_developed"
    }
  ],
  "summary": {
    "totalLeads": 16,
    "highIcp": 16,
    "readyToDevelop": 6,
    "dueNow": 100,
    "visibleTodayQueue": 39,
    "potentialPool": 100,
    "potentialPoolTarget": 100,
    "customerTableHighIcp": 51,
    "refillNeeded": 0,
    "googleDiscovered": 55,
    "facebookDiscovered": 1,
    "websiteContactDiscovered": 49,
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
      "reason": "linkedin_channel_requires_supported_executor",
      "status": "skipped",
      "count": 96
    },
    {
      "reason": "marketing_attachment_missing",
      "status": "skipped",
      "count": 90
    },
    {
      "reason": "send_unconfirmed",
      "status": "send_unconfirmed",
      "count": 3
    },
    {
      "reason": "concrete_google_discovered_major_customer_instagram",
      "status": "skipped",
      "count": 2
    },
    {
      "reason": "failed_open",
      "status": "failed_open",
      "count": 2
    },
    {
      "reason": "same_day_customer_already_developed",
      "status": "skipped",
      "count": 1
    }
  ],
  "blockerCounts": {
    "linkedin_channel_requires_supported_executor": 96,
    "marketing_attachment_missing": 90,
    "send_unconfirmed": 3,
    "concrete_google_discovered_major_customer_instagram": 2,
    "failed_open": 2,
    "same_day_customer_already_developed": 1
  },
  "userVisibleStatus": "Customer development was not performed. Blockers: linkedin_channel_requires_supported_executor (96); marketing_attachment_missing (90); send_unconfirmed (3).",
  "recoveryHint": "Configure WEBSITE_MARKETING_FILE or MARKETING_ATTACHMENT_PATH with an approved marketing attachment before rerunning website-contact outreach.",
  "recoveryActions": [
    {
      "reason": "marketing_attachment_missing",
      "action": "Add approved website outreach attachment",
      "description": "Set WEBSITE_MARKETING_FILE or MARKETING_ATTACHMENT_PATH before rerunning website-contact outreach.",
      "hint": "Configure WEBSITE_MARKETING_FILE or MARKETING_ATTACHMENT_PATH with an approved marketing attachment before rerunning website-contact outreach."
    }
  ],
  "systemRefresh": {
    "ok": true,
    "stdout": "{\n  \"date\": \"2026-07-14\",\n  \"summary\": {\n    \"totalLeads\": 16,\n    \"highIcp\": 16,\n    \"readyToDevelop\": 5,\n    \"dueNow\": 73,\n    \"visibleTodayQueue\": 38,\n    \"potentialPool\": 68,\n    \"potentialPoolTarget\": 100,\n    \"customerTableHighIcp\": 20,\n    \"refillNeeded\": 32,\n    \"googleDiscovered\": 53,\n    \"facebookDiscovered\": 1,\n    \"websiteContactDiscovered\": 48,\n    \"scheduledLater\": 0,\n    \"cooldown\": 30,\n    \"emailPriority\": 0,\n    \"openAgencyMarket\": 15,\n    \"exclusiveAgencySkipped\": 1,\n    \"needsVerification\": 0,\n    \"retainedLowIcp\": 0\n  },\n  \"bugErrors\": 0,\n  \"queueFile\": \"E:\\\\New project\\\\outreach-dashboard\\\\daily-runs\\\\2026-07-14-daily-automation.json\",\n  \"csvFile\": \"E:\\\\New project\\\\outreach-dashboard\\\\daily-runs\\\\2026-07-14-daily-queue.csv\"\n}",
    "stderr": "",
    "error": "",
    "visibility": {
      "updatedAt": "2026-07-14T06:25:24.587Z",
      "source": "main-refreshDailyAutomationArtifacts",
      "runDate": "2026-07-14",
      "artifactGeneratedAt": "2026-07-14T06:25:23.604Z",
      "executionGeneratedAt": "2026-07-14T06:19:47.174Z",
      "githubSyncUpdatedAt": "2026-07-14T05:33:39.965Z",
      "counts": {
        "dailyQueue": 73,
        "googleDiscovered": 53,
        "websiteContact": 48,
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
  "completedAt": "2026-07-14T06:25:25.664Z"
};
