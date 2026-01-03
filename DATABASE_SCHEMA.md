# Lotus Digital Systems - Database Schema (PostgreSQL)

## Enums
- `user_role`: 'super_admin', 'sales_manager', 'senior_sales_rep', 'finance_user', 'service_engineer', 'customer'
- `lead_status`: 'new', 'warm', 'hot', 'customer', 'junk'
- `quote_status`: 'draft', 'pending_approval', 'approved', 'rejected', 'pi_generated'
- `invoice_status`: 'unpaid', 'partially_paid', 'paid', 'overdue'
- `service_status`: 'open', 'assigned', 'in_progress', 'closed'

## Tables

### 1. Users
- `id`: UUID (PK)
- `email`: VARCHAR(255) (Unique)
- `password_hash`: TEXT
- `name`: VARCHAR(255)
- `role`: user_role
- `contact_number`: VARCHAR(20)
- `created_at`: TIMESTAMP

### 2. Products (Master Catalog)
- `id`: UUID (PK)
- `category`: VARCHAR(100)
- `model_name`: VARCHAR(255)
- `base_price`: DECIMAL(18,2)
- `hsn_sac_code`: VARCHAR(20)
- `gst_rate`: DECIMAL(5,2) (Default 18.00)
- `specifications`: JSONB

### 3. Leads
- `id`: UUID (PK)
- `company_name`: VARCHAR(255)
- `contact_person`: VARCHAR(255)
- `phone`: VARCHAR(20)
- `email`: VARCHAR(255)
- `address`: TEXT
- `gps_coordinates`: POINT (Last visit location)
- `status`: lead_status
- `assigned_to`: UUID (FK -> Users)
- `created_by`: UUID (FK -> Users)

### 4. Quotations (3-Section Structure)
- `id`: UUID (PK)
- `quote_number`: VARCHAR(50) (Unique)
- `lead_id`: UUID (FK -> Leads)
- `version`: INTEGER (Default 1)
- `status`: quote_status
- 
- **Section A: Body (Goods)**
- `body_base_price`: DECIMAL(18,2)
- `body_discount`: DECIMAL(18,2)
- `body_hsn`: VARCHAR(20)
- 
- **Section B: Service (SAC)**
- `service_price`: DECIMAL(18,2)
- `service_sac`: VARCHAR(20)
- 
- **Section C: Accessories (Goods)**
- `accessories_price`: DECIMAL(18,2)
- `accessories_hsn`: VARCHAR(20)
- 
- `total_taxable`: DECIMAL(18,2)
- `total_gst`: DECIMAL(18,2)
- `grand_total`: DECIMAL(18,2)
- `approval_reason`: TEXT
- `approved_by`: UUID (FK -> Users)

### 5. Invoices
- `id`: UUID (PK)
- `invoice_number`: VARCHAR(50) (Unique)
- `quote_id`: UUID (FK -> Quotations)
- `type`: 'proforma', 'tax'
- `amount_due`: DECIMAL(18,2)
- `status`: invoice_status
- `emi_tagged`: BOOLEAN (Default false)
- `interest_accrued`: DECIMAL(18,2) (Default 0)

### 6. Service_Tickets
- `id`: UUID (PK)
- `ticket_number`: VARCHAR(50) (Unique)
- `machine_id`: VARCHAR(100)
- `customer_id`: UUID (FK -> Users)
- `issue_description`: TEXT
- `status`: service_status
- `assigned_engineer`: UUID (FK -> Users)
- `resolution_details`: TEXT
- `is_locked`: BOOLEAN (Sync from Machine/Finance status)

### 7. Audit_Logs
- `id`: UUID (PK)
- `user_id`: UUID (FK -> Users)
- `action`: VARCHAR(255)
- `entity_type`: VARCHAR(50)
- `entity_id`: UUID
- `old_values`: JSONB
- `new_values`: JSONB
- `timestamp`: TIMESTAMP
