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
