'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { DashboardProvider } from '@/context/DashboardContext';
import { ThemeProvider } from '@/components/theme-provider';
import { FormProvider } from '@/context/formContext';

interface ProvidersProps {
  children: ReactNode;
}

/**
 * Global Providers Component
 * 
 * Centralizes all context providers for the application:
 * - ThemeProvider: Manages dark/light mode with system preference detection
 * - AuthProvider: Handles user authentication state and methods
 * - DashboardProvider: Provides dashboard-specific state and data
 * - FormProvider: Manages multi-step form state across components
 * 
 * This component wraps the entire application to ensure all contexts
 * are available throughout the component tree.
 */
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
