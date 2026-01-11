# Support & Chatbot Discovery

## Stakeholders
- Customers: require quick issue resolution, booking help, FAQ answers.
- Support agents: manage ticket queue, live chats, escalations.
- Provider operations team: receives escalated provider-specific cases.
- Administrators: monitor SLAs, configure workflows, manage AI prompts.

## Customer Support Use Cases
1. Submit new support ticket with category, priority, attachments.
2. Track ticket status and add follow-up messages.
3. Receive notifications on status changes (email/SMS/push).
4. Escalate unresolved cases or request call-back.
5. Browse knowledge base articles before contacting support.

## Agent Experience Use Cases
1. View triaged ticket queues sorted by SLA urgency.
2. Claim/unassign tickets with notes and canned responses.
3. Collaborate via internal notes and transfer between teams.
4. Escalate to provider operations or trigger refunds/work orders.
5. Monitor live chat queue, accept chats, and convert to tickets.

## Live Chat Use Cases
1. Customers initiate chat from web/mobile widget with authentication context.
2. Chatbot handles FAQs, booking assistance, wallet queries.
3. Auto-detect intent and escalate to human agent when confidence low or user requests.
4. Persist transcript, support attachments, and analytics.
5. Provide offline handover to ticket form when agents unavailable.

## AI Chatbot Capabilities
- FAQ search powered by knowledge base embeddings.
- Booking flow assistance (availability lookup, create/reschedule booking).
- Wallet and payment inquiries with secure data fetch.
- Provider discovery suggestions based on intent.
- Sentiment detection to prioritize escalations.

## Compliance & Security Constraints
- Store chat and ticket history with PII encrypted at rest.
- Authenticate via existing JWT tokens; ensure role-based access.
- Log AI prompts/responses for audit with redaction of secrets.
- Respect regional data residency rules for AI provider selection.

## Integrations & Dependencies
- Email/SMS notification service (existing or new queue worker).
- Knowledge base CMS or markdown repo for articles.
- Payment service for refunds and wallet adjustments.
- Booking API for agent actions and chatbot tools.

## Success Metrics
- First response time under 2 minutes for chat, under 2 hours for tickets.
- CSAT above 4.2/5 for resolved interactions.
- Chatbot containment rate ≥ 40% without human handoff.
- SLA breach rate below 5% per week.

## Open Questions
- Preferred notification channels (SMS provider, push service)?
- Required languages beyond English for support content?
- Any third-party compliance audits (SOC 2, ISO 27001) impacting logging and storage?
- Does provider operations need separate dashboard or share agent workspace?
