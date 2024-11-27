import { Toaster } from "@/components/ui/toaster";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Provider from "./Provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Crediflex",
  description: "Loan more, earn more",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <nav className="flex justify-between w-full p-4">
            <div className="flex-grow"></div>
            <div className="items-end">
              <ConnectButton />
            </div>
          </nav>
          <Toaster />

          {children}
        </Provider>
      </body>
    </html>
  );
}
