export interface Plan {
  id: string;
  name: string;
  price: number;
  professionals_count: number;
  created_at?: string;
}

export interface Barbershop {
  id: string;
  name: string;
  address: string;
  phone: string;
  plan_id: string;
  password?: string;
  status: 'active' | 'blocked';
  created_at?: string;
  plan?: Plan;
  bio?: string;
  photo1?: string;
  photo2?: string;
  photo3?: string;
  logo_url?: string;
  banner_url?: string;
  display_name?: string;
  whatsapp?: string;
  reminder_lead_time_minutes?: number;
  slug?: string;
}

export interface SubscriptionPlan {
  id: string;
  barbershop_id: string;
  name: string;
  price: number;
  limit_count: number;
  service_id: string;
  created_at?: string;
  service?: Service;
}

export interface Client {
  id: string;
  barbershop_id: string;
  name: string;
  phone: string;
  password?: string;
  plan_id?: string | null;
  created_at?: string;
  subscription_plan?: SubscriptionPlan;
  push_subscription?: string;
  notifications_enabled?: boolean;
}

export interface Service {
  id: string;
  barbershop_id: string;
  name: string;
  price: number;
  duration_minutes: number;
  professional_ids?: string[];
  created_at?: string;
}

export interface Professional {
  id: string;
  barbershop_id: string;
  name: string;
  phone: string;
  password?: string;
  commission_percentage?: number;
  photo_url?: string;
  working_hours_type?: 'shop' | 'custom';
  custom_start_time?: string;
  custom_end_time?: string;
  created_at?: string;
}

export interface Appointment {
  id: string;
  barbershop_id: string;
  professional_id: string;
  service_id: string;
  customer_name: string;
  customer_phone: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at?: string;
  service?: Service;
  professional?: Professional;
}
