window.DAILY_AUTOMATION_EXECUTION_LATEST = {
  "ok": false,
  "browserTransportRequested": "codex-extension-first",
  "browserTransportUsed": "cdp",
  "browserTransportFallbackReason": "extension_bridge_not_available_process_local_cdp",
  "extensionReceiptCount": 0,
  "executionPhase": "browser_execution",
  "chromeStage": "opened",
  "chromeOpened": true,
  "chromeOpenedCount": 4,
  "customerDevelopmentPerformed": false,
  "customerMessageSent": false,
  "realDevelopmentCount": 0,
  "reportingVerdict": "no_customer_development_performed",
  "engine": "Browser transport queue bridge",
  "mode": "serial-single-target",
  "batchMode": "parallel-batches",
  "parallelLimit": 1,
  "limit": 13,
  "queueDate": "2026-07-29",
  "queueSource": "dailyQueue",
  "executed": [
    {
      "id": "google-customer-72hours-website-contact",
      "company": "72hours",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://72hours.ca/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;personal_profile_without_company_match_expected_72hours_title_Facebook;contact_path_strategy_v2",
      "timestamp": "2026-07-29T11:17:01.234Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.facebook.com/72hours.ca",
        "tabId": "1252E359CA8AF920F4129B798107FA70",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/1252E359CA8AF920F4129B798107FA70",
        "title": "Facebook"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "browserEngine": "codex-chrome-cdp",
        "mode": "codex_chrome_cdp",
        "targetUrl": "https://www.facebook.com/72hours.ca",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.facebook.com/72hours.ca",
          "tabId": "1252E359CA8AF920F4129B798107FA70",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/1252E359CA8AF920F4129B798107FA70",
          "title": "Facebook"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;personal_profile_without_company_match_expected_72hours_title_Facebook;contact_path_strategy_v2\",\"nextAction\":\"Wrong or unmatched account opened; record as major bug and move to next verified customer.\",\"draft\":\"Hi 72hours team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 84,
          "reason": "local_codex_extension_template",
          "draft": "Hi 72hours team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Chrome CDP fallback",
        "glmModel": "not_used",
        "followup": false,
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;personal_profile_without_company_match_expected_72hours_title_Facebook;contact_path_strategy_v2"
      }
    },
    {
      "id": "google-customer-doorout-website-contact",
      "company": "Doorout",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.doorout.com/",
      "ok": false,
      "sendStatus": "approval_pending",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;;contact_path_strategy_v2",
      "timestamp": "2026-07-29T11:17:06.157Z",
      "chromeOpen": null,
      "result": {
        "ok": false,
        "error": "Facebook outreach requires an exact verified page/profile URL",
        "mode": "official_website_social_fallback",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;;contact_path_strategy_v2",
        "output": "{\"verdict\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;;contact_path_strategy_v2\",\"nextAction\":\"Official website exposed facebook; Codex Chrome tried that social channel before website fallback.\",\"sendStatus\":\"approval_pending\"}"
      }
    },
    {
      "id": "google-customer-ld-mountain-centre-website-contact",
      "company": "LD Mountain Centre",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.ldmountaincentre.com/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;instagram_unavailable_profile_page: 很抱歉，无法访问此页面\n你点击的链接可能已损坏，或页面已被移除。返回 instagram。\nmeta\n关于\n博客\n工作\n帮助\napi\n隐私设置\n条款\n地点\n热门\ninstagram lite\nmeta ai\nthreads\n联系人上传和非用户\nmeta verified\n中文(简体)\nafrikaans\nالعربية\nčeština\ndansk\ndeutsch\nελληνικά\nenglish\nenglish (uk)\nespañol (españa)\nespañol\nفارسی\nsuomi\nfrançais\nעברית\nbahasa indonesia\nitaliano\n日本語\n한국어\nbahasa melayu\nnorsk\nnederlands\npolski\nportuguês (brasil)\nportuguês (portugal)\nрусский\nsvenska\nภาษาไทย\nfilipino\ntürkçe\n中文(简体)\n中文(台灣)\nবাংলা\nગુજરાતી\nहिन्दी\nhrvatski\nmagyar\nಕನ್ನಡ\nമലയാളം\nमराठी\nनेपाली\nਪੰਜਾਬੀ\nසිංහල\nslovenčina\nதமிழ்\nతెలుగు\nاردو\ntiếng việt\n中文(香港)\nбългарски\nfrançais (canada)\nromână\nсрпски\nукра;contact_path_strategy_v2",
      "timestamp": "2026-07-29T11:17:27.947Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/ld_mountain_centre/",
        "tabId": "6CD276DEEF627F2D3A0AD030D7504078",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/6CD276DEEF627F2D3A0AD030D7504078",
        "title": ""
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "browserEngine": "codex-chrome-cdp",
        "mode": "codex_chrome_cdp",
        "targetUrl": "https://www.instagram.com/ld_mountain_centre/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/ld_mountain_centre/",
          "tabId": "6CD276DEEF627F2D3A0AD030D7504078",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/6CD276DEEF627F2D3A0AD030D7504078",
          "title": ""
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;instagram_unavailable_profile_page: 很抱歉，无法访问此页面\\n你点击的链接可能已损坏，或页面已被移除。返回 instagram。\\nmeta\\n关于\\n博客\\n工作\\n帮助\\napi\\n隐私设置\\n条款\\n地点\\n热门\\ninstagram lite\\nmeta ai\\nthreads\\n联系人上传和非用户\\nmeta verified\\n中文(简体)\\nafrikaans\\nالعربية\\nčeština\\ndansk\\ndeutsch\\nελληνικά\\nenglish\\nenglish (uk)\\nespañol (españa)\\nespañol\\nفارسی\\nsuomi\\nfrançais\\nעברית\\nbahasa indonesia\\nitaliano\\n日本語\\n한국어\\nbahasa melayu\\nnorsk\\nnederlands\\npolski\\nportuguês (brasil)\\nportuguês (portugal)\\nрусский\\nsvenska\\nภาษาไทย\\nfilipino\\ntürkçe\\n中文(简体)\\n中文(台灣)\\nবাংলা\\nગુજરાતી\\nहिन्दी\\nhrvatski\\nmagyar\\nಕನ್ನಡ\\nമലയാളം\\nमराठी\\nनेपाली\\nਪੰਜਾਬੀ\\nසිංහල\\nslovenčina\\nதமிழ்\\nతెలుగు\\nاردو\\ntiếng việt\\n中文(香港)\\nбългарски\\nfrançais (canada)\\nromână\\nсрпски\\nукра;contact_path_strategy_v2\",\"nextAction\":\"Do not retry this URL; switch to a verified alternate channel or official website contact.\",\"draft\":\"Hi LD Mountain Centre team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\",\"fallbackFrom\":\"https://www.facebook.com/LDMountainCentre\",\"fallbackPlatform\":\"instagram\",\"fallbackReason\":\"personal_profile_without_company_match_expected_LD Mountain Centre_title_Facebook\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 84,
          "reason": "local_codex_extension_template",
          "draft": "Hi LD Mountain Centre team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Chrome CDP fallback",
        "glmModel": "not_used",
        "followup": false,
        "fallbackFrom": "https://www.facebook.com/LDMountainCentre",
        "fallbackPlatform": "instagram",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;instagram_unavailable_profile_page: 很抱歉，无法访问此页面\n你点击的链接可能已损坏，或页面已被移除。返回 instagram。\nmeta\n关于\n博客\n工作\n帮助\napi\n隐私设置\n条款\n地点\n热门\ninstagram lite\nmeta ai\nthreads\n联系人上传和非用户\nmeta verified\n中文(简体)\nafrikaans\nالعربية\nčeština\ndansk\ndeutsch\nελληνικά\nenglish\nenglish (uk)\nespañol (españa)\nespañol\nفارسی\nsuomi\nfrançais\nעברית\nbahasa indonesia\nitaliano\n日本語\n한국어\nbahasa melayu\nnorsk\nnederlands\npolski\nportuguês (brasil)\nportuguês (portugal)\nрусский\nsvenska\nภาษาไทย\nfilipino\ntürkçe\n中文(简体)\n中文(台灣)\nবাংলা\nગુજરાતી\nहिन्दी\nhrvatski\nmagyar\nಕನ್ನಡ\nമലയാളം\nमराठी\nनेपाली\nਪੰਜਾਬੀ\nසිංහල\nslovenčina\nதமிழ்\nతెలుగు\nاردو\ntiếng việt\n中文(香港)\nбългарски\nfrançais (canada)\nromână\nсрпски\nукра;contact_path_strategy_v2"
      }
    },
    {
      "id": "google-customer-rock-creek-website-contact",
      "company": "Rock/Creek",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.rockcreek.com/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2",
      "timestamp": "2026-07-29T11:18:05.092Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/rockcreek/",
        "tabId": "C63D865A2ACBB1F75ACA3F060D1B773C",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/C63D865A2ACBB1F75ACA3F060D1B773C",
        "title": "Rock Creek Rocks (@rockcreek) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "browserEngine": "codex-chrome-cdp",
        "mode": "codex_chrome_cdp",
        "targetUrl": "https://www.instagram.com/rockcreek/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/rockcreek/",
          "tabId": "C63D865A2ACBB1F75ACA3F060D1B773C",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/C63D865A2ACBB1F75ACA3F060D1B773C",
          "title": "Rock Creek Rocks (@rockcreek) · Instagram 照片和视频"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2\",\"nextAction\":\"Composer not detected; pause automation and notify operator only if retry would be unsafe.\",\"draft\":\"Hi Rock/Creek team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\",\"fallbackFrom\":\"https://www.facebook.com/rockcreek\",\"fallbackPlatform\":\"instagram\",\"fallbackReason\":\"personal_profile_without_company_match_expected_Rock/Creek_title_Facebook\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 84,
          "reason": "local_codex_extension_template",
          "draft": "Hi Rock/Creek team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Chrome CDP fallback",
        "glmModel": "not_used",
        "followup": false,
        "fallbackFrom": "https://www.facebook.com/rockcreek",
        "fallbackPlatform": "instagram",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2"
      }
    },
    {
      "id": "google-customer-sklep-podroznika-website-contact",
      "company": "Sklep Podroznika",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.sklep-podroznika.pl/",
      "ok": false,
      "sendStatus": "send_unconfirmed",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;instagram_send_clicked_but_confirmation_missing;;contact_path_strategy_v2",
      "timestamp": "2026-07-29T11:18:46.646Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/skleppodroznika/",
        "tabId": "74F0FDB4AFEF3F85A47D9B1822014EDA",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/74F0FDB4AFEF3F85A47D9B1822014EDA",
        "title": "Sklep Podróżnika Obieżyświat (@skleppodroznika) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "browserEngine": "codex-chrome-cdp",
        "mode": "codex_chrome_cdp",
        "targetUrl": "https://www.instagram.com/skleppodroznika/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/skleppodroznika/",
          "tabId": "74F0FDB4AFEF3F85A47D9B1822014EDA",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/74F0FDB4AFEF3F85A47D9B1822014EDA",
          "title": "Sklep Podróżnika Obieżyświat (@skleppodroznika) · Instagram 照片和视频"
        },
        "sendStatus": "send_unconfirmed",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;instagram_send_clicked_but_confirmation_missing;;contact_path_strategy_v2\",\"nextAction\":\"Send confirmation missing; pause and notify operator before any retry to avoid duplicate sending.\",\"draft\":\"Hi Sklep Podroznika team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"send_unconfirmed\",\"fallbackFrom\":\"https://www.facebook.com/skleppodroznika\",\"fallbackPlatform\":\"instagram\",\"fallbackReason\":\"personal_profile_without_company_match_expected_Sklep Podroznika_title_Facebook\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 84,
          "reason": "local_codex_extension_template",
          "draft": "Hi Sklep Podroznika team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Chrome CDP fallback",
        "glmModel": "not_used",
        "followup": false,
        "fallbackFrom": "https://www.facebook.com/skleppodroznika",
        "fallbackPlatform": "instagram",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;instagram_send_clicked_but_confirmation_missing;;contact_path_strategy_v2"
      }
    }
  ],
  "results": [
    {
      "id": "google-customer-72hours-website-contact",
      "company": "72hours",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://72hours.ca/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;personal_profile_without_company_match_expected_72hours_title_Facebook;contact_path_strategy_v2",
      "timestamp": "2026-07-29T11:17:01.234Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.facebook.com/72hours.ca",
        "tabId": "1252E359CA8AF920F4129B798107FA70",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/1252E359CA8AF920F4129B798107FA70",
        "title": "Facebook"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "browserEngine": "codex-chrome-cdp",
        "mode": "codex_chrome_cdp",
        "targetUrl": "https://www.facebook.com/72hours.ca",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.facebook.com/72hours.ca",
          "tabId": "1252E359CA8AF920F4129B798107FA70",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/1252E359CA8AF920F4129B798107FA70",
          "title": "Facebook"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;personal_profile_without_company_match_expected_72hours_title_Facebook;contact_path_strategy_v2\",\"nextAction\":\"Wrong or unmatched account opened; record as major bug and move to next verified customer.\",\"draft\":\"Hi 72hours team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 84,
          "reason": "local_codex_extension_template",
          "draft": "Hi 72hours team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Chrome CDP fallback",
        "glmModel": "not_used",
        "followup": false,
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;personal_profile_without_company_match_expected_72hours_title_Facebook;contact_path_strategy_v2"
      }
    },
    {
      "id": "google-customer-doorout-website-contact",
      "company": "Doorout",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.doorout.com/",
      "ok": false,
      "sendStatus": "approval_pending",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;;contact_path_strategy_v2",
      "timestamp": "2026-07-29T11:17:06.157Z",
      "chromeOpen": null,
      "result": {
        "ok": false,
        "error": "Facebook outreach requires an exact verified page/profile URL",
        "mode": "official_website_social_fallback",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;;contact_path_strategy_v2",
        "output": "{\"verdict\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;;contact_path_strategy_v2\",\"nextAction\":\"Official website exposed facebook; Codex Chrome tried that social channel before website fallback.\",\"sendStatus\":\"approval_pending\"}"
      }
    },
    {
      "id": "google-customer-ld-mountain-centre-website-contact",
      "company": "LD Mountain Centre",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.ldmountaincentre.com/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;instagram_unavailable_profile_page: 很抱歉，无法访问此页面\n你点击的链接可能已损坏，或页面已被移除。返回 instagram。\nmeta\n关于\n博客\n工作\n帮助\napi\n隐私设置\n条款\n地点\n热门\ninstagram lite\nmeta ai\nthreads\n联系人上传和非用户\nmeta verified\n中文(简体)\nafrikaans\nالعربية\nčeština\ndansk\ndeutsch\nελληνικά\nenglish\nenglish (uk)\nespañol (españa)\nespañol\nفارسی\nsuomi\nfrançais\nעברית\nbahasa indonesia\nitaliano\n日本語\n한국어\nbahasa melayu\nnorsk\nnederlands\npolski\nportuguês (brasil)\nportuguês (portugal)\nрусский\nsvenska\nภาษาไทย\nfilipino\ntürkçe\n中文(简体)\n中文(台灣)\nবাংলা\nગુજરાતી\nहिन्दी\nhrvatski\nmagyar\nಕನ್ನಡ\nമലയാളം\nमराठी\nनेपाली\nਪੰਜਾਬੀ\nසිංහල\nslovenčina\nதமிழ்\nతెలుగు\nاردو\ntiếng việt\n中文(香港)\nбългарски\nfrançais (canada)\nromână\nсрпски\nукра;contact_path_strategy_v2",
      "timestamp": "2026-07-29T11:17:27.947Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/ld_mountain_centre/",
        "tabId": "6CD276DEEF627F2D3A0AD030D7504078",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/6CD276DEEF627F2D3A0AD030D7504078",
        "title": ""
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "browserEngine": "codex-chrome-cdp",
        "mode": "codex_chrome_cdp",
        "targetUrl": "https://www.instagram.com/ld_mountain_centre/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/ld_mountain_centre/",
          "tabId": "6CD276DEEF627F2D3A0AD030D7504078",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/6CD276DEEF627F2D3A0AD030D7504078",
          "title": ""
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;instagram_unavailable_profile_page: 很抱歉，无法访问此页面\\n你点击的链接可能已损坏，或页面已被移除。返回 instagram。\\nmeta\\n关于\\n博客\\n工作\\n帮助\\napi\\n隐私设置\\n条款\\n地点\\n热门\\ninstagram lite\\nmeta ai\\nthreads\\n联系人上传和非用户\\nmeta verified\\n中文(简体)\\nafrikaans\\nالعربية\\nčeština\\ndansk\\ndeutsch\\nελληνικά\\nenglish\\nenglish (uk)\\nespañol (españa)\\nespañol\\nفارسی\\nsuomi\\nfrançais\\nעברית\\nbahasa indonesia\\nitaliano\\n日本語\\n한국어\\nbahasa melayu\\nnorsk\\nnederlands\\npolski\\nportuguês (brasil)\\nportuguês (portugal)\\nрусский\\nsvenska\\nภาษาไทย\\nfilipino\\ntürkçe\\n中文(简体)\\n中文(台灣)\\nবাংলা\\nગુજરાતી\\nहिन्दी\\nhrvatski\\nmagyar\\nಕನ್ನಡ\\nമലയാളം\\nमराठी\\nनेपाली\\nਪੰਜਾਬੀ\\nසිංහල\\nslovenčina\\nதமிழ்\\nతెలుగు\\nاردو\\ntiếng việt\\n中文(香港)\\nбългарски\\nfrançais (canada)\\nromână\\nсрпски\\nукра;contact_path_strategy_v2\",\"nextAction\":\"Do not retry this URL; switch to a verified alternate channel or official website contact.\",\"draft\":\"Hi LD Mountain Centre team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\",\"fallbackFrom\":\"https://www.facebook.com/LDMountainCentre\",\"fallbackPlatform\":\"instagram\",\"fallbackReason\":\"personal_profile_without_company_match_expected_LD Mountain Centre_title_Facebook\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 84,
          "reason": "local_codex_extension_template",
          "draft": "Hi LD Mountain Centre team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Chrome CDP fallback",
        "glmModel": "not_used",
        "followup": false,
        "fallbackFrom": "https://www.facebook.com/LDMountainCentre",
        "fallbackPlatform": "instagram",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;instagram_unavailable_profile_page: 很抱歉，无法访问此页面\n你点击的链接可能已损坏，或页面已被移除。返回 instagram。\nmeta\n关于\n博客\n工作\n帮助\napi\n隐私设置\n条款\n地点\n热门\ninstagram lite\nmeta ai\nthreads\n联系人上传和非用户\nmeta verified\n中文(简体)\nafrikaans\nالعربية\nčeština\ndansk\ndeutsch\nελληνικά\nenglish\nenglish (uk)\nespañol (españa)\nespañol\nفارسی\nsuomi\nfrançais\nעברית\nbahasa indonesia\nitaliano\n日本語\n한국어\nbahasa melayu\nnorsk\nnederlands\npolski\nportuguês (brasil)\nportuguês (portugal)\nрусский\nsvenska\nภาษาไทย\nfilipino\ntürkçe\n中文(简体)\n中文(台灣)\nবাংলা\nગુજરાતી\nहिन्दी\nhrvatski\nmagyar\nಕನ್ನಡ\nമലയാളം\nमराठी\nनेपाली\nਪੰਜਾਬੀ\nසිංහල\nslovenčina\nதமிழ்\nతెలుగు\nاردو\ntiếng việt\n中文(香港)\nбългарски\nfrançais (canada)\nromână\nсрпски\nукра;contact_path_strategy_v2"
      }
    },
    {
      "id": "google-customer-rock-creek-website-contact",
      "company": "Rock/Creek",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.rockcreek.com/",
      "ok": false,
      "sendStatus": "failed_open",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2",
      "timestamp": "2026-07-29T11:18:05.092Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/rockcreek/",
        "tabId": "C63D865A2ACBB1F75ACA3F060D1B773C",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/C63D865A2ACBB1F75ACA3F060D1B773C",
        "title": "Rock Creek Rocks (@rockcreek) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "browserEngine": "codex-chrome-cdp",
        "mode": "codex_chrome_cdp",
        "targetUrl": "https://www.instagram.com/rockcreek/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/rockcreek/",
          "tabId": "C63D865A2ACBB1F75ACA3F060D1B773C",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/C63D865A2ACBB1F75ACA3F060D1B773C",
          "title": "Rock Creek Rocks (@rockcreek) · Instagram 照片和视频"
        },
        "sendStatus": "failed_open",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2\",\"nextAction\":\"Composer not detected; pause automation and notify operator only if retry would be unsafe.\",\"draft\":\"Hi Rock/Creek team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"failed_open\",\"fallbackFrom\":\"https://www.facebook.com/rockcreek\",\"fallbackPlatform\":\"instagram\",\"fallbackReason\":\"personal_profile_without_company_match_expected_Rock/Creek_title_Facebook\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 84,
          "reason": "local_codex_extension_template",
          "draft": "Hi Rock/Creek team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Chrome CDP fallback",
        "glmModel": "not_used",
        "followup": false,
        "fallbackFrom": "https://www.facebook.com/rockcreek",
        "fallbackPlatform": "instagram",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;instagram_message_button_clicked_composer_not_found;contact_path_strategy_v2"
      }
    },
    {
      "id": "google-customer-sklep-podroznika-website-contact",
      "company": "Sklep Podroznika",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.sklep-podroznika.pl/",
      "ok": false,
      "sendStatus": "send_unconfirmed",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;instagram_send_clicked_but_confirmation_missing;;contact_path_strategy_v2",
      "timestamp": "2026-07-29T11:18:46.646Z",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-cdp",
        "port": 9224,
        "targetUrl": "https://www.instagram.com/skleppodroznika/",
        "tabId": "74F0FDB4AFEF3F85A47D9B1822014EDA",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/74F0FDB4AFEF3F85A47D9B1822014EDA",
        "title": "Sklep Podróżnika Obieżyświat (@skleppodroznika) · Instagram 照片和视频"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-cdp",
        "browserEngine": "codex-chrome-cdp",
        "mode": "codex_chrome_cdp",
        "targetUrl": "https://www.instagram.com/skleppodroznika/",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-cdp",
          "port": 9224,
          "targetUrl": "https://www.instagram.com/skleppodroznika/",
          "tabId": "74F0FDB4AFEF3F85A47D9B1822014EDA",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/74F0FDB4AFEF3F85A47D9B1822014EDA",
          "title": "Sklep Podróżnika Obieżyświat (@skleppodroznika) · Instagram 照片和视频"
        },
        "sendStatus": "send_unconfirmed",
        "output": "{\"verdict\":\"major_bug_review_needed\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;instagram_send_clicked_but_confirmation_missing;;contact_path_strategy_v2\",\"nextAction\":\"Send confirmation missing; pause and notify operator before any retry to avoid duplicate sending.\",\"draft\":\"Hi Sklep Podroznika team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?\",\"sendStatus\":\"send_unconfirmed\",\"fallbackFrom\":\"https://www.facebook.com/skleppodroznika\",\"fallbackPlatform\":\"instagram\",\"fallbackReason\":\"personal_profile_without_company_match_expected_Sklep Podroznika_title_Facebook\"}",
        "decision": {
          "verdict": "develop",
          "fitScore": 84,
          "reason": "local_codex_extension_template",
          "draft": "Hi Sklep Podroznika team, nice to e-meet you. I am Leo from FLEXTAIL, our core ultralight outdoor and travel electrics brand. For a retail/category buyer, the strongest fit is assortment fit, new SKU pipeline, price-tier coverage, and proven consumer demand; your verified outdoor, camping and travel retail social refill channel focus looks relevant to that direction. We are planning 36+ new SKUs for 2026 across several use cases and price tiers. Could you point me to the category buyer or vendor-review owner for a short intro video meeting?"
        },
        "executionLayer": "Chrome CDP fallback",
        "glmModel": "not_used",
        "followup": false,
        "fallbackFrom": "https://www.facebook.com/skleppodroznika",
        "fallbackPlatform": "instagram",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;official_social_fallback:facebook;instagram_send_clicked_but_confirmation_missing;;contact_path_strategy_v2"
      }
    }
  ],
  "skipped": [
    {
      "id": "google-customer-72hours-facebook",
      "company": "72hours",
      "action": "develop",
      "reason": "same_day_customer_already_developed"
    },
    {
      "id": "google-customer-ld-mountain-centre-facebook",
      "company": "LD Mountain Centre",
      "action": "develop",
      "reason": "same_day_customer_already_developed"
    },
    {
      "id": "google-customer-sklep-podroznika-facebook",
      "company": "Sklep Podroznika",
      "action": "develop",
      "reason": "same_day_customer_already_developed"
    },
    {
      "id": "google-customer-ld-mountain-centre-instagram",
      "company": "LD Mountain Centre",
      "action": "develop",
      "reason": "same_day_customer_already_developed"
    },
    {
      "id": "google-customer-rock-creek-instagram",
      "company": "Rock/Creek",
      "action": "develop",
      "reason": "same_day_customer_already_developed"
    },
    {
      "id": "google-customer-sklep-podroznika-instagram",
      "company": "Sklep Podroznika",
      "action": "develop",
      "reason": "same_day_customer_already_developed"
    },
    {
      "id": "google-customer-scandinavian-outdoor-website-contact",
      "company": "Scandinavian Outdoor",
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
      "id": "google-customer-snowleader-website-contact",
      "company": "Snowleader",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-8a-pl-website-contact",
      "company": "8a.pl",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-above-and-beyond-website-contact",
      "company": "Above and Beyond",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-campz-website-contact",
      "company": "Campz",
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
      "id": "google-customer-intersport-norway-website-contact",
      "company": "Intersport Norway",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-outdoor-specialist-website-contact",
      "company": "Outdoor Specialist",
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
      "id": "google-customer-tiso-website-contact",
      "company": "Tiso",
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
      "id": "google-customer-atmosphere-website-contact",
      "company": "Atmosphere",
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
      "id": "google-customer-eastern-mountain-sports-website-contact",
      "company": "Eastern Mountain Sports",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-jax-outdoor-gear-website-contact",
      "company": "Jax Outdoor Gear",
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
      "id": "google-customer-moosejaw-website-contact",
      "company": "Moosejaw",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-the-mountaineer-website-contact",
      "company": "The Mountaineer",
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
      "id": "google-customer-durango-outdoor-exchange-website-contact",
      "company": "Durango Outdoor Exchange",
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
      "id": "google-customer-wildfire-sports-website-contact",
      "company": "Wildfire Sports",
      "action": "verify_target",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-tentworld-website-contact",
      "company": "Tentworld",
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
      "id": "google-customer-mammut-store-website-contact",
      "company": "Mammut Store",
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
      "id": "google-customer-8a-pl-facebook",
      "company": "8a.pl",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
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
      "id": "google-customer-intersport-norway-facebook",
      "company": "Intersport Norway",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-outdoor-specialist-facebook",
      "company": "Outdoor Specialist",
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
      "id": "google-customer-mammut-store-facebook",
      "company": "Mammut Store",
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
      "id": "google-customer-atmosphere-instagram",
      "company": "Atmosphere",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-jax-outdoor-gear-instagram",
      "company": "Jax Outdoor Gear",
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
      "id": "google-customer-8a-pl-website-contact",
      "company": "8a.pl",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-above-and-beyond-website-contact",
      "company": "Above and Beyond",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-campz-website-contact",
      "company": "Campz",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-intersport-norway-website-contact",
      "company": "Intersport Norway",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-outdoor-specialist-website-contact",
      "company": "Outdoor Specialist",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-tiso-website-contact",
      "company": "Tiso",
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
      "id": "google-customer-atmosphere-website-contact",
      "company": "Atmosphere",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-eastern-mountain-sports-website-contact",
      "company": "Eastern Mountain Sports",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-jax-outdoor-gear-website-contact",
      "company": "Jax Outdoor Gear",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-moosejaw-website-contact",
      "company": "Moosejaw",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-the-mountaineer-website-contact",
      "company": "The Mountaineer",
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
      "id": "google-customer-durango-outdoor-exchange-website-contact",
      "company": "Durango Outdoor Exchange",
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
      "id": "google-customer-tentworld-website-contact",
      "company": "Tentworld",
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
      "id": "google-customer-mammut-store-website-contact",
      "company": "Mammut Store",
      "action": "email_priority",
      "reason": "homepage_only_contact_path_requires_verification"
    },
    {
      "id": "google-customer-8a-pl-facebook",
      "company": "8a.pl",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
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
      "id": "google-customer-intersport-norway-facebook",
      "company": "Intersport Norway",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_facebook"
    },
    {
      "id": "google-customer-outdoor-specialist-facebook",
      "company": "Outdoor Specialist",
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
      "id": "google-customer-mammut-store-facebook",
      "company": "Mammut Store",
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
      "id": "google-customer-atmosphere-instagram",
      "company": "Atmosphere",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-jax-outdoor-gear-instagram",
      "company": "Jax Outdoor Gear",
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
    }
  ],
  "summary": {
    "totalLeads": 16,
    "highIcp": 16,
    "readyToDevelop": 32,
    "dueNow": 99,
    "visibleTodayQueue": 41,
    "potentialPool": 100,
    "potentialPoolTarget": 100,
    "customerTableHighIcp": 13,
    "refillNeeded": 0,
    "executableCompanies": 18,
    "executableReserveTarget": 130,
    "executableReserveNeeded": 112,
    "executableByChannel": {
      "facebook": 18,
      "instagram": 14
    },
    "googleDiscovered": 87,
    "facebookDiscovered": 18,
    "websiteContactDiscovered": 55,
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
      "count": 100
    },
    {
      "reason": "concrete_google_discovered_major_customer_facebook",
      "status": "skipped",
      "count": 30
    },
    {
      "reason": "concrete_google_discovered_major_customer_instagram",
      "status": "skipped",
      "count": 22
    },
    {
      "reason": "official_website_contact_channel",
      "status": "skipped",
      "count": 16
    },
    {
      "reason": "missing_verified_profile_url",
      "status": "skipped",
      "count": 9
    },
    {
      "reason": "same_day_customer_already_developed",
      "status": "skipped",
      "count": 6
    },
    {
      "reason": "failed_open",
      "status": "failed_open",
      "count": 3
    },
    {
      "reason": "approval_pending",
      "status": "approval_pending",
      "count": 1
    },
    {
      "reason": "send_unconfirmed",
      "status": "send_unconfirmed",
      "count": 1
    }
  ],
  "blockerCounts": {
    "homepage_only_contact_path_requires_verification": 100,
    "concrete_google_discovered_major_customer_facebook": 30,
    "concrete_google_discovered_major_customer_instagram": 22,
    "official_website_contact_channel": 16,
    "missing_verified_profile_url": 9,
    "same_day_customer_already_developed": 6,
    "failed_open": 3,
    "approval_pending": 1,
    "send_unconfirmed": 1
  },
  "queueGoalStatus": {
    "target": 100,
    "potentialPool": 100,
    "queueCount": 99,
    "googleDiscovered": 87,
    "refillNeeded": 0,
    "reached": true,
    "action": "Daily high-ICP queue target reached."
  },
  "platformCircuitState": {},
  "userVisibleStatus": "Customer development was not performed. Blockers: homepage_only_contact_path_requires_verification (100); concrete_google_discovered_major_customer_facebook (30); concrete_google_discovered_major_customer_instagram (22).",
  "recoveryHint": "Add a verified Facebook or Instagram profile URL before retrying social outreach. Confirm the official social profile and safe message entry before rerunning Google-discovered social outreach. Verify the official profile opens and exposes a safe message composer, or switch to another verified channel.",
  "recoveryActions": [
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
    "stdout": "{\n  \"date\": \"2026-07-29\",\n  \"summary\": {\n    \"totalLeads\": 16,\n    \"highIcp\": 16,\n    \"readyToDevelop\": 30,\n    \"dueNow\": 99,\n    \"visibleTodayQueue\": 40,\n    \"potentialPool\": 100,\n    \"potentialPoolTarget\": 100,\n    \"customerTableHighIcp\": 16,\n    \"refillNeeded\": 0,\n    \"executableCompanies\": 17,\n    \"executableReserveTarget\": 130,\n    \"executableReserveNeeded\": 113,\n    \"executableByChannel\": {\n      \"facebook\": 17,\n      \"instagram\": 13\n    },\n    \"googleDiscovered\": 84,\n    \"facebookDiscovered\": 17,\n    \"websiteContactDiscovered\": 54,\n    \"scheduledLater\": 0,\n    \"cooldown\": 30,\n    \"emailPriority\": 0,\n    \"openAgencyMarket\": 15,\n    \"exclusiveAgencySkipped\": 1,\n    \"needsVerification\": 0,\n    \"retainedLowIcp\": 0\n  },\n  \"bugErrors\": 0,\n  \"queueFile\": \"E:\\\\New project\\\\outreach-dashboard\\\\daily-runs\\\\2026-07-29-daily-automation.json\",\n  \"csvFile\": \"E:\\\\New project\\\\outreach-dashboard\\\\daily-runs\\\\2026-07-29-daily-queue.csv\"\n}",
    "stderr": "",
    "error": "",
    "visibility": {
      "updatedAt": "2026-07-29T11:18:49.073Z",
      "source": "main-refreshDailyAutomationArtifacts",
      "runDate": "2026-07-29",
      "artifactGeneratedAt": "2026-07-29T11:18:46.946Z",
      "executionGeneratedAt": "2026-07-29T11:10:28.004Z",
      "githubSyncUpdatedAt": "2026-07-29T11:11:07.931Z",
      "counts": {
        "dailyQueue": 99,
        "googleDiscovered": 84,
        "websiteContact": 54,
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
        "potentialPool": 100,
        "refillNeeded": 0,
        "reached": true
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
  "ledgerReconciliationCount": 1,
  "completedAt": "2026-07-29T11:18:50.209Z"
};
