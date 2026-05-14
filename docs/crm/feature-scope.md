# Trade CRM Feature Scope

## V1 Positioning

Build an executable first version of a foreign-trade CRM inspired by mature systems such as Fumasoft and OKKI/Xiaoman, without copying their UI or proprietary behavior. The first version focuses on the core sales loop: account asset management, opportunity progression, follow-up discipline, communication memory, order visibility, and manager-level forecasting.

## Competitive Feature Signals

- Fumasoft publicly lists foreign-trade modules around buyer acquisition, customer management, public-pool customers, email, opportunity management, WhatsApp/social communication, product management, lead management, quotation, sample, order, payment verification, export process, and AI assistants.
- OKKI/Xiaoman publicly positions OKKI around multi-channel customer development, intelligent marketing conversion, private-domain customer operations, data-driven management decisions, team quality inspection, AI customer profiles, dynamic monitoring, high-value customer identification, and AI data assistant workflows.

## V1 Modules Delivered

- Customer pool with search, status filter, tags, owner, country, score, tier, and next action
- Account detail panel with contact, value, recent contact date, risk, notes, and current opportunity
- Pipeline board with stage totals and stage advancement
- Follow-up task center with due dates, priority, completion, and overdue metrics
- Communication timeline with typed records
- Order table with delivery status and margin
- AI-ready insight panel based on customer score and overdue state
- Local persistence and JSON export

## Roadmap

1. Backend: Node/Express or Fastify API, PostgreSQL schema, migration scripts, audit log.
2. Auth: tenant isolation, roles, permission matrix, owner/team visibility rules.
3. Data ingestion: CSV import, mailbox connector, WhatsApp webhook, duplicate merge.
4. CRM rules: public pool claim/recycle rules, customer protection period, assignment rules.
5. Sales execution: quotation, sample, order, payment, shipment, approval workflow.
6. AI layer: account profile summary, intent detection, reply drafting, pipeline risk alerts, natural language reporting.
7. Deployment: GitHub Actions checks, hosted preview, production environment variables.
