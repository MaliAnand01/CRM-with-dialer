import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Diallo | Contact Center CRM & Operations Suite",
  description:
    "Enterprise telecalling CRM, collections dialer, verification services, and NACH processing for Diallo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${dmSans.variable}`} suppressHydrationWarning>
      <body className="h-full font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
