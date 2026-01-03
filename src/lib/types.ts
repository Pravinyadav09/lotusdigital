export type UserRole =
    | 'super_admin'
    | 'sales_manager'
    | 'senior_sales_rep'
    | 'finance_user'
    | 'service_engineer'
    | 'customer';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    avatar?: string;
}

export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed';

export interface Lead {
    id: string;
    customerName: string;
    companyName: string;
    mobile: string;
    status: LeadStatus;
    productInterest: string[];
    assignedTo?: string; // User ID
    createdAt: string;
    lastActivity: string;
}

export interface MachineConfig {
    baseModel: string;
    printheadType: string;
    printheadQuantity: number;
    width: string; // e.g., "3.2m"
    accessories: string[];
}

export type QuoteStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'converted';

export interface Quote {
    id: string;
    leadId: string;
    version: number;
    config: MachineConfig;
    totalAmount: number;
    status: QuoteStatus;
    createdAt: string;
}
