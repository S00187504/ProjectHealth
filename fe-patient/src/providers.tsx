'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { DashboardProvider } from '@/context/DashboardContext';
import { ThemeProvider } from '@/components/theme-provider';
import { FormProvider } from '@/context/formContext';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <DashboardProvider>
          <FormProvider>
            {children}
          </FormProvider>
        </DashboardProvider>
      </AuthProvider>
    </ThemeProvider>
  );
} 