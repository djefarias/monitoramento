export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Contact {
  id?: string;
  name: string;
  alias?: string;
  phone: string;
  notes?: string;
  createdAt?: string;
}

export interface Alert {
  id?: string;
  contactIds: string[];
  message: string;
  timestamp?: string;
}

export interface AlertResult {
  contactId: string;
  contactName: string;
  phone: string;
  status: 'success' | 'error' | 'pending_config';
  errorMessage?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface BrandingConfig {
  appName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
}
