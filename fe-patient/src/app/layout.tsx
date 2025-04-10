import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/providers";

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
