'use client';

import { useEffect } from 'react';
import { applyBrandingColors } from '@/lib/branding';

export function BrandingInitializer() {
  useEffect(() => {
    applyBrandingColors();
  }, []);
  return null;
}
