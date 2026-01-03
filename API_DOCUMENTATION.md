# Lotus Digital Systems - API Documentation

## Base URL: `https://api.lotus-digital.com/v1`

## 1. Authentication
- `POST /auth/login`: `{email, password}` -> `{jwt, user_profile}`
- `POST /auth/refresh`: Refresh expired tokens.
- `GET /auth/me`: Current user session details.

## 2. Lead Management
- `GET /leads`: List leads (Filtered by role).
- `POST /leads`: Create new lead (Duplicate detection on phone/company).
- `PATCH /leads/{id}/assign`: Assign lead to sales rep (Manager only).
- `POST /leads/{id}/check-in`: Log visit with GPS coordinates `{lat, lng, radius_check: bool}`.

## 3. Quotation Pricing Engine
- `GET /catalog`: Fetch machine models and parts catalog.
- `POST /quotes`: Build draft quote.
- `POST /quotes/{id}/submit`: Submit for approval. Enforces 3-section logic.
- `GET /quotes/{id}/versions`: View history of revisions.
- `PATCH /quotes/{id}/approve`: Sales Manager approval. Freezes configuration.

## 4. Accounting & GST
- `GET /accounting/invoices`: List PIs and Tax Invoices.
- `POST /accounting/invoices/convert`: Convert Approved Quote -> PI or Tax Invoice.
- `POST /accounting/payments`: Record receipt (Partial/Full).
- `GET /accounting/aging`: Finance report for overdue machines.

## 5. EMI & Interests
- `GET /accounting/statement/{customer_id}`: Detailed statement with 18% p.a. interest calculations for delayed payments.
- `PATCH /accounting/machines/{id}/lock`: Financial lock/unlock trigger.

## 6. Service Tracking
- `GET /service/tickets`: List based on engineer/customer role.
- `POST /service/tickets`: Raise request with photos.
- `PATCH /service/tickets/{id}/status`: Workflow transition (Open -> In Progress -> Closed).
- `PATCH /service/tickets/{id}/resolve`: Mandatory resolution note + photo before closing.

## 7. Audit & Reports
- `GET /admin/audit-logs`: History of all financial/pricing changes.
- `GET /reports/sales-kpi`: Summary for Super Admin.
