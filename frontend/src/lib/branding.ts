import { BrandingConfig } from '@/types';

export const branding: BrandingConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'JRF SecureNotify',
  logoUrl: process.env.NEXT_PUBLIC_LOGO_URL || '/logo-placeholder.svg',
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR || '#3B82F6',
  secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR || '#1E40AF',
};

export const applyBrandingColors = () => {
  if (typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--color-primary', branding.primaryColor);
    document.documentElement.style.setProperty('--color-secondary', branding.secondaryColor);
  }
};
