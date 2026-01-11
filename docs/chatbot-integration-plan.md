# AI Chatbot Integration Plan

## Objectives
- Provide 24/7 conversational support for FAQs, booking assistance, and account queries.
- Reduce live agent load while ensuring seamless human handoff.
- Maintain data privacy by proxying all AI interactions through backend services.

## Architecture Overview
1. **Frontend Widget**
   - React component embedded in Support page and floating launcher.
   - Supports authentication context, conversation history view, escalation button.
   - Connects to backend via REST for initialization and websocket for live updates.
2. **Conversation Service (Backend)**
   - Manages chat sessions, stores transcripts, orchestrates AI vs human routing.
   - Maintains short-lived session tokens for frontend connections.
   - Interfaces with AI provider via proxy module.
3. **AI Proxy Module**
   - Wraps external LLM API (OpenAI GPT-4.5 / Azure OpenAI) using server-side key.
   - Handles prompt templating, tool execution, safety filters, and usage logging.
4. **Tool Runtime**
   - Exposes server functions (booking lookup, ticket creation, knowledge base search) via secure adapters.
   - Uses role-aware access controls and rate limiting.
5. **Escalation Engine**
   - Detects handoff triggers (intent, sentiment, repeated failure).
   - Creates support ticket and notifies agent queue when escalation required.

## Conversation Flow
1. User opens widget → frontend requests `POST /support/chat/session` to obtain session token.
2. Subsequent messages sent via websocket `send_message` events.
3. Backend enriches message with customer profile, queries AI proxy.
4. AI response optionally includes `tool_calls` executed by backend; results feed into follow-up AI turn.
5. Conversation stored in `support_chat_messages`; selective entries mirrored to `support_ai_interactions` for analytics.
6. Escalation event triggers ticket creation and agent notification; widget switches to human chat or ticket tracking.

## Prompt & Knowledge Strategy
- System prompt defines persona, tone, escalation rules, and compliance boundaries.
- Retrieve top knowledge base articles via vector search (OpenSearch/PGVector) as context.
- Inject real-time data (booking status, wallet balance) through tool outputs rather than raw DB dumps.
- Redact sensitive fields before logging prompts/responses.

## Safety & Guardrails
- Pre-filter user input for PII exposure requests, self-harm, abuse; escalate to human or show hotline prompt.
- Enforce output moderation using provider moderation endpoint or custom rules.
- Limit conversation length; rotate session tokens after inactivity.
- Cap token usage per customer per day, with monitoring dashboard.

## Provider Selection
- Primary: OpenAI GPT-4.5 via Assistants API for function calling and retrieval.
- Alternate: Azure OpenAI (same API) for regional compliance fallback.
- Configuration driven by environment variables `AI_PROVIDER`, `OPENAI_API_KEY`, `AZURE_OPENAI_ENDPOINT`, etc.

## Deployment Considerations
- Run conversation service as separate module (`support/chatbot`) within backend project structure.
- Use message queue (Redis streams or RabbitMQ) for background tool tasks if latency tolerates.
- Enable horizontal scaling by storing session state in Redis and broadcasting via pub/sub.

## Analytics & Metrics
- Log tokens, latencies, containment rate, escalation count.
- Surface dashboard with funnel (AI handled vs escalated), user satisfaction (thumbs up/down prompt).
- Capture transcripts for training with user consent.

## Implementation Milestones
1. Build conversation & AI proxy services with mock provider.
2. Develop frontend widget with session management and basic UI.
3. Integrate knowledge base retrieval and booking lookup tool.
4. Implement escalation pipeline and ticket linkage.
5. Add moderation, analytics, and admin controls.
6. Conduct staging tests, load testing, and rollout.
