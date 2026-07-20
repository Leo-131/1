window.DAILY_AUTOMATION_EXECUTION_LATEST = {
  "ok": true,
  "executionPhase": "browser_execution",
  "chromeStage": "opened",
  "chromeOpened": true,
  "chromeOpenedCount": 4,
  "customerDevelopmentPerformed": true,
  "customerMessageSent": false,
  "realDevelopmentCount": 1,
  "reportingVerdict": "development_performed",
  "engine": "Codex Chrome Extension queue bridge",
  "mode": "serial-single-target",
  "batchMode": "parallel-batches",
  "parallelLimit": 1,
  "limit": 4,
  "queueDate": "2026-07-20",
  "queueSource": "dailyQueue",
  "executed": [
    {
      "id": "google-customer-rock-creek-instagram",
      "company": "Rock/Creek",
      "action": "develop",
      "platform": "instagram",
      "targetUrl": "https://www.instagram.com/rockcreek/",
      "ok": true,
      "sendStatus": "account_followed",
      "evidence": "instagram_engagement_completed_message_unavailable;instagram_message_button_clicked_composer_not_found;follow_already_active;instagram_post_opened;post_liked;comment_submitted",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/rockcreek/",
        "tabId": "536C476D4A1DDFDAFCE0E15982F30210",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/536C476D4A1DDFDAFCE0E15982F30210",
        "title": ""
      },
      "result": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_extension_only",
        "targetUrl": "https://www.instagram.com/rockcreek/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/rockcreek/",
          "tabId": "536C476D4A1DDFDAFCE0E15982F30210",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/536C476D4A1DDFDAFCE0E15982F30210",
          "title": ""
        },
        "sendStatus": "account_followed",
        "output": "{\"verdict\":\"safe_gate_paused\",\"evidence\":\"instagram_engagement_completed_message_unavailable;instagram_message_button_clicked_composer_not_found;follow_already_active;instagram_post_opened;post_liked;comment_submitted\",\"nextAction\":\"The verified account was engaged successfully. Monitor for a connection opportunity and avoid repeating the same action.\",\"draft\":\"Hi Rock/Creek team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"account_followed\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 84,
          "reason": "local_codex_extension_template",
          "draft": "Hi Rock/Creek team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Codex Chrome Extension only",
        "glmModel": "not_used",
        "followup": false
      }
    },
    {
      "id": "google-customer-sklep-podroznika-instagram",
      "company": "Sklep Podroznika",
      "action": "develop",
      "platform": "instagram",
      "targetUrl": "https://www.instagram.com/skleppodroznika/",
      "ok": false,
      "sendStatus": "approval_pending",
      "evidence": "driver_error: Command failed: C:\\Program Files\\nodejs\\node.exe E:\\New project\\outreach-dashboard\\codex-chrome-driver.js prepare-instagram-draft {\"port\":9224,\"tabId\":\"E317BC4867854DFE1C14A3914A8D61C6\",\"targetUrl\":\"https://www.instagram.com/skleppodroznika/\",\"expectedCompany\":\"Sklep Podroznika\",\"draft\":\"Hi Sklep Podroznika team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"autoSend\":true,\"autoEngage\":true,\"engagementComment\":\"Great outdoor checklist. Useful reminder for hikers preparing a complete, lightweight kit.\",\"replaceExistingDraft\":true}\n",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/skleppodroznika/",
        "tabId": "E317BC4867854DFE1C14A3914A8D61C6",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/E317BC4867854DFE1C14A3914A8D61C6",
        "title": ""
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_extension_only",
        "targetUrl": "https://www.instagram.com/skleppodroznika/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/skleppodroznika/",
          "tabId": "E317BC4867854DFE1C14A3914A8D61C6",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/E317BC4867854DFE1C14A3914A8D61C6",
          "title": ""
        },
        "sendStatus": "approval_pending",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"driver_error: Command failed: C:\\\\Program Files\\\\nodejs\\\\node.exe E:\\\\New project\\\\outreach-dashboard\\\\codex-chrome-driver.js prepare-instagram-draft {\\\"port\\\":9224,\\\"tabId\\\":\\\"E317BC4867854DFE1C14A3914A8D61C6\\\",\\\"targetUrl\\\":\\\"https://www.instagram.com/skleppodroznika/\\\",\\\"expectedCompany\\\":\\\"Sklep Podroznika\\\",\\\"draft\\\":\\\"Hi Sklep Podroznika team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\\\",\\\"autoSend\\\":true,\\\"autoEngage\\\":true,\\\"engagementComment\\\":\\\"Great outdoor checklist. Useful reminder for hikers preparing a complete, lightweight kit.\\\",\\\"replaceExistingDraft\\\":true}\\n\",\"nextAction\":\"Major Codex Chrome driver failure; pause and notify operator before retry.\",\"draft\":\"Hi Sklep Podroznika team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"approval_pending\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 84,
          "reason": "local_codex_extension_template",
          "draft": "Hi Sklep Podroznika team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Codex Chrome Extension only",
        "glmModel": "not_used",
        "followup": false
      }
    },
    {
      "id": "google-customer-sport-conrad-instagram",
      "company": "Sport Conrad",
      "action": "develop",
      "platform": "instagram",
      "targetUrl": "https://www.instagram.com/sportconrad/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "instagram_message_button_clicked_composer_not_found",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/sportconrad/",
        "tabId": "DDB0078A6EE574327C3613B7E6EF33F8",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/DDB0078A6EE574327C3613B7E6EF33F8",
        "title": "Sport Conrad (@sportconrad) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_extension_only",
        "targetUrl": "https://www.instagram.com/sportconrad/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/sportconrad/",
          "tabId": "DDB0078A6EE574327C3613B7E6EF33F8",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/DDB0078A6EE574327C3613B7E6EF33F8",
          "title": "Sport Conrad (@sportconrad) · Instagram 照片和视频"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"instagram_message_button_clicked_composer_not_found\",\"nextAction\":\"Composer not detected; pause automation and notify operator only if retry would be unsafe.\",\"draft\":\"Hi Sport Conrad team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 84,
          "reason": "local_codex_extension_template",
          "draft": "Hi Sport Conrad team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
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
      "sendStatus": "approval_pending",
      "evidence": "driver_error: Command failed: C:\\Program Files\\nodejs\\node.exe E:\\New project\\outreach-dashboard\\codex-chrome-driver.js prepare-instagram-draft {\"port\":9224,\"tabId\":\"2C348FC792799224F93C484B7FC82BE0\",\"targetUrl\":\"https://www.instagram.com/sportler_com/\",\"expectedCompany\":\"Sportler\",\"draft\":\"Hi Sportler team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"autoSend\":true,\"autoEngage\":true,\"engagementComment\":\"Great outdoor checklist. Useful reminder for hikers preparing a complete, lightweight kit.\",\"replaceExistingDraft\":true}\n",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/sportler_com/",
        "tabId": "2C348FC792799224F93C484B7FC82BE0",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/2C348FC792799224F93C484B7FC82BE0",
        "title": "SPORTLER (@sportler_com) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_extension_only",
        "targetUrl": "https://www.instagram.com/sportler_com/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/sportler_com/",
          "tabId": "2C348FC792799224F93C484B7FC82BE0",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/2C348FC792799224F93C484B7FC82BE0",
          "title": "SPORTLER (@sportler_com) · Instagram 照片和视频"
        },
        "sendStatus": "approval_pending",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"driver_error: Command failed: C:\\\\Program Files\\\\nodejs\\\\node.exe E:\\\\New project\\\\outreach-dashboard\\\\codex-chrome-driver.js prepare-instagram-draft {\\\"port\\\":9224,\\\"tabId\\\":\\\"2C348FC792799224F93C484B7FC82BE0\\\",\\\"targetUrl\\\":\\\"https://www.instagram.com/sportler_com/\\\",\\\"expectedCompany\\\":\\\"Sportler\\\",\\\"draft\\\":\\\"Hi Sportler team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\\\",\\\"autoSend\\\":true,\\\"autoEngage\\\":true,\\\"engagementComment\\\":\\\"Great outdoor checklist. Useful reminder for hikers preparing a complete, lightweight kit.\\\",\\\"replaceExistingDraft\\\":true}\\n\",\"nextAction\":\"Major Codex Chrome driver failure; pause and notify operator before retry.\",\"draft\":\"Hi Sportler team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"approval_pending\"}",
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
      "id": "google-customer-rock-creek-instagram",
      "company": "Rock/Creek",
      "action": "develop",
      "platform": "instagram",
      "targetUrl": "https://www.instagram.com/rockcreek/",
      "ok": true,
      "sendStatus": "account_followed",
      "evidence": "instagram_engagement_completed_message_unavailable;instagram_message_button_clicked_composer_not_found;follow_already_active;instagram_post_opened;post_liked;comment_submitted",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/rockcreek/",
        "tabId": "536C476D4A1DDFDAFCE0E15982F30210",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/536C476D4A1DDFDAFCE0E15982F30210",
        "title": ""
      },
      "result": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_extension_only",
        "targetUrl": "https://www.instagram.com/rockcreek/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/rockcreek/",
          "tabId": "536C476D4A1DDFDAFCE0E15982F30210",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/536C476D4A1DDFDAFCE0E15982F30210",
          "title": ""
        },
        "sendStatus": "account_followed",
        "output": "{\"verdict\":\"safe_gate_paused\",\"evidence\":\"instagram_engagement_completed_message_unavailable;instagram_message_button_clicked_composer_not_found;follow_already_active;instagram_post_opened;post_liked;comment_submitted\",\"nextAction\":\"The verified account was engaged successfully. Monitor for a connection opportunity and avoid repeating the same action.\",\"draft\":\"Hi Rock/Creek team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"account_followed\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 84,
          "reason": "local_codex_extension_template",
          "draft": "Hi Rock/Creek team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Codex Chrome Extension only",
        "glmModel": "not_used",
        "followup": false
      }
    },
    {
      "id": "google-customer-sklep-podroznika-instagram",
      "company": "Sklep Podroznika",
      "action": "develop",
      "platform": "instagram",
      "targetUrl": "https://www.instagram.com/skleppodroznika/",
      "ok": false,
      "sendStatus": "approval_pending",
      "evidence": "driver_error: Command failed: C:\\Program Files\\nodejs\\node.exe E:\\New project\\outreach-dashboard\\codex-chrome-driver.js prepare-instagram-draft {\"port\":9224,\"tabId\":\"E317BC4867854DFE1C14A3914A8D61C6\",\"targetUrl\":\"https://www.instagram.com/skleppodroznika/\",\"expectedCompany\":\"Sklep Podroznika\",\"draft\":\"Hi Sklep Podroznika team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"autoSend\":true,\"autoEngage\":true,\"engagementComment\":\"Great outdoor checklist. Useful reminder for hikers preparing a complete, lightweight kit.\",\"replaceExistingDraft\":true}\n",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/skleppodroznika/",
        "tabId": "E317BC4867854DFE1C14A3914A8D61C6",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/E317BC4867854DFE1C14A3914A8D61C6",
        "title": ""
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_extension_only",
        "targetUrl": "https://www.instagram.com/skleppodroznika/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/skleppodroznika/",
          "tabId": "E317BC4867854DFE1C14A3914A8D61C6",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/E317BC4867854DFE1C14A3914A8D61C6",
          "title": ""
        },
        "sendStatus": "approval_pending",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"driver_error: Command failed: C:\\\\Program Files\\\\nodejs\\\\node.exe E:\\\\New project\\\\outreach-dashboard\\\\codex-chrome-driver.js prepare-instagram-draft {\\\"port\\\":9224,\\\"tabId\\\":\\\"E317BC4867854DFE1C14A3914A8D61C6\\\",\\\"targetUrl\\\":\\\"https://www.instagram.com/skleppodroznika/\\\",\\\"expectedCompany\\\":\\\"Sklep Podroznika\\\",\\\"draft\\\":\\\"Hi Sklep Podroznika team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\\\",\\\"autoSend\\\":true,\\\"autoEngage\\\":true,\\\"engagementComment\\\":\\\"Great outdoor checklist. Useful reminder for hikers preparing a complete, lightweight kit.\\\",\\\"replaceExistingDraft\\\":true}\\n\",\"nextAction\":\"Major Codex Chrome driver failure; pause and notify operator before retry.\",\"draft\":\"Hi Sklep Podroznika team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"approval_pending\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 84,
          "reason": "local_codex_extension_template",
          "draft": "Hi Sklep Podroznika team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Codex Chrome Extension only",
        "glmModel": "not_used",
        "followup": false
      }
    },
    {
      "id": "google-customer-sport-conrad-instagram",
      "company": "Sport Conrad",
      "action": "develop",
      "platform": "instagram",
      "targetUrl": "https://www.instagram.com/sportconrad/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "instagram_message_button_clicked_composer_not_found",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/sportconrad/",
        "tabId": "DDB0078A6EE574327C3613B7E6EF33F8",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/DDB0078A6EE574327C3613B7E6EF33F8",
        "title": "Sport Conrad (@sportconrad) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_extension_only",
        "targetUrl": "https://www.instagram.com/sportconrad/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/sportconrad/",
          "tabId": "DDB0078A6EE574327C3613B7E6EF33F8",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/DDB0078A6EE574327C3613B7E6EF33F8",
          "title": "Sport Conrad (@sportconrad) · Instagram 照片和视频"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"instagram_message_button_clicked_composer_not_found\",\"nextAction\":\"Composer not detected; pause automation and notify operator only if retry would be unsafe.\",\"draft\":\"Hi Sport Conrad team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 84,
          "reason": "local_codex_extension_template",
          "draft": "Hi Sport Conrad team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
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
      "sendStatus": "approval_pending",
      "evidence": "driver_error: Command failed: C:\\Program Files\\nodejs\\node.exe E:\\New project\\outreach-dashboard\\codex-chrome-driver.js prepare-instagram-draft {\"port\":9224,\"tabId\":\"2C348FC792799224F93C484B7FC82BE0\",\"targetUrl\":\"https://www.instagram.com/sportler_com/\",\"expectedCompany\":\"Sportler\",\"draft\":\"Hi Sportler team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"autoSend\":true,\"autoEngage\":true,\"engagementComment\":\"Great outdoor checklist. Useful reminder for hikers preparing a complete, lightweight kit.\",\"replaceExistingDraft\":true}\n",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/sportler_com/",
        "tabId": "2C348FC792799224F93C484B7FC82BE0",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/2C348FC792799224F93C484B7FC82BE0",
        "title": "SPORTLER (@sportler_com) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "codex_chrome_extension_only",
        "targetUrl": "https://www.instagram.com/sportler_com/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/sportler_com/",
          "tabId": "2C348FC792799224F93C484B7FC82BE0",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/2C348FC792799224F93C484B7FC82BE0",
          "title": "SPORTLER (@sportler_com) · Instagram 照片和视频"
        },
        "sendStatus": "approval_pending",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"driver_error: Command failed: C:\\\\Program Files\\\\nodejs\\\\node.exe E:\\\\New project\\\\outreach-dashboard\\\\codex-chrome-driver.js prepare-instagram-draft {\\\"port\\\":9224,\\\"tabId\\\":\\\"2C348FC792799224F93C484B7FC82BE0\\\",\\\"targetUrl\\\":\\\"https://www.instagram.com/sportler_com/\\\",\\\"expectedCompany\\\":\\\"Sportler\\\",\\\"draft\\\":\\\"Hi Sportler team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\\\",\\\"autoSend\\\":true,\\\"autoEngage\\\":true,\\\"engagementComment\\\":\\\"Great outdoor checklist. Useful reminder for hikers preparing a complete, lightweight kit.\\\",\\\"replaceExistingDraft\\\":true}\\n\",\"nextAction\":\"Major Codex Chrome driver failure; pause and notify operator before retry.\",\"draft\":\"Hi Sportler team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"approval_pending\"}",
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
      "id": "google-customer-sport-conrad-facebook",
      "company": "Sport Conrad",
      "action": "develop",
      "reason": "completed_in_execution_checkpoint"
    },
    {
      "id": "google-customer-wild-earth-facebook",
      "company": "Wild Earth",
      "action": "develop",
      "reason": "completed_in_execution_checkpoint"
    },
    {
      "id": "google-customer-atmosphere-instagram",
      "company": "Atmosphere",
      "action": "develop",
      "reason": "completed_in_execution_checkpoint"
    },
    {
      "id": "google-customer-campz-instagram",
      "company": "Campz",
      "action": "develop",
      "reason": "completed_in_execution_checkpoint"
    },
    {
      "id": "google-customer-doorout-instagram",
      "company": "Doorout",
      "action": "develop",
      "reason": "completed_in_execution_checkpoint"
    },
    {
      "id": "google-customer-facewest-instagram",
      "company": "Facewest",
      "action": "develop",
      "reason": "completed_in_execution_checkpoint"
    },
    {
      "id": "google-customer-half-moon-outfitters-instagram",
      "company": "Half-Moon Outfitters",
      "action": "develop",
      "reason": "completed_in_execution_checkpoint"
    },
    {
      "id": "google-customer-jax-outdoor-gear-instagram",
      "company": "Jax Outdoor Gear",
      "action": "develop",
      "reason": "completed_in_execution_checkpoint"
    },
    {
      "id": "google-customer-wild-earth-instagram",
      "company": "Wild Earth",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-above-and-beyond-facebook",
      "company": "Above and Beyond",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-addnature-facebook",
      "company": "Addnature",
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
      "id": "google-customer-intersport-norway-facebook",
      "company": "Intersport Norway",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-sportler-facebook",
      "company": "Sportler",
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
      "id": "google-customer-half-moon-outfitters-facebook",
      "company": "Half-Moon Outfitters",
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
      "id": "google-customer-addnature-instagram",
      "company": "Addnature",
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
      "id": "google-customer-tiso-instagram",
      "company": "Tiso",
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
      "id": "google-customer-the-mountaineer-instagram",
      "company": "The Mountaineer",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": 23,
      "company": "Ace Hardware",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 7,
      "company": "AutoZone",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 10,
      "company": "Backcountry.com",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 20,
      "company": "Harbor Freight",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 6,
      "company": "L.L.Bean",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 17,
      "company": "Target",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 22,
      "company": "Thor Industries",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 13,
      "company": "Walgreens",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 18,
      "company": "Winnebago",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 11,
      "company": "Best Buy",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 9,
      "company": "Canadian Tire",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 19,
      "company": "MEC (Mountain Equipment Co-op)",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 16,
      "company": "Airstream",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 5,
      "company": "Pacific Outdoor Group",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 14,
      "company": "Rural King",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 21,
      "company": "RVDA (RV Dealers Association)",
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
      "id": "google-customer-bivouac-outdoor-website-contact",
      "company": "Bivouac Outdoor",
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
      "id": "sheet_1779293110195_9myxa520z",
      "company": "ARROW TIRE DISTRIBUTORS",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "sheet_1779293110195_g43uimg3f",
      "company": "ARROW TIRE DISTRIBUTORS",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "sheet_1779293110195_u24j2gdmq",
      "company": "FAUNA OUTDOOR",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "sheet_1779293110195_vwshd681i",
      "company": "FAUNA OUTDOOR",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "sheet_1779293110195_g0uwgglwc",
      "company": "JOHN DOYLE DISTRIBUTORS",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "sheet_1779293110195_0f1r27koe",
      "company": "TAHOE SPORTS HUB",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "sheet_1779293110195_kcsohl3dy",
      "company": "TAHOE SPORTS HUB",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "sheet_1779293110195_4akfr27wz",
      "company": "TAHOE SPORTS HUB",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "google-customer-above-and-beyond-facebook",
      "company": "Above and Beyond",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-addnature-facebook",
      "company": "Addnature",
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
      "id": "google-customer-intersport-norway-facebook",
      "company": "Intersport Norway",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-sportler-facebook",
      "company": "Sportler",
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
      "id": "google-customer-half-moon-outfitters-facebook",
      "company": "Half-Moon Outfitters",
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
      "id": "google-customer-addnature-instagram",
      "company": "Addnature",
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
      "id": "google-customer-tiso-instagram",
      "company": "Tiso",
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
      "id": "google-customer-the-mountaineer-instagram",
      "company": "The Mountaineer",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-wild-earth-instagram",
      "company": "Wild Earth",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-kittery-trading-post-website-contact",
      "company": "Kittery Trading Post",
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
      "id": "google-customer-further-faster-website-contact",
      "company": "Further Faster",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 23,
      "company": "Ace Hardware",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 7,
      "company": "AutoZone",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 10,
      "company": "Backcountry.com",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 20,
      "company": "Harbor Freight",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 6,
      "company": "L.L.Bean",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 17,
      "company": "Target",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 22,
      "company": "Thor Industries",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 13,
      "company": "Walgreens",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 18,
      "company": "Winnebago",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 11,
      "company": "Best Buy",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 9,
      "company": "Canadian Tire",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 19,
      "company": "MEC (Mountain Equipment Co-op)",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 16,
      "company": "Airstream",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 5,
      "company": "Pacific Outdoor Group",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 14,
      "company": "Rural King",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": 21,
      "company": "RVDA (RV Dealers Association)",
      "action": "verify_target",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "sheet_1779293110195_9myxa520z",
      "company": "ARROW TIRE DISTRIBUTORS",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "sheet_1779293110195_g43uimg3f",
      "company": "ARROW TIRE DISTRIBUTORS",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "sheet_1779293110195_u24j2gdmq",
      "company": "FAUNA OUTDOOR",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "sheet_1779293110195_vwshd681i",
      "company": "FAUNA OUTDOOR",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "sheet_1779293110195_g0uwgglwc",
      "company": "JOHN DOYLE DISTRIBUTORS",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "sheet_1779293110195_0f1r27koe",
      "company": "TAHOE SPORTS HUB",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "sheet_1779293110195_kcsohl3dy",
      "company": "TAHOE SPORTS HUB",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    },
    {
      "id": "sheet_1779293110195_4akfr27wz",
      "company": "TAHOE SPORTS HUB",
      "action": "email_priority",
      "reason": "marketing_attachment_missing"
    }
  ],
  "summary": {
    "totalLeads": 16,
    "highIcp": 16,
    "readyToDevelop": 36,
    "dueNow": 63,
    "visibleTodayQueue": 17,
    "potentialPool": 63,
    "potentialPoolTarget": 100,
    "customerTableHighIcp": 24,
    "refillNeeded": 37,
    "googleDiscovered": 39,
    "facebookDiscovered": 18,
    "websiteContactDiscovered": 3,
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
      "reason": "marketing_attachment_missing",
      "status": "skipped",
      "count": 54
    },
    {
      "reason": "concrete_google_discovered_major_customer_facebook",
      "status": "skipped",
      "count": 32
    },
    {
      "reason": "concrete_google_discovered_major_customer_instagram",
      "status": "skipped",
      "count": 16
    },
    {
      "reason": "completed_in_execution_checkpoint",
      "status": "skipped",
      "count": 8
    },
    {
      "reason": "approval_pending",
      "status": "approval_pending",
      "count": 2
    },
    {
      "reason": "failed_open",
      "status": "failed_open",
      "count": 1
    }
  ],
  "blockerCounts": {
    "marketing_attachment_missing": 54,
    "concrete_google_discovered_major_customer_facebook": 32,
    "concrete_google_discovered_major_customer_instagram": 16,
    "completed_in_execution_checkpoint": 8,
    "approval_pending": 2,
    "failed_open": 1
  },
  "queueGoalStatus": {
    "target": 100,
    "potentialPool": 63,
    "queueCount": 63,
    "googleDiscovered": 39,
    "refillNeeded": 37,
    "reached": false,
    "action": "Add more verified high-ICP sources or unblock existing website/social leads."
  },
  "userVisibleStatus": "Customer development was not performed. Blockers: marketing_attachment_missing (54); concrete_google_discovered_major_customer_facebook (32); concrete_google_discovered_major_customer_instagram (16).",
  "recoveryHint": "Refill the high-ICP pool with 37 verified leads or unblock existing website/social leads before the next run. Configure WEBSITE_MARKETING_FILE or MARKETING_ATTACHMENT_PATH with an approved marketing attachment before rerunning website-contact outreach. Confirm the official social profile and safe message entry before rerunning Google-discovered social outreach. Verify the official profile opens and exposes a safe message composer, or switch to another verified channel.",
  "recoveryActions": [
    {
      "reason": "daily_queue_goal_not_reached",
      "action": "Refill high-ICP customer pool",
      "description": "Add or unblock 37 verified high-ICP leads to reach the daily 100 target.",
      "hint": "Refill the high-ICP pool with 37 verified leads or unblock existing website/social leads before the next run.",
      "target": 100,
      "potentialPool": 63,
      "refillNeeded": 37
    },
    {
      "reason": "marketing_attachment_missing",
      "action": "Add approved website outreach attachment",
      "description": "Set WEBSITE_MARKETING_FILE or MARKETING_ATTACHMENT_PATH before rerunning website-contact outreach.",
      "hint": "Configure WEBSITE_MARKETING_FILE or MARKETING_ATTACHMENT_PATH with an approved marketing attachment before rerunning website-contact outreach.",
      "requiredEnv": [
        "WEBSITE_MARKETING_FILE",
        "MARKETING_ATTACHMENT_PATH"
      ]
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
    "stdout": "{\n  \"date\": \"2026-07-20\",\n  \"summary\": {\n    \"totalLeads\": 16,\n    \"highIcp\": 16,\n    \"readyToDevelop\": 34,\n    \"dueNow\": 61,\n    \"visibleTodayQueue\": 17,\n    \"potentialPool\": 61,\n    \"potentialPoolTarget\": 100,\n    \"customerTableHighIcp\": 24,\n    \"refillNeeded\": 39,\n    \"googleDiscovered\": 37,\n    \"facebookDiscovered\": 17,\n    \"websiteContactDiscovered\": 3,\n    \"scheduledLater\": 0,\n    \"cooldown\": 30,\n    \"emailPriority\": 0,\n    \"openAgencyMarket\": 15,\n    \"exclusiveAgencySkipped\": 1,\n    \"needsVerification\": 0,\n    \"retainedLowIcp\": 0\n  },\n  \"bugErrors\": 0,\n  \"queueFile\": \"E:\\\\New project\\\\outreach-dashboard\\\\daily-runs\\\\2026-07-20-daily-automation.json\",\n  \"csvFile\": \"E:\\\\New project\\\\outreach-dashboard\\\\daily-runs\\\\2026-07-20-daily-queue.csv\"\n}",
    "stderr": "",
    "error": "",
    "visibility": {
      "updatedAt": "2026-07-20T05:04:24.763Z",
      "source": "main-refreshDailyAutomationArtifacts",
      "runDate": "2026-07-20",
      "artifactGeneratedAt": "2026-07-20T05:04:24.027Z",
      "executionGeneratedAt": "2026-07-20T02:34:42.573Z",
      "githubSyncUpdatedAt": "2026-07-20T02:45:19.661Z",
      "counts": {
        "dailyQueue": 61,
        "googleDiscovered": 37,
        "websiteContact": 3,
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
        "potentialPool": 61,
        "refillNeeded": 39,
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
  "completedAt": "2026-07-20T05:04:24.868Z"
};
