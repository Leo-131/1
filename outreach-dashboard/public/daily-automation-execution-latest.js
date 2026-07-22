window.DAILY_AUTOMATION_EXECUTION_LATEST = {
  "ok": false,
  "executionPhase": "browser_execution",
  "chromeStage": "opened",
  "chromeOpened": true,
  "chromeOpenedCount": 8,
  "customerDevelopmentPerformed": false,
  "customerMessageSent": false,
  "realDevelopmentCount": 0,
  "reportingVerdict": "no_customer_development_performed",
  "engine": "Codex Chrome Extension queue bridge",
  "mode": "serial-single-target",
  "batchMode": "parallel-batches",
  "parallelLimit": 1,
  "limit": 13,
  "queueDate": "2026-07-22",
  "queueSource": "dailyQueue",
  "executed": [
    {
      "id": "google-customer-bivouac-outdoor-website-contact",
      "company": "Bivouac Outdoor",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.bivouac.co.nz/",
      "ok": false,
      "sendStatus": "approval_pending",
      "evidence": "alibaba_webmail_compose_button_missing;contact_path_strategy_v2",
      "chromeOpen": null,
      "result": {
        "ok": false,
        "sendStatus": "approval_pending",
        "reason": "alibaba_webmail_compose_unavailable",
        "evidence": "alibaba_webmail_compose_button_missing;contact_path_strategy_v2",
        "engine": "alibaba-enterprise-mail-smtp-imap",
        "mode": "alibaba_email_delivery_unconfirmed",
        "targetUrl": "mailto:web@bivouac.co.nz",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Bivouac Outdoor Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "output": "{\"verdict\":\"approval_pending\",\"sendStatus\":\"approval_pending\",\"evidence\":\"alibaba_webmail_compose_button_missing;contact_path_strategy_v2\",\"nextAction\":\"Do not resend automatically; inspect the Alibaba Mail delivery and Sent-folder evidence.\",\"recipientEmail\":\"web@bivouac.co.nz\",\"messageId\":\"\"}"
      }
    },
    {
      "id": "google-customer-wildfire-sports-website-contact",
      "company": "Wildfire Sports",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.wildfiresports.com.au/",
      "ok": false,
      "sendStatus": "approval_pending",
      "evidence": "alibaba_webmail_compose_unavailable;contact_path_strategy_v2",
      "chromeOpen": null,
      "result": {
        "ok": false,
        "sendStatus": "approval_pending",
        "reason": "alibaba_webmail_compose_unavailable",
        "evidence": "alibaba_webmail_compose_unavailable;contact_path_strategy_v2",
        "engine": "alibaba-enterprise-mail-smtp-imap",
        "mode": "alibaba_email_delivery_unconfirmed",
        "targetUrl": "mailto:enquiries@wildfiresports.com.au",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Wildfire Sports Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "output": "{\"verdict\":\"approval_pending\",\"sendStatus\":\"approval_pending\",\"evidence\":\"alibaba_webmail_compose_unavailable;contact_path_strategy_v2\",\"nextAction\":\"Do not resend automatically; inspect the Alibaba Mail delivery and Sent-folder evidence.\",\"recipientEmail\":\"enquiries@wildfiresports.com.au\",\"messageId\":\"\"}"
      }
    },
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
        "tabId": "47FA22AEB65FF78767079ABB34FC1843",
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
          "tabId": "47FA22AEB65FF78767079ABB34FC1843",
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
        "tabId": "32E4420DC91AE7D7AA0AE0E7AD437674",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/32E4420DC91AE7D7AA0AE0E7AD437674",
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
          "tabId": "32E4420DC91AE7D7AA0AE0E7AD437674",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/32E4420DC91AE7D7AA0AE0E7AD437674",
          "title": ""
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Outnorth Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/help/contact-us;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/help/contact-us;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Outnorth Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.outnorth.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.outnorth.com/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/pages/contact-us\"},{\"targetUrl\":\"https://www.outnorth.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/pages/contact\"},{\"targetUrl\":\"https://www.outnorth.com/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/contact-us\"},{\"targetUrl\":\"https://www.outnorth.com/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/contact\"},{\"targetUrl\":\"https://www.outnorth.com/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/help/contact-us\"}]}"
      }
    },
    {
      "id": "google-customer-alpinetrek-website-contact",
      "company": "Alpinetrek",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.alpinetrek.co.uk/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.alpinetrek.co.uk/help/contact-us",
        "tabId": "AC9716DE377BD4DE464D6AEE2A433CB2",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/AC9716DE377BD4DE464D6AEE2A433CB2",
        "title": "Attention Required! | Cloudflare"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.alpinetrek.co.uk/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.alpinetrek.co.uk/help/contact-us",
          "tabId": "AC9716DE377BD4DE464D6AEE2A433CB2",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/AC9716DE377BD4DE464D6AEE2A433CB2",
          "title": "Attention Required! | Cloudflare"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Alpinetrek Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Alpinetrek Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.alpinetrek.co.uk/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.alpinetrek.co.uk/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.alpinetrek.co.uk/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.alpinetrek.co.uk/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.alpinetrek.co.uk/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.alpinetrek.co.uk/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
      }
    },
    {
      "id": "google-customer-barrabes-website-contact",
      "company": "Barrabes",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.barrabes.com/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_page_unavailable_404: Iniciar sesión\n|\nCrea tu cuenta\nRopa Hombre\nRopa Mujer\nCalzado\nEscalada\nEsquí\nMás material\nNutrición\nMarcas\nOutlet\nBlog\nMi cuenta\nMis pedidos\nMis favoritos\n Centro de ayuda\n Encuen;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.barrabes.com/help/contact-us",
        "tabId": "9E354ADDCEEA8E57F016E4AFB5E04C3C",
        "title": "",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "website_page_unavailable_404: Iniciar sesión\n|\nCrea tu cuenta\nRopa Hombre\nRopa Mujer\nCalzado\nEscalada\nEsquí\nMás material\nNutrición\nMarcas\nOutlet\nBlog\nMi cuenta\nMis pedidos\nMis favoritos\n Centro de ayuda\n Encuen"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.barrabes.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.barrabes.com/help/contact-us",
          "tabId": "9E354ADDCEEA8E57F016E4AFB5E04C3C",
          "title": "",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "website_page_unavailable_404: Iniciar sesión\n|\nCrea tu cuenta\nRopa Hombre\nRopa Mujer\nCalzado\nEscalada\nEsquí\nMás material\nNutrición\nMarcas\nOutlet\nBlog\nMi cuenta\nMis pedidos\nMis favoritos\n Centro de ayuda\n Encuen"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Barrabes Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_page_unavailable_404: Iniciar sesión\n|\nCrea tu cuenta\nRopa Hombre\nRopa Mujer\nCalzado\nEscalada\nEsquí\nMás material\nNutrición\nMarcas\nOutlet\nBlog\nMi cuenta\nMis pedidos\nMis favoritos\n Centro de ayuda\n Encuen;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_page_unavailable_404: Iniciar sesión\\n|\\nCrea tu cuenta\\nRopa Hombre\\nRopa Mujer\\nCalzado\\nEscalada\\nEsquí\\nMás material\\nNutrición\\nMarcas\\nOutlet\\nBlog\\nMi cuenta\\nMis pedidos\\nMis favoritos\\n Centro de ayuda\\n Encuen;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Barrabes Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.barrabes.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.barrabes.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Iniciar sesión\\n|\\nCrea tu cuenta\\nRopa Hombre\\nRopa Mujer\\nCalzado\\nEscalada\\nEsquí\\nMás material\\nNutrición\\nMarcas\\nOutlet\\nBlog\\nMi cuenta\\nMis pedidos\\nMis favoritos\\n Centro de ayuda\\n Encuen\"},{\"targetUrl\":\"https://www.barrabes.com/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Iniciar sesión\\n|\\nCrea tu cuenta\\nRopa Hombre\\nRopa Mujer\\nCalzado\\nEscalada\\nEsquí\\nMás material\\nNutrición\\nMarcas\\nOutlet\\nBlog\\nMi cuenta\\nMis pedidos\\nMis favoritos\\n Centro de ayuda\\n Encuen\"},{\"targetUrl\":\"https://www.barrabes.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Iniciar sesión\\n|\\nCrea tu cuenta\\nRopa Hombre\\nRopa Mujer\\nCalzado\\nEscalada\\nEsquí\\nMás material\\nNutrición\\nMarcas\\nOutlet\\nBlog\\nMi cuenta\\nMis pedidos\\nMis favoritos\\n Centro de ayuda\\n Encuen\"},{\"targetUrl\":\"https://www.barrabes.com/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Iniciar sesión\\n|\\nCrea tu cuenta\\nRopa Hombre\\nRopa Mujer\\nCalzado\\nEscalada\\nEsquí\\nMás material\\nNutrición\\nMarcas\\nOutlet\\nBlog\\nMi cuenta\\nMis pedidos\\nMis favoritos\\n Centro de ayuda\\n Encuen\"},{\"targetUrl\":\"https://www.barrabes.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Iniciar sesión\\n|\\nCrea tu cuenta\\nRopa Hombre\\nRopa Mujer\\nCalzado\\nEscalada\\nEsquí\\nMás material\\nNutrición\\nMarcas\\nOutlet\\nBlog\\nMi cuenta\\nMis pedidos\\nMis favoritos\\n Centro de ayuda\\n Encuen\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    },
    {
      "id": "google-customer-de-wit-schijndel-website-contact",
      "company": "De Wit Schijndel",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.de-wit.nl/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.de-wit.nl/help/contact-us",
        "tabId": "54A229E2D2D55145EBA2E2FF45F1FD8F",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/54A229E2D2D55145EBA2E2FF45F1FD8F",
        "title": "Human verification"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.de-wit.nl/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.de-wit.nl/help/contact-us",
          "tabId": "54A229E2D2D55145EBA2E2FF45F1FD8F",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/54A229E2D2D55145EBA2E2FF45F1FD8F",
          "title": "Human verification"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear De Wit Schijndel Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear De Wit Schijndel Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.de-wit.nl/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.de-wit.nl/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.de-wit.nl/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.de-wit.nl/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.de-wit.nl/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.de-wit.nl/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
      }
    },
    {
      "id": "google-customer-scandinavian-outdoor-website-contact",
      "company": "Scandinavian Outdoor",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://scandinavianoutdoor.com/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://scandinavianoutdoor.com/help/contact-us",
        "tabId": "4069DE54CE128DA9A027166C86D06426",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/4069DE54CE128DA9A027166C86D06426",
        "title": ""
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://scandinavianoutdoor.com/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://scandinavianoutdoor.com/help/contact-us",
          "tabId": "4069DE54CE128DA9A027166C86D06426",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/4069DE54CE128DA9A027166C86D06426",
          "title": ""
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Scandinavian Outdoor Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Scandinavian Outdoor Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://scandinavianoutdoor.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://scandinavianoutdoor.com/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://scandinavianoutdoor.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://scandinavianoutdoor.com/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://scandinavianoutdoor.com/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://scandinavianoutdoor.com/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
      }
    },
    {
      "id": "google-customer-snowleader-website-contact",
      "company": "Snowleader",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.snowleader.com/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.snowleader.com/help/contact-us",
        "tabId": "76C1D2E5F3B538F2E3EA1EB55A85970E",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/76C1D2E5F3B538F2E3EA1EB55A85970E",
        "title": "Just a moment..."
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.snowleader.com/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.snowleader.com/help/contact-us",
          "tabId": "76C1D2E5F3B538F2E3EA1EB55A85970E",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/76C1D2E5F3B538F2E3EA1EB55A85970E",
          "title": "Just a moment..."
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Snowleader Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Snowleader Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.snowleader.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.snowleader.com/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.snowleader.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.snowleader.com/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.snowleader.com/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.snowleader.com/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
      }
    },
    {
      "id": "google-customer-next-adventure-website-contact",
      "company": "Next Adventure",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://nextadventure.net/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://nextadventure.net/help/contact-us",
        "tabId": "844585E18F08EEA6D8472EC9890287D0",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/844585E18F08EEA6D8472EC9890287D0",
        "title": "Something went wrong"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://nextadventure.net/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://nextadventure.net/help/contact-us",
          "tabId": "844585E18F08EEA6D8472EC9890287D0",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/844585E18F08EEA6D8472EC9890287D0",
          "title": "Something went wrong"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Next Adventure Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Next Adventure Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://nextadventure.net/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://nextadventure.net/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://nextadventure.net/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://nextadventure.net/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Something went wrong.\\n\\nWhat happened?\\n404 Not Found\\nWhat can I do?\\nReturn to the previous page.\"},{\"targetUrl\":\"https://nextadventure.net/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Something went wrong.\\n\\nWhat happened?\\n404 Not Found\\nWhat can I do?\\nReturn to the previous page.\"},{\"targetUrl\":\"https://nextadventure.net/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
      }
    },
    {
      "id": "google-customer-outdoorxl-website-contact",
      "company": "OutdoorXL",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.outdoorxl.nl/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.outdoorxl.nl/help/contact-us",
        "tabId": "B8A9FD3F6BF309851581AAEA42C460CE",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/B8A9FD3F6BF309851581AAEA42C460CE",
        "title": "Just a moment..."
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.outdoorxl.nl/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.outdoorxl.nl/help/contact-us",
          "tabId": "B8A9FD3F6BF309851581AAEA42C460CE",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/B8A9FD3F6BF309851581AAEA42C460CE",
          "title": "Just a moment..."
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear OutdoorXL Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear OutdoorXL Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.outdoorxl.nl/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.outdoorxl.nl/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.outdoorxl.nl/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.outdoorxl.nl/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.outdoorxl.nl/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.outdoorxl.nl/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
      }
    },
    {
      "id": "google-customer-spejder-sport-website-contact",
      "company": "Spejder Sport",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.spejdersport.dk/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.spejdersport.dk/help/contact-us",
        "tabId": "F372BFD542FFD1B4E8A45373385B7491",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/F372BFD542FFD1B4E8A45373385B7491",
        "title": "Attention Required! | Cloudflare"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.spejdersport.dk/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.spejdersport.dk/help/contact-us",
          "tabId": "F372BFD542FFD1B4E8A45373385B7491",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/F372BFD542FFD1B4E8A45373385B7491",
          "title": "Attention Required! | Cloudflare"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Spejder Sport Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Spejder Sport Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.spejdersport.dk/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.spejdersport.dk/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.spejdersport.dk/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.spejdersport.dk/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.spejdersport.dk/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.spejdersport.dk/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
      }
    },
    {
      "id": "google-customer-taunton-leisure-website-contact",
      "company": "Taunton Leisure",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.tauntonleisure.com/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "unavailable_profile_page: Sale\nClothing\nCamping\nFootwear\nRucksacks\nEquipment\nBrands\nHelp\nSummer Sale - Now On\nFree UK Delivery Over £50 Rewards Our Stores\n❮\nSummer Sale - Now On View Collection\n❯\nTo improve;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.tauntonleisure.com/help/contact-us",
        "tabId": "0E9279E63EDB121D386E110881D373FB",
        "title": "Sorry, page not found",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "unavailable_profile_page: Sale\nClothing\nCamping\nFootwear\nRucksacks\nEquipment\nBrands\nHelp\nSummer Sale - Now On\nFree UK Delivery Over £50 Rewards Our Stores\n❮\nSummer Sale - Now On View Collection\n❯\nTo improve"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.tauntonleisure.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.tauntonleisure.com/help/contact-us",
          "tabId": "0E9279E63EDB121D386E110881D373FB",
          "title": "Sorry, page not found",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "unavailable_profile_page: Sale\nClothing\nCamping\nFootwear\nRucksacks\nEquipment\nBrands\nHelp\nSummer Sale - Now On\nFree UK Delivery Over £50 Rewards Our Stores\n❮\nSummer Sale - Now On View Collection\n❯\nTo improve"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Taunton Leisure Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "unavailable_profile_page: Sale\nClothing\nCamping\nFootwear\nRucksacks\nEquipment\nBrands\nHelp\nSummer Sale - Now On\nFree UK Delivery Over £50 Rewards Our Stores\n❮\nSummer Sale - Now On View Collection\n❯\nTo improve;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"unavailable_profile_page: Sale\\nClothing\\nCamping\\nFootwear\\nRucksacks\\nEquipment\\nBrands\\nHelp\\nSummer Sale - Now On\\nFree UK Delivery Over £50 Rewards Our Stores\\n❮\\nSummer Sale - Now On View Collection\\n❯\\nTo improve;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Taunton Leisure Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.tauntonleisure.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.tauntonleisure.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Sale\\nClothing\\nCamping\\nFootwear\\nRucksacks\\nEquipment\\nBrands\\nHelp\"},{\"targetUrl\":\"https://www.tauntonleisure.com/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Sale\\nClothing\\nCamping\\nFootwear\\nRucksacks\\nEquipment\\nBrands\\nHelp\"},{\"targetUrl\":\"https://www.tauntonleisure.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Sorry, page not found\"},{\"targetUrl\":\"https://www.tauntonleisure.com/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Sale\\nClothing\\nCamping\\nFootwear\\nRucksacks\\nEquipment\\nBrands\\nHelp\\nSummer Sale - Now On\\nFree UK Delivery Over £50 Rewards Our Stores\\n❮\\nSummer Sale - Now On View Collection\\n❯\\nTo improve\"},{\"targetUrl\":\"https://www.tauntonleisure.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Sale\\nClothing\\nCamping\\nFootwear\\nRucksacks\\nEquipment\\nBrands\\nHelp\\nSummer Sale - Now On\\nFree UK Delivery Over £50 Rewards Our Stores\\n❮\\nSummer Sale - Now On View Collection\\n❯\\nTo improve\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    }
  ],
  "results": [
    {
      "id": "google-customer-bivouac-outdoor-website-contact",
      "company": "Bivouac Outdoor",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.bivouac.co.nz/",
      "ok": false,
      "sendStatus": "approval_pending",
      "evidence": "alibaba_webmail_compose_button_missing;contact_path_strategy_v2",
      "chromeOpen": null,
      "result": {
        "ok": false,
        "sendStatus": "approval_pending",
        "reason": "alibaba_webmail_compose_unavailable",
        "evidence": "alibaba_webmail_compose_button_missing;contact_path_strategy_v2",
        "engine": "alibaba-enterprise-mail-smtp-imap",
        "mode": "alibaba_email_delivery_unconfirmed",
        "targetUrl": "mailto:web@bivouac.co.nz",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Bivouac Outdoor Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "output": "{\"verdict\":\"approval_pending\",\"sendStatus\":\"approval_pending\",\"evidence\":\"alibaba_webmail_compose_button_missing;contact_path_strategy_v2\",\"nextAction\":\"Do not resend automatically; inspect the Alibaba Mail delivery and Sent-folder evidence.\",\"recipientEmail\":\"web@bivouac.co.nz\",\"messageId\":\"\"}"
      }
    },
    {
      "id": "google-customer-wildfire-sports-website-contact",
      "company": "Wildfire Sports",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.wildfiresports.com.au/",
      "ok": false,
      "sendStatus": "approval_pending",
      "evidence": "alibaba_webmail_compose_unavailable;contact_path_strategy_v2",
      "chromeOpen": null,
      "result": {
        "ok": false,
        "sendStatus": "approval_pending",
        "reason": "alibaba_webmail_compose_unavailable",
        "evidence": "alibaba_webmail_compose_unavailable;contact_path_strategy_v2",
        "engine": "alibaba-enterprise-mail-smtp-imap",
        "mode": "alibaba_email_delivery_unconfirmed",
        "targetUrl": "mailto:enquiries@wildfiresports.com.au",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Wildfire Sports Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "output": "{\"verdict\":\"approval_pending\",\"sendStatus\":\"approval_pending\",\"evidence\":\"alibaba_webmail_compose_unavailable;contact_path_strategy_v2\",\"nextAction\":\"Do not resend automatically; inspect the Alibaba Mail delivery and Sent-folder evidence.\",\"recipientEmail\":\"enquiries@wildfiresports.com.au\",\"messageId\":\"\"}"
      }
    },
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
        "tabId": "47FA22AEB65FF78767079ABB34FC1843",
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
          "tabId": "47FA22AEB65FF78767079ABB34FC1843",
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
        "tabId": "32E4420DC91AE7D7AA0AE0E7AD437674",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/32E4420DC91AE7D7AA0AE0E7AD437674",
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
          "tabId": "32E4420DC91AE7D7AA0AE0E7AD437674",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/32E4420DC91AE7D7AA0AE0E7AD437674",
          "title": ""
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Outnorth Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/help/contact-us;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/help/contact-us;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Outnorth Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.outnorth.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.outnorth.com/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/pages/contact-us\"},{\"targetUrl\":\"https://www.outnorth.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/pages/contact\"},{\"targetUrl\":\"https://www.outnorth.com/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/contact-us\"},{\"targetUrl\":\"https://www.outnorth.com/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/contact\"},{\"targetUrl\":\"https://www.outnorth.com/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;contact_entry_clicked:https://www.outnorth.com/help/contact-us\"}]}"
      }
    },
    {
      "id": "google-customer-alpinetrek-website-contact",
      "company": "Alpinetrek",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.alpinetrek.co.uk/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.alpinetrek.co.uk/help/contact-us",
        "tabId": "AC9716DE377BD4DE464D6AEE2A433CB2",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/AC9716DE377BD4DE464D6AEE2A433CB2",
        "title": "Attention Required! | Cloudflare"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.alpinetrek.co.uk/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.alpinetrek.co.uk/help/contact-us",
          "tabId": "AC9716DE377BD4DE464D6AEE2A433CB2",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/AC9716DE377BD4DE464D6AEE2A433CB2",
          "title": "Attention Required! | Cloudflare"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Alpinetrek Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Alpinetrek Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.alpinetrek.co.uk/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.alpinetrek.co.uk/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.alpinetrek.co.uk/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.alpinetrek.co.uk/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.alpinetrek.co.uk/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.alpinetrek.co.uk/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
      }
    },
    {
      "id": "google-customer-barrabes-website-contact",
      "company": "Barrabes",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.barrabes.com/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_page_unavailable_404: Iniciar sesión\n|\nCrea tu cuenta\nRopa Hombre\nRopa Mujer\nCalzado\nEscalada\nEsquí\nMás material\nNutrición\nMarcas\nOutlet\nBlog\nMi cuenta\nMis pedidos\nMis favoritos\n Centro de ayuda\n Encuen;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.barrabes.com/help/contact-us",
        "tabId": "9E354ADDCEEA8E57F016E4AFB5E04C3C",
        "title": "",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "website_page_unavailable_404: Iniciar sesión\n|\nCrea tu cuenta\nRopa Hombre\nRopa Mujer\nCalzado\nEscalada\nEsquí\nMás material\nNutrición\nMarcas\nOutlet\nBlog\nMi cuenta\nMis pedidos\nMis favoritos\n Centro de ayuda\n Encuen"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.barrabes.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.barrabes.com/help/contact-us",
          "tabId": "9E354ADDCEEA8E57F016E4AFB5E04C3C",
          "title": "",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "website_page_unavailable_404: Iniciar sesión\n|\nCrea tu cuenta\nRopa Hombre\nRopa Mujer\nCalzado\nEscalada\nEsquí\nMás material\nNutrición\nMarcas\nOutlet\nBlog\nMi cuenta\nMis pedidos\nMis favoritos\n Centro de ayuda\n Encuen"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Barrabes Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_page_unavailable_404: Iniciar sesión\n|\nCrea tu cuenta\nRopa Hombre\nRopa Mujer\nCalzado\nEscalada\nEsquí\nMás material\nNutrición\nMarcas\nOutlet\nBlog\nMi cuenta\nMis pedidos\nMis favoritos\n Centro de ayuda\n Encuen;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_page_unavailable_404: Iniciar sesión\\n|\\nCrea tu cuenta\\nRopa Hombre\\nRopa Mujer\\nCalzado\\nEscalada\\nEsquí\\nMás material\\nNutrición\\nMarcas\\nOutlet\\nBlog\\nMi cuenta\\nMis pedidos\\nMis favoritos\\n Centro de ayuda\\n Encuen;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Barrabes Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.barrabes.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.barrabes.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Iniciar sesión\\n|\\nCrea tu cuenta\\nRopa Hombre\\nRopa Mujer\\nCalzado\\nEscalada\\nEsquí\\nMás material\\nNutrición\\nMarcas\\nOutlet\\nBlog\\nMi cuenta\\nMis pedidos\\nMis favoritos\\n Centro de ayuda\\n Encuen\"},{\"targetUrl\":\"https://www.barrabes.com/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Iniciar sesión\\n|\\nCrea tu cuenta\\nRopa Hombre\\nRopa Mujer\\nCalzado\\nEscalada\\nEsquí\\nMás material\\nNutrición\\nMarcas\\nOutlet\\nBlog\\nMi cuenta\\nMis pedidos\\nMis favoritos\\n Centro de ayuda\\n Encuen\"},{\"targetUrl\":\"https://www.barrabes.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Iniciar sesión\\n|\\nCrea tu cuenta\\nRopa Hombre\\nRopa Mujer\\nCalzado\\nEscalada\\nEsquí\\nMás material\\nNutrición\\nMarcas\\nOutlet\\nBlog\\nMi cuenta\\nMis pedidos\\nMis favoritos\\n Centro de ayuda\\n Encuen\"},{\"targetUrl\":\"https://www.barrabes.com/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Iniciar sesión\\n|\\nCrea tu cuenta\\nRopa Hombre\\nRopa Mujer\\nCalzado\\nEscalada\\nEsquí\\nMás material\\nNutrición\\nMarcas\\nOutlet\\nBlog\\nMi cuenta\\nMis pedidos\\nMis favoritos\\n Centro de ayuda\\n Encuen\"},{\"targetUrl\":\"https://www.barrabes.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Iniciar sesión\\n|\\nCrea tu cuenta\\nRopa Hombre\\nRopa Mujer\\nCalzado\\nEscalada\\nEsquí\\nMás material\\nNutrición\\nMarcas\\nOutlet\\nBlog\\nMi cuenta\\nMis pedidos\\nMis favoritos\\n Centro de ayuda\\n Encuen\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    },
    {
      "id": "google-customer-de-wit-schijndel-website-contact",
      "company": "De Wit Schijndel",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.de-wit.nl/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.de-wit.nl/help/contact-us",
        "tabId": "54A229E2D2D55145EBA2E2FF45F1FD8F",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/54A229E2D2D55145EBA2E2FF45F1FD8F",
        "title": "Human verification"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.de-wit.nl/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.de-wit.nl/help/contact-us",
          "tabId": "54A229E2D2D55145EBA2E2FF45F1FD8F",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/54A229E2D2D55145EBA2E2FF45F1FD8F",
          "title": "Human verification"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear De Wit Schijndel Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear De Wit Schijndel Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.de-wit.nl/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.de-wit.nl/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.de-wit.nl/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.de-wit.nl/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.de-wit.nl/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.de-wit.nl/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
      }
    },
    {
      "id": "google-customer-scandinavian-outdoor-website-contact",
      "company": "Scandinavian Outdoor",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://scandinavianoutdoor.com/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://scandinavianoutdoor.com/help/contact-us",
        "tabId": "4069DE54CE128DA9A027166C86D06426",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/4069DE54CE128DA9A027166C86D06426",
        "title": ""
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://scandinavianoutdoor.com/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://scandinavianoutdoor.com/help/contact-us",
          "tabId": "4069DE54CE128DA9A027166C86D06426",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/4069DE54CE128DA9A027166C86D06426",
          "title": ""
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Scandinavian Outdoor Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Scandinavian Outdoor Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://scandinavianoutdoor.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://scandinavianoutdoor.com/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://scandinavianoutdoor.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://scandinavianoutdoor.com/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://scandinavianoutdoor.com/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://scandinavianoutdoor.com/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
      }
    },
    {
      "id": "google-customer-snowleader-website-contact",
      "company": "Snowleader",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.snowleader.com/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.snowleader.com/help/contact-us",
        "tabId": "76C1D2E5F3B538F2E3EA1EB55A85970E",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/76C1D2E5F3B538F2E3EA1EB55A85970E",
        "title": "Just a moment..."
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.snowleader.com/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.snowleader.com/help/contact-us",
          "tabId": "76C1D2E5F3B538F2E3EA1EB55A85970E",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/76C1D2E5F3B538F2E3EA1EB55A85970E",
          "title": "Just a moment..."
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Snowleader Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Snowleader Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.snowleader.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.snowleader.com/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.snowleader.com/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.snowleader.com/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.snowleader.com/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.snowleader.com/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
      }
    },
    {
      "id": "google-customer-next-adventure-website-contact",
      "company": "Next Adventure",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://nextadventure.net/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://nextadventure.net/help/contact-us",
        "tabId": "844585E18F08EEA6D8472EC9890287D0",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/844585E18F08EEA6D8472EC9890287D0",
        "title": "Something went wrong"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://nextadventure.net/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://nextadventure.net/help/contact-us",
          "tabId": "844585E18F08EEA6D8472EC9890287D0",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/844585E18F08EEA6D8472EC9890287D0",
          "title": "Something went wrong"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Next Adventure Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Next Adventure Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://nextadventure.net/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://nextadventure.net/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://nextadventure.net/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://nextadventure.net/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Something went wrong.\\n\\nWhat happened?\\n404 Not Found\\nWhat can I do?\\nReturn to the previous page.\"},{\"targetUrl\":\"https://nextadventure.net/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"website_page_unavailable_404: Something went wrong.\\n\\nWhat happened?\\n404 Not Found\\nWhat can I do?\\nReturn to the previous page.\"},{\"targetUrl\":\"https://nextadventure.net/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
      }
    },
    {
      "id": "google-customer-outdoorxl-website-contact",
      "company": "OutdoorXL",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.outdoorxl.nl/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.outdoorxl.nl/help/contact-us",
        "tabId": "B8A9FD3F6BF309851581AAEA42C460CE",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/B8A9FD3F6BF309851581AAEA42C460CE",
        "title": "Just a moment..."
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.outdoorxl.nl/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.outdoorxl.nl/help/contact-us",
          "tabId": "B8A9FD3F6BF309851581AAEA42C460CE",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/B8A9FD3F6BF309851581AAEA42C460CE",
          "title": "Just a moment..."
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear OutdoorXL Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear OutdoorXL Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.outdoorxl.nl/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.outdoorxl.nl/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.outdoorxl.nl/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.outdoorxl.nl/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.outdoorxl.nl/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.outdoorxl.nl/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
      }
    },
    {
      "id": "google-customer-spejder-sport-website-contact",
      "company": "Spejder Sport",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.spejdersport.dk/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": true,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.spejdersport.dk/help/contact-us",
        "tabId": "F372BFD542FFD1B4E8A45373385B7491",
        "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/F372BFD542FFD1B4E8A45373385B7491",
        "title": "Attention Required! | Cloudflare"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.spejdersport.dk/help/contact-us",
        "chromeOpen": {
          "ok": true,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.spejdersport.dk/help/contact-us",
          "tabId": "F372BFD542FFD1B4E8A45373385B7491",
          "webSocketDebuggerUrl": "ws://127.0.0.1:9224/devtools/page/F372BFD542FFD1B4E8A45373385B7491",
          "title": "Attention Required! | Cloudflare"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Spejder Sport Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"nextAction\":\"Contact page opened, but no verified form, mailto link, vendor/business route, or clickable Contact Us path was detected. Continue manually before marking the lead ready.\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Spejder Sport Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.spejdersport.dk/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.spejdersport.dk/pages/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.spejdersport.dk/pages/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.spejdersport.dk/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.spejdersport.dk/contact\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.spejdersport.dk/help/contact-us\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"}]}"
      }
    },
    {
      "id": "google-customer-taunton-leisure-website-contact",
      "company": "Taunton Leisure",
      "action": "verify_target",
      "platform": "email",
      "targetUrl": "https://www.tauntonleisure.com/",
      "ok": false,
      "sendStatus": "website_contact_unreachable_skip",
      "evidence": "unavailable_profile_page: Sale\nClothing\nCamping\nFootwear\nRucksacks\nEquipment\nBrands\nHelp\nSummer Sale - Now On\nFree UK Delivery Over £50 Rewards Our Stores\n❮\nSummer Sale - Now On View Collection\n❯\nTo improve;website_contact_all_targets_failed:6;contact_path_strategy_v2",
      "chromeOpen": {
        "ok": false,
        "engine": "codex-chrome-extension-cdp",
        "port": 9224,
        "targetUrl": "https://www.tauntonleisure.com/help/contact-us",
        "tabId": "0E9279E63EDB121D386E110881D373FB",
        "title": "Sorry, page not found",
        "status": "failed_open",
        "error": "profile_unavailable_or_broken_link",
        "evidence": "unavailable_profile_page: Sale\nClothing\nCamping\nFootwear\nRucksacks\nEquipment\nBrands\nHelp\nSummer Sale - Now On\nFree UK Delivery Over £50 Rewards Our Stores\n❮\nSummer Sale - Now On View Collection\n❯\nTo improve"
      },
      "result": {
        "ok": false,
        "engine": "codex-chrome-extension-website-contact",
        "browserEngine": "codex-chrome-extension-cdp",
        "mode": "website_contact_unreachable_skip",
        "targetUrl": "https://www.tauntonleisure.com/help/contact-us",
        "chromeOpen": {
          "ok": false,
          "engine": "codex-chrome-extension-cdp",
          "port": 9224,
          "targetUrl": "https://www.tauntonleisure.com/help/contact-us",
          "tabId": "0E9279E63EDB121D386E110881D373FB",
          "title": "Sorry, page not found",
          "status": "failed_open",
          "error": "profile_unavailable_or_broken_link",
          "evidence": "unavailable_profile_page: Sale\nClothing\nCamping\nFootwear\nRucksacks\nEquipment\nBrands\nHelp\nSummer Sale - Now On\nFree UK Delivery Over £50 Rewards Our Stores\n❮\nSummer Sale - Now On View Collection\n❯\nTo improve"
        },
        "sendStatus": "website_contact_unreachable_skip",
        "subject": "FLEXTAIL retail partnership | 2026 assortment",
        "draft": "Dear Taunton Leisure Team,\n\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\n\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\n\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\n\nProduct overview: https://www.flextail.com/\n\nBest regards,\nLeo Liu\nSales & Operations Director\nLeo@flextailgear.com",
        "evidence": "unavailable_profile_page: Sale\nClothing\nCamping\nFootwear\nRucksacks\nEquipment\nBrands\nHelp\nSummer Sale - Now On\nFree UK Delivery Over £50 Rewards Our Stores\n❮\nSummer Sale - Now On View Collection\n❯\nTo improve;website_contact_all_targets_failed:6;contact_path_strategy_v2",
        "output": "{\"verdict\":\"website_contact_unreachable_skip\",\"evidence\":\"unavailable_profile_page: Sale\\nClothing\\nCamping\\nFootwear\\nRucksacks\\nEquipment\\nBrands\\nHelp\\nSummer Sale - Now On\\nFree UK Delivery Over £50 Rewards Our Stores\\n❮\\nSummer Sale - Now On View Collection\\n❯\\nTo improve;website_contact_all_targets_failed:6;contact_path_strategy_v2\",\"subject\":\"FLEXTAIL retail partnership | 2026 assortment\",\"draft\":\"Dear Taunton Leisure Team,\\n\\nI’m Leo from FLEXTAIL. Your focus on outdoor, camping and travel retail looks highly relevant to our compact outdoor electrics, including portable pumps, camping lighting and lightweight power solutions.\\n\\nFLEXTAIL products are designed to add practical, high-rotation items to outdoor and travel assortments. We are preparing 36+ new SKUs for 2026 across multiple use cases and price tiers, giving retail partners more options for seasonal launches and category expansion.\\n\\nWould you be the right person to review a potential supplier partnership, or could you direct me to your category buyer or vendor-onboarding team?\\n\\nProduct overview: https://www.flextail.com/\\n\\nBest regards,\\nLeo Liu\\nSales & Operations Director\\nLeo@flextailgear.com\",\"sendStatus\":\"website_contact_unreachable_skip\",\"attempts\":[{\"targetUrl\":\"https://www.tauntonleisure.com/\",\"sendStatus\":\"approval_pending\",\"evidence\":\"website_contact_entry_not_verified;no_contact_entry_control\"},{\"targetUrl\":\"https://www.tauntonleisure.com/pages/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Sale\\nClothing\\nCamping\\nFootwear\\nRucksacks\\nEquipment\\nBrands\\nHelp\"},{\"targetUrl\":\"https://www.tauntonleisure.com/pages/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Sale\\nClothing\\nCamping\\nFootwear\\nRucksacks\\nEquipment\\nBrands\\nHelp\"},{\"targetUrl\":\"https://www.tauntonleisure.com/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Sorry, page not found\"},{\"targetUrl\":\"https://www.tauntonleisure.com/contact\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Sale\\nClothing\\nCamping\\nFootwear\\nRucksacks\\nEquipment\\nBrands\\nHelp\\nSummer Sale - Now On\\nFree UK Delivery Over £50 Rewards Our Stores\\n❮\\nSummer Sale - Now On View Collection\\n❯\\nTo improve\"},{\"targetUrl\":\"https://www.tauntonleisure.com/help/contact-us\",\"sendStatus\":\"failed_open\",\"evidence\":\"unavailable_profile_page: Sale\\nClothing\\nCamping\\nFootwear\\nRucksacks\\nEquipment\\nBrands\\nHelp\\nSummer Sale - Now On\\nFree UK Delivery Over £50 Rewards Our Stores\\n❮\\nSummer Sale - Now On View Collection\\n❯\\nTo improve\"}],\"nextAction\":\"Official website contact was unreachable or not machine-verifiable. Skip this website route now, note it clearly, and continue with LinkedIn, Facebook, Instagram, or another verified official channel.\"}"
      }
    }
  ],
  "skipped": [
    {
      "id": "google-customer-obelink-website-contact",
      "company": "Obelink",
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
      "id": "google-customer-tentworld-website-contact",
      "company": "Tentworld",
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
      "id": "google-customer-outdoor-specialist-instagram",
      "company": "Outdoor Specialist",
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
      "id": "google-customer-bergfreunde-website-contact",
      "company": "Bergfreunde",
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
      "id": "google-customer-ekosport-website-contact",
      "company": "Ekosport",
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
      "id": "google-customer-hardloop-website-contact",
      "company": "Hardloop",
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
      "id": "google-customer-bergfreunde-instagram",
      "company": "Bergfreunde",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
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
      "id": "google-customer-sklep-podroznika-instagram",
      "company": "Sklep Podroznika",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
    },
    {
      "id": "google-customer-sportler-instagram",
      "company": "Sportler",
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
      "id": "google-customer-ekosport-website-contact",
      "company": "Ekosport",
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
      "id": "google-customer-bergfreunde-instagram",
      "company": "Bergfreunde",
      "action": "develop",
      "reason": "concrete_google_discovered_major_customer_instagram"
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
      "id": "google-customer-sportler-instagram",
      "company": "Sportler",
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
    "dueNow": 97,
    "visibleTodayQueue": 43,
    "potentialPool": 97,
    "potentialPoolTarget": 100,
    "customerTableHighIcp": 24,
    "refillNeeded": 3,
    "googleDiscovered": 73,
    "facebookDiscovered": 15,
    "websiteContactDiscovered": 39,
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
      "count": 52
    },
    {
      "reason": "concrete_google_discovered_major_customer_instagram",
      "status": "skipped",
      "count": 38
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
      "reason": "alibaba_webmail_compose_unavailable",
      "status": "approval_pending",
      "count": 2
    }
  ],
  "blockerCounts": {
    "homepage_only_contact_path_requires_verification": 52,
    "concrete_google_discovered_major_customer_instagram": 38,
    "missing_verified_profile_url": 32,
    "concrete_google_discovered_major_customer_facebook": 30,
    "official_website_contact_channel": 16,
    "alibaba_webmail_compose_unavailable": 2
  },
  "queueGoalStatus": {
    "target": 100,
    "potentialPool": 97,
    "queueCount": 97,
    "googleDiscovered": 73,
    "refillNeeded": 3,
    "reached": false,
    "action": "Add more verified high-ICP sources or unblock existing website/social leads."
  },
  "userVisibleStatus": "Customer development was not performed. Blockers: homepage_only_contact_path_requires_verification (52); concrete_google_discovered_major_customer_instagram (38); missing_verified_profile_url (32).",
  "recoveryHint": "Refill the high-ICP pool with 3 verified leads or unblock existing website/social leads before the next run. Add a verified Facebook or Instagram profile URL before retrying social outreach. Confirm the official social profile and safe message entry before rerunning Google-discovered social outreach.",
  "recoveryActions": [
    {
      "reason": "daily_queue_goal_not_reached",
      "action": "Refill high-ICP customer pool",
      "description": "Add or unblock 3 verified high-ICP leads to reach the daily 100 target.",
      "hint": "Refill the high-ICP pool with 3 verified leads or unblock existing website/social leads before the next run.",
      "target": 100,
      "potentialPool": 97,
      "refillNeeded": 3
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
    }
  ],
  "systemRefresh": {
    "ok": false,
    "stdout": "",
    "stderr": "node:fs:2413\r\n    return binding.writeFileUtf8(\r\n                   ^\r\n\r\nError: UNKNOWN: unknown error, open 'E:\\New project\\outreach-dashboard\\daily-automation-latest.json'\r\n    at Object.writeFileSync (node:fs:2413:20)\r\n    at writeRunArtifacts (E:\\New project\\outreach-dashboard\\daily-automation-runner.js:873:6)\r\n    at main (E:\\New project\\outreach-dashboard\\daily-automation-runner.js:1428:17)\r\n    at Object.<anonymous> (E:\\New project\\outreach-dashboard\\daily-automation-runner.js:1448:3)\r\n    at Module._compile (node:internal/modules/cjs/loader:1812:14)\r\n    at Object..js (node:internal/modules/cjs/loader:1943:10)\r\n    at Module.load (node:internal/modules/cjs/loader:1533:32)\r\n    at Module._load (node:internal/modules/cjs/loader:1335:12)\r\n    at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)\r\n    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5) {\r\n  errno: -4094,\r\n  code: 'UNKNOWN',\r\n  syscall: 'open',\r\n  path: 'E:\\\\New project\\\\outreach-dashboard\\\\daily-automation-latest.json'\r\n}\r\n\r\nNode.js v24.14.0",
    "error": "Command failed: node E:\\New project\\outreach-dashboard\\daily-automation-runner.js --fix\nnode:fs:2413\r\n    return binding.writeFileUtf8(\r\n                   ^\r\n\r\nError: UNKNOWN: unknown error, open 'E:\\New project\\outreach-dashboard\\daily-automation-latest.json'\r\n    at Object.writeFileSync (node:fs:2413:20)\r\n    at writeRunArtifacts (E:\\New project\\outreach-dashboard\\daily-automation-runner.js:873:6)\r\n    at main (E:\\New project\\outreach-dashboard\\daily-automation-runner.js:1428:17)\r\n    at Object.<anonymous> (E:\\New project\\outreach-dashboard\\daily-automation-runner.js:1448:3)\r\n    at Module._compile (node:internal/modules/cjs/loader:1812:14)\r\n    at Object..js (node:internal/modules/cjs/loader:1943:10)\r\n    at Module.load (node:internal/modules/cjs/loader:1533:32)\r\n    at Module._load (node:internal/modules/cjs/loader:1335:12)\r\n    at wrapModuleLoad (node:internal/modules/cjs/loader:255:19)\r\n    at Module.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:154:5) {\r\n  errno: -4094,\r\n  code: 'UNKNOWN',\r\n  syscall: 'open',\r\n  path: 'E:\\\\New project\\\\outreach-dashboard\\\\daily-automation-latest.json'\r\n}\r\n\r\nNode.js v24.14.0\r\n",
    "visibility": {
      "updatedAt": "2026-07-22T01:14:49.048Z",
      "source": "main-refreshDailyAutomationArtifacts",
      "runDate": "2026-07-22",
      "artifactGeneratedAt": "2026-07-22T01:05:05.525Z",
      "executionGeneratedAt": "2026-07-21T23:11:29.722Z",
      "githubSyncUpdatedAt": "2026-07-21T23:11:50.809Z",
      "counts": {
        "dailyQueue": 97,
        "googleDiscovered": 73,
        "websiteContact": 39,
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
        "potentialPool": 97,
        "refillNeeded": 3,
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
  "completedAt": "2026-07-22T01:14:49.553Z"
};
