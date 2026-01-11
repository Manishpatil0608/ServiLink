# Support Platform Backend Design

## Data Model Additions

### Tables
- `support_categories`
  - Fields: `id`, `slug`, `name`, `description`, `is_active`, timestamps.
- `support_tickets`
  - Fields: `id`, `public_id`, `customer_id`, `provider_id`, `category_id`, `status`, `priority`, `source` (chat, email, web), `subject`, `description`, `assigned_agent_id`, `sla_due_at`, `closed_at`, timestamps.
- `support_ticket_messages`
  - Fields: `id`, `ticket_id`, `sender_type` (customer, agent, system, ai_bot), `sender_id`, `body`, `attachments`, `is_internal`, timestamps.
- `support_ticket_events`
  - Fields: `id`, `ticket_id`, `event_type`, `performed_by`, `metadata` (JSON), timestamps for audit trail.
- `support_agents`
  - Fields: `id`, `user_id`, `team`, `status` (active, away), `max_concurrent_chats`.
- `support_chat_sessions`
  - Fields: `id`, `session_token`, `customer_id`, `status`, `started_at`, `ended_at`, `assigned_agent_id`, `last_message_at`.
- `support_chat_messages`
  - Fields: `id`, `session_id`, `sender_type`, `sender_id`, `body`, `payload` (JSON for structured data), timestamps.
- `support_knowledge_articles`
  - Fields: `id`, `slug`, `title`, `content_markdown`, `tags`, `is_published`, `published_at`.
- `support_ai_interactions`
  - Fields: `id`, `session_id`, `ticket_id`, `model`, `prompt`, `response`, `latency_ms`, `confidence_score`, timestamps.

### Indexing & Constraints
- Composite indexes on `support_tickets(status, priority)`, `support_tickets(assigned_agent_id, status)`.
- Full-text search indexes on `support_ticket_messages.body` and `support_knowledge_articles.content_markdown`.
- Foreign key cascade deletes for messages/events tied to tickets/sessions.
- Encrypt PII columns (customer contact) using application-layer encryption if required.

## Domain Logic

### Ticket Lifecycle
1. `open` → `in_progress` → `pending_customer` → `resolved` → `closed`.
2. Allow transitions via service layer enforcing SLA updates and event logging.
3. Auto-escalate when `sla_due_at` is breached (queue job updates status and notifies team).
4. Tickets can be spawned from chat sessions or direct form submissions.

### Prioritization
- Priority levels: `low`, `normal`, `high`, `urgent`.
- Determine default priority via rules engine (category, sentiment, customer tier).
- SLA targets stored per priority/ category (e.g., urgent = 15 min first response).

### Assignment
- Round-robin assignment within agent team or skill-based routing.
- Agents can claim unassigned tickets; transitions recorded in events table.
- Vacation/away statuses respected via `support_agents.status`.

## API Endpoints

### Customer APIs
- `POST /support/tickets` – create ticket (requires auth, supports attachments, chatbot context ID).
- `GET /support/tickets` – list tickets (filter by status, pagination).
- `GET /support/tickets/:publicId` – fetch ticket with messages.
- `POST /support/tickets/:publicId/messages` – add user reply.

### Agent APIs (protected by `support_agent` role)
- `GET /support/agent/tickets` – queue view with filters (status, priority, category, SLA).
- `PATCH /support/agent/tickets/:id` – update status, priority, assignment.
- `POST /support/agent/tickets/:id/messages` – add agent reply or internal note (`is_internal=true`).
- `POST /support/agent/tickets/:id/escalate` – escalate to provider operations.
- `GET /support/agent/dashboard` – metrics overview, workloads.

### Chat APIs & Websocket
- `POST /support/chat/session` – create chat session (returns websocket token, session ID).
- `WS /support/chat/connect` – authenticate via JWT + session token; supports message, typing, presence events.
- `POST /support/chat/session/:id/transfer` – escalate to ticket or agent.

### Knowledge Base APIs
- `GET /support/articles` – public list with search.
- `GET /support/articles/:slug` – fetch article (cached, pre-rendered).
- Admin CRUD endpoints for managing articles.

### AI Proxy APIs
- `POST /support/ai/query` – backend-proxied AI call (requires chat session or ticket context, logs interaction).
- `POST /support/ai/tools/:toolId` – execute server-side tool (e.g., booking lookup) with RBAC.

## Background Jobs & Events
- `ticket-sla-monitor`: checks approaching breaches, notifies agents.
- `chat-session-archive`: converts inactive sessions to tickets, persists transcripts.
- `knowledge-embedding-sync`: updates vector store for chatbot retrieval.
- `ai-usage-monitor`: aggregates token usage, detects anomalies.

## Security & Compliance
- Enforce access checks per ownership (customer vs agent vs admin).
- Rate-limit ticket creation and AI endpoints.
- Sanitize HTML in messages; store attachments via signed URLs (S3/GCS) with virus scanning.
- Audit logs via `support_ticket_events` and centralized logging pipeline.
- Secrets (AI keys, notification providers) loaded via environment variables/secret manager with rotation.

## Integration Points
- Reuse existing notification service (email/SMS) for ticket updates and chat escalations.
- Hook into booking/payment modules for refunds or schedule adjustments triggered via support workflows.
- Provide webhooks for third-party CRM integration (optional future step).
