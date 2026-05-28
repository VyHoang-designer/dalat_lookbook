import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/auth-provider";

export const metadata: Metadata = {
  title: {
    default: "Dalat Lookbook — Thuê trang phục đẹp tại Đà Lạt",
    template: "%s | Dalat Lookbook",
  },
  description:
    "Khám phá và đặt thuê trang phục theo phong cách Vintage, Hàn Quốc, Y2K, Nàng thơ — dành cho giới trẻ khi du lịch Đà Lạt. Xem trước, chọn size, đặt online!",
  keywords: [
    "thuê đồ đà lạt",
    "cho thuê trang phục đà lạt",
    "đồ vintage đà lạt",
    "outfit đà lạt",
    "dalat lookbook",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="h-full antialiased scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: "12px",
                fontFamily: "Be Vietnam Pro, sans-serif",
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
