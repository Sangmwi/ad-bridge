import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "pretendard/dist/web/static/pretendard.css";
import { Header } from "@/components/Header";
import { createClient } from "@/utils/supabase/server";
import { QueryProvider } from "@/components/providers/QueryProvider";

const pretendard = localFont({
  src: "../node_modules/pretendard/dist/web/static/woff2/Pretendard-Regular.woff2",
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ad-Bridge - 당신의 영향력을 수익으로",
  description:
    "광고주와 크리에이터를 연결하는 성과형 커머스 플랫폼. 마이샵을 만들고, 좋아하는 제품을 판매하며, 투명한 수수료를 받으세요.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role || null;
  }

  return (
    <html lang="ko">
      <body className={`${pretendard.variable} antialiased`}>
        <QueryProvider>
          <Header user={user} role={role} />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
