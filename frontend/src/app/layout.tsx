import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { branding, applyBrandingColors } from '@/lib/branding';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'JRF SecureNotify',
  description: 'Sistema de envio de alertas via WhatsApp',
};

function BrandingInitializer() {
  useEffect(() => {
    applyBrandingColors();
  }, []);
  return null;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              const primaryColor = '${branding.primaryColor}';
              const secondaryColor = '${branding.secondaryColor}';
              document.documentElement.style.setProperty('--color-primary', primaryColor);
              document.documentElement.style.setProperty('--color-secondary', secondaryColor);
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
