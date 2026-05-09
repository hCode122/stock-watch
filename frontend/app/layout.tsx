import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./ReduxProvider";
import { Toaster } from "@/components/ui/sonner"
import { AuthWrapper } from "./components/misc/AuthWrapper";
const roboto = Roboto({
  weight: ['300', '400', '500', '700'], 
  subsets: ['latin'],
  display: 'swap', 
  variable: '--font-roboto', 
});

export const metadata: Metadata = {
  title: "StockWatch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${roboto.variable} antialiased`}
      >
      <ReduxProvider>
        <AuthWrapper>
                {children}
        </AuthWrapper>
      </ReduxProvider>
      <Toaster />
      </body>
    </html>
  );
}
