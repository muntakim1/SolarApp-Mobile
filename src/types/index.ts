/**
 * SolventZ — Shared TypeScript Types
 * Centralized type definitions matching the database schema.
 */

// ─── Enums ──────────────────────────────────────────────

export type UserRole = 'customer' | 'admin' | 'support_agent' | 'super_admin';
export type OrderStatus = 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'bank_transfer' | 'cod' | 'online_payment';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type PropertyType = 'residential' | 'commercial' | 'industrial' | 'agricultural';
export type SurveyStatus = 'new' | 'scheduled' | 'completed' | 'quote_sent' | 'accepted' | 'declined';
export type TicketCategory = 'product_defect' | 'installation_issue' | 'billing' | 'general';
export type TicketStatus = 'open' | 'in_review' | 'awaiting_customer' | 'resolved' | 'closed';

// ─── Entities ───────────────────────────────────────────

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  city: string | null;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon_url: string | null;
  is_active: boolean;
}

export interface Product {
  id: string;
  category_id: string;
  sku: string;
  name: string;
  brand: string;
  description: string;
  specifications: Record<string, string>;
  price: number;
  stock_quantity: number;
  images: string[];
  is_active: boolean;
  is_deleted: boolean;
  created_at: string;
}

export interface DeliveryAddress {
  street: string;
  city: string;
  province: string;
  postal_code: string;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  delivery_address: DeliveryAddress;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  subtotal: number;
  delivery_fee: number;
  grand_total: number;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_snapshot: { name: string; sku: string; price: number };
  quantity: number;
  unit_price: number;
  line_total: number;
}

export interface Survey {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  property_type: PropertyType;
  address: string;
  monthly_bill: number;
  preferred_date: string;
  notes: string | null;
  status: SurveyStatus;
  scheduled_at: string | null;
  quote_amount: number | null;
  quote_details: any;
  created_at: string;
}

export interface SupportTicket {
  id: string;
  user_id: string;
  order_id: string | null;
  assigned_to: string | null;
  category: TicketCategory;
  subject: string;
  description: string;
  attachments: string[] | null;
  status: TicketStatus;
  resolved_at: string | null;
  created_at: string;
}
