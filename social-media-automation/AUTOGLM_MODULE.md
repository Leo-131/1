# AutoGLM Outreach Automation Module

## Overview
Automated multi-platform outreach for Flextail Gear distributors/retailers.

## Platforms
- **LinkedIn**: Connection requests + Direct messages
- **Facebook**: Group posts + DMs to members
- **Instagram**: DMs to brand accounts

## Configuration

```yaml
target: 100 messages/day
platforms:
  linkedin:
    search_keywords:
      - "outdoor gear importer"
      - "outdoor gear distributor"
      - "camping equipment buyer"
    message_template: |
      Hi! I'm Leo from Flextail - #1 Ultralight Outdoor Electronics on Amazon.
      We're expanding globally and looking for distribution partners.
      Open to a quick chat?
    connection_limit: 50/day (free account)
    
  facebook:
    groups:
      - id: 2085210848314277
        name: "Outdoor Gear Buy/Sell Community"
        members: 59000
      - id: 462603894671701
        name: "USA Outdoor Gears Sale"
        members: 5024
    post_template: |
      🔥 Flextail Gear - Ultralight Outdoor Electronics!
      #1 on Amazon. Looking for US distributors!
      DM for wholesale pricing.
      
  instagram:
    hashtags:
      - "#outdoorgear"
      - "#campinggear"
    dm_template: |
      Hey! Love your outdoor content 🏕️
      We're Flextail - ultralight camping electronics.
      Open to collaboration? 🤝
```

## Workflow

### LinkedIn
1. Search by keyword
2. Filter by connection degree (2nd, 3rd+)
3. Click Connect → Send without note (free account limit)
4. For 1st degree: Send direct message

### Facebook
1. Navigate to group
2. Click "Write something..."
3. Paste template
4. Publish
5. Comment on recent posts (optional)

### Instagram
1. Search hashtag
2. Click brand account
3. Click "Message"
4. Send DM template

## Session State

```json
{
  "current_platform": "linkedin",
  "search_keyword": "outdoor gear importer",
  "page": 1,
  "actions_today": 8,
  "target": 100,
  "last_action": "2026-04-08T13:10:00"
}
```

## Error Handling
- LinkedIn note limit → Auto "Send without note"
- Rate limit → Wait 60s, retry
- Login required → Prompt user

## Integration
- OpenClaw browser control (CDP)
- Vercel dashboard sync
- Git version control

## Changelog
- 2026-04-08: v8.1 - Multi-platform automation
- 2026-04-03: v8.0 - Dashboard refactor