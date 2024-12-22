import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { QueryProvider } from "@/provider/query-provider";
import { HeaderComponent } from "@/components/layout/header";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "sonner";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-600`}
      >
        <QueryProvider>
          <AuthProvider>
            <SidebarProvider>
              <AppSidebar />
              <div className="block w-full">
                <HeaderComponent />
                <Toaster position="top-right" richColors closeButton duration={2000} theme="dark" />
                <main className="p-4 lg:p-6">
                  {children}
                </main>
              </div>
            </SidebarProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
