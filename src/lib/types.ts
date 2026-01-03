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
export type LeadSource = 'referral' | 'website' | 'walk-in' | 'social_media' | 'exhibition';

export interface Lead {
    id: string;
    customerName: string;
    companyName: string;
    mobile: string;
    email?: string;
    address: string;
    status: LeadStatus;
    source: LeadSource;
    productInterest: string[];
    notes?: string;
    followUpDate: string; // Mandatory
    assignedTo?: string; // User ID
    createdAt: string;
    lastActivity: string;
    photos?: string[];
}

export interface MachineConfig {
    baseModel: string;
    printheadType: string;
    printheadQuantity: number;
    width: string; // e.g., "3.2m"
    accessories: string[];
}

export interface QuotePricing {
    bodyBillable: number;
    extendedService: number; // Installation, training, warranty
    accessories: number;
    discountAmount: number;
    discountSection: 'body' | 'service' | 'accessories' | null;
}

export type QuoteStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'converted';

export interface Quote {
    id: string;
    leadId: string;
    version: number;
    config: MachineConfig;
    pricing: QuotePricing;
    totalAmount: number;
    status: QuoteStatus;
    createdBy: string; // User ID
    createdAt: string;
}

export interface Visit {
    id: string;
    leadId: string;
    scheduledAt: string;
    checkedInAt?: string;
    gps?: {
        lat: number;
        lng: number;
        verified: boolean;
    };
    notes?: string;
    photos?: string[];
    completed: boolean;
}
