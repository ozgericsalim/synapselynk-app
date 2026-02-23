export type UserRole = 'admin' | 'manager' | 'employee' | 'expert';

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Company {
  id: string;
  name: string;
  sector?: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  contract_start?: string;
  contract_end?: string;
  max_employees: number;
  is_active: boolean;
  created_at: string;
}

export interface Employee {
  id: string;
  profile_id: string;
  company_id: string;
  department_id?: string;
  position?: string;
  start_date: string;
  is_active: boolean;
  profile?: Profile;
  company?: Company;
}

export interface Expert {
  id: string;
  profile_id: string;
  branch: string;
  title?: string;
  bio?: string;
  session_fee: number;
  is_available: boolean;
  profile?: Profile;
}

export interface Notification {
  id: string;
  profile_id: string;
  title: string;
  content?: string;
  notification_type: string;
  is_read: boolean;
  link?: string;
  created_at: string;
}
