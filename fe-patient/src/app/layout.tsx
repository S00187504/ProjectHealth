import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers";

/**
 * Root Layout
 * 
 * This is the main layout wrapper for the entire application.
 * It includes the Providers component which sets up:
 * - Theme provider for dark/light mode
 * - Authentication context
 * - Other global contexts and providers
 */
export const metadata: Metadata = {
  title: "Patient Portal",
  description: "Patient Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
