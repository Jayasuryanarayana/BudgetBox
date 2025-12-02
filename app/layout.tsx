import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";
import { ToastProvider } from "./components/ToastContainer";
import { ServiceWorkerRegister } from "./components/ServiceWorkerRegister";

export const metadata: Metadata = {
  title: "BudgetBox - Personal Budgeting App",
  description: "Local-first personal budgeting application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ToastProvider>
          <ServiceWorkerRegister />
          <Header />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

