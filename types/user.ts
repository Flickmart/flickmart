export interface SessionType {
  access_token?: string;
  expires_at?: number;
  expires_in?: number;
  refresh_token?: string;
  token_type?: string;
}

export interface UserType {
  created_at?: string;
  id?: string;
  email?: string;
  role?: string;
  is_anonymous?: boolean;
  last_sign_in_at?: string;
  phone?: string;
}

export interface UserStore {
  session: SessionType;
  user: UserType;
  updateUserInfo: (user: UserType) => void;
  createSession: (sessionObj: SessionType) => void;
  updateEmail: (email: string) => void;
}


export interface UserSettings {
  user_id: string;
  theme: 'light' | 'dark';
  language: string;
  notifications_enabled: boolean;
  email_notifications: boolean;
  push_notifications: boolean;
  timezone: string;
  currency: string;
  display_name: string;
  profile_picture?: string;
  privacy_settings: {
    profile_visibility: 'public' | 'private' | 'friends';
    show_online_status: boolean;
  };
  business_settings?: {
    company_name?: string;
    business_type?: string;
    tax_id?: string;
    business_address?: string;
    contact_email?: string;
  };
  accessibility_preferences?: {
    high_contrast: boolean;
    font_size: 'small' | 'medium' | 'large';
    reduce_animations: boolean;
    screen_reader_optimized: boolean;
  };
  analytics_preferences?: {
    allow_usage_tracking: boolean;
    share_analytics: boolean;
    personalized_recommendations: boolean;
  };
  personal_info?: {
    full_name?: string;
    date_of_birth?: string;
    address?: string;
    phone_number?: string;
    emergency_contact?: string;
  };
  product_preferences?: {
    favorite_categories: string[];
    preferred_brands: string[];
  };
}