export interface SignupData {
    email: string;
    firstname: string;
    lastname: string;
    password: string
      confirmPassword: string;
}

export interface SigninData {
    email: string;
    password: string;
}

export interface User {
  id: string;
  email: string;
      firstname: string;
    lastname: string;
  password_hash: string;
  created_at: Date;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: Omit<User, 'password_hash'>;
    token: string;
  };
  error?: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}