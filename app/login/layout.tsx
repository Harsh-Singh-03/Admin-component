import { QueryProvider } from "@/provider/query-provider";
import "../globals.css";
import { AuthProvider } from "@/hooks/use-auth";
import { Toaster } from "sonner";

export const metadata = {
  title: 'Login | Admin',
  description: 'Login page for admin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <AuthProvider>
            <>
              <Toaster position="top-right" richColors closeButton duration={2000}  theme="dark" />
              {children}
            </>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
