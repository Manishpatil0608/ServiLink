# Software Requirements Specification

## 1. Introduction

### 1.1 Purpose
This document defines the complete software requirements for the Local Services Platform. It communicates functional, non-functional, and data requirements to stakeholders, product owners, designers, and engineering teams. The specification serves as the baseline for planning, implementation, validation, and maintenance.

### 1.2 Scope
The platform enables customers to book on-demand home services, allows service providers to manage operations, empowers service administrators to monitor escalations, and gives super administrators governance tools. The system spans a web frontend built with Vite and React, a Node.js/Express backend, a MySQL database, and auxiliary services such as Redis and Google OAuth.

### 1.3 Definitions, Acronyms, Abbreviations
- API: Application Programming Interface
- SLA: Service Level Agreement
- JWT: JSON Web Token
- HMR: Hot Module Reloading
- KYC: Know Your Customer compliance procedure
- CRUD: Create, Read, Update, Delete operations

### 1.4 References
- Backend entry point: backend/src/server.js
- Environment handling: backend/src/config/env.js
- Authentication module: backend/src/modules/auth
- User management module: backend/src/modules/users
- Frontend dashboards: frontend/src/pages/*.jsx
- Database schema migrations: backend/src/database/migrations
- Sample dataset seed: backend/src/database/seeds/003_full_sample_dataset.js

## 2. Overall Description

### 2.1 Product Perspective
The system is a multi-tenant service orchestration platform. The frontend consumes REST APIs exposed by the backend. The backend orchestrates MySQL for persistence and Redis for caching/session management. Google OAuth provides optional federated authentication.

### 2.2 Product Functions
- Secure authentication and session management for all user roles
- Role-based dashboards with business intelligence widgets
- Service catalog browsing, booking flows, and wallet management
- Provider availability planning and performance monitoring
- Administrative oversight of escalations, SLAs, and compliance
- Support ticketing workflows and notifications

### 2.3 User Classes and Characteristics
- **Customer:** Books services, tracks orders, manages wallets.
- **Service Provider:** Manages bookings, schedules crews, analyzes payouts and satisfaction.
- **Service Administrator:** Monitors escalations, SLA breaches, regional performance.
- **Super Administrator:** Oversees platform-wide metrics, policy enforcement, settlements.
- **Support Agent (future):** Resolves tickets, communicates with customers and providers.

### 2.4 Operating Environment
- Backend: Node.js v18+ (tested on v21), Express, runs on Windows 11 development environment and Linux containers in production.
- Frontend: Vite dev server during development, static build served via CDN or Node middleware in production.
- Database: MySQL 8.0 managed via Docker Compose in development; managed MySQL in production.
- Cache/Session: Redis 7 for storing refresh tokens and rate limiting counters.
- Browser Support: Latest Chrome, Edge, and Firefox; mobile-responsive layout planned.

### 2.5 Design and Implementation Constraints
- JWT secrets and database credentials must be supplied through environment variables.
- Rate limiting is enforced via express-rate-limit to protect APIs.
- Passwords hashed with bcrypt using a minimum of 12 salt rounds.
- Infrastructure must support hot reload in development (Vite HMR, nodemon).
- Docker Desktop required locally for MySQL and Redis services.

### 2.6 Assumptions and Dependencies
- Users have stable internet connectivity during booking flows.
- Payment gateways are integrated later; current implementation mocks captured payments.
- Email/SMS notification services will be connected after MVP.
- Google OAuth client configuration is optional; local login remains primary.

## 3. System Features

Each feature entry includes a description and enumerated functional requirements (FR-x.y).

### 3.1 Authentication and Access Control
- **Description:** Provide secure login, logout, registration, and token refresh for role-based access.
- **Functional Requirements:**
  - FR-1.1: The system shall authenticate users via email or phone plus password.
  - FR-1.2: The system shall issue JWT access and refresh tokens on successful login.
  - FR-1.3: The system shall validate refresh tokens and rotate them on each refresh.
  - FR-1.4: The system shall revoke refresh tokens on logout and password reset.
  - FR-1.5: The system shall support Google OAuth sign-in when credentials are configured.

### 3.2 Customer Service Booking
- **Description:** Allow customers to browse services, create bookings, and view status.
- **Functional Requirements:**
  - FR-2.1: Customers shall view service categories and detailed offerings.
  - FR-2.2: Customers shall submit booking requests specifying preferred schedule windows.
  - FR-2.3: The system shall calculate totals including applicable tax rates per service.
  - FR-2.4: Customers shall view booking history and track status updates.
  - FR-2.5: The system shall debit customer wallets or mark payments as pending.

### 3.3 Provider Operations Dashboard
- **Description:** Enable providers to manage schedules, payouts, and satisfaction insights.
- **Functional Requirements:**
  - FR-3.1: Providers shall view upcoming bookings and availability slots.
  - FR-3.2: Providers shall track payout forecasts and release windows.
  - FR-3.3: Providers shall monitor customer satisfaction trends and review feedback summaries.
  - FR-3.4: Providers shall update availability calendars and mark exceptional downtime.

### 3.4 Service Administrator Control Center
- **Description:** Provide regional admins with escalation tracking and SLA compliance metrics.
- **Functional Requirements:**
  - FR-4.1: Service admins shall view live escalation heat maps categorized by service type.
  - FR-4.2: Service admins shall view SLA breach leaderboards and schedule coaching actions.
  - FR-4.3: Service admins shall receive alerts when open escalations exceed thresholds.
  - FR-4.4: Service admins shall export escalation summaries for compliance reviews.

### 3.5 Super Administrator Oversight
- **Description:** Support global governance, policy monitoring, and settlements.
- **Functional Requirements:**
  - FR-5.1: Super admins shall access platform-wide KPIs (GMV, active users, NPS).
  - FR-5.2: Super admins shall review risk events and audit activity logs.
  - FR-5.3: Super admins shall manage role assignments and suspend or reactivate accounts.
  - FR-5.4: Super admins shall approve bulk settlements for high-value bookings.

### 3.6 Wallet and Payments Management
- **Description:** Track monetary flows across customers and providers.
- **Functional Requirements:**
  - FR-6.1: The system shall maintain wallet balances per user.
  - FR-6.2: The system shall record payment transactions with status and method metadata.
  - FR-6.3: The system shall reconcile payouts against completed bookings.
  - FR-6.4: The system shall enforce idempotency for payment callbacks.

### 3.7 Support and Notifications
- **Description:** Handle ticket lifecycle and deliver critical alerts.
- **Functional Requirements:**
  - FR-7.1: Users shall create support tickets with category, severity, and description.
  - FR-7.2: Support agents shall update ticket status and append internal or external notes.
  - FR-7.3: The system shall send in-app notifications for escalations, bookings, and payouts.
  - FR-7.4: The system shall log communication history for auditing purposes.

## 4. External Interface Requirements

### 4.1 User Interfaces
- Responsive React SPA served via Vite during development and static assets in production.
- Dashboard widgets leverage Tailwind-styled cards, tables, and summary strips.
- Providers view payout forecasts and satisfaction cards; service admins view heat maps and leaderboards.

### 4.2 API Interfaces
- RESTful endpoints under `/api/v1`, secured with JWT Bearer tokens.
- Authentication endpoints: `/auth/login`, `/auth/register`, `/auth/refresh`, `/auth/logout`, `/auth/google`.
- Booking endpoints: `/bookings`, `/bookings/:id`, `/bookings/:id/status`.
- Admin dashboards: `/admin/escalations`, `/admin/sla`, `/admin/kpis` (planned).
- Supports JSON payloads and HTTP status codes aligned with RFC 9110.

### 4.3 Database Interfaces
- Primary relational store: MySQL 8 using Knex.js query builder.
- Schema managed via migration scripts for tables such as `users`, `bookings`, `payments`, `service_providers`, `service_admins`, `super_admins`, `wallets`, and `availability`.
- Seeder scripts populate realistic sample data for development and demos.

### 4.4 External Systems
- Redis 7 stores refresh tokens and rate limit counters.
- Google OAuth 2.0 ID tokens optionally validate Google identities.
- Future integrations: Payment gateway webhooks, SMS/Email notification services.

## 5. Non-functional Requirements

### 5.1 Performance
- API endpoints shall respond within 300 ms P95 under normal load.
- Authentication endpoints shall handle at least 100 concurrent login attempts with queueing.
- Batch dashboards shall pre-aggregate statistics to avoid queries exceeding 1 second.

### 5.2 Security
- All credentials stored hashed (bcrypt 12+ rounds) with salted hashes.
- JWT secrets stored outside the codebase; refresh tokens hashed before persistence.
- Rate limiting in place to mitigate brute-force attacks.
- Enforce HTTPS in production and secure cookies for frontend session persistence.

### 5.3 Reliability and Availability
- System shall support graceful shutdown to avoid request loss.
- Database operations use transactions for multi-table mutations.
- Backup policy: nightly MySQL dumps and hourly Redis snapshots (planned).

### 5.4 Maintainability
- Backend modules follow domain-based folders for cohesion.
- ESLint configured for frontend and backend to enforce code style.
- Unit tests via Jest and Supertest; future E2E tests planned using Playwright.

### 5.5 Usability
- Dashboards provide descriptive headings, consistent typography, and accessible color contrast.
- Critical actions include confirmation prompts and contextual hints.
- Support mobile breakpoints for 360px width and above.

### 5.6 Compliance
- Store personally identifiable information (PII) according to local data protection laws.
- Maintain audit logs for admin actions exceeding severity thresholds.

## 6. Data Requirements
- User entity includes email, phone, role, status, profile metadata, and wallet linkage.
- Service catalog stores category, pricing, tax rate, availability windows, and geographical reach.
- Booking records reference customers, providers, services, scheduled windows, and payment status.
- Escalation data stores severity, SLA timers, assigned admins, and resolution notes.
- All timestamps recorded in ISO 8601 with UTC storage.

## 7. Operational Scenarios
- **Customer Booking:** Customer logs in, selects service, schedules slot, confirms payment, receives confirmation notification.
- **Provider Dispatch:** Provider reviews new booking, acknowledges schedule, updates availability, views payout forecast.
- **Escalation Handling:** Service admin receives alert, inspects heat map, assigns responder, tracks resolution timer.
- **Super Admin Review:** Super admin checks KPI dashboards, audits high-risk bookings, approves settlement batch.

## 8. Acceptance Criteria and Testing Strategy
- Unit tests cover authentication flows, booking lifecycle, payout calculations, and escalation metrics.
- Integration tests validate REST endpoints end-to-end with seeded data.
- Load tests (e.g., autocannon at 100 concurrent connections) must sustain throughput with <5% errors.
- Manual UAT scripts ensure dashboards render expected widgets and data states for each role.

## 9. Future Enhancements
- Introduce real-time WebSocket updates for escalations and booking status.
- Integrate third-party payment gateway with webhook reconciliation.
- Add AI-powered support chatbot leveraging service knowledge base.
- Provide mobile apps using shared REST APIs and JWT authentication.

## Appendix A: Glossary
- **Booking Code:** Unique alphanumeric identifier for each scheduled service.
- **Escalation:** A customer or provider issue exceeding predefined thresholds.
- **GMV:** Gross Merchandise Value, total monetary value of completed bookings.
- **KYC:** Verification process for provider compliance and fraud prevention.
- **Payout:** Transfer of funds from platform to provider for completed services.
- **SLA Breach:** Failure to resolve an escalation or booking within agreed time limits.
