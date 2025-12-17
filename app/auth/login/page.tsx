"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import LogoRow from "@/assets/logos/Ad-Bridge-logo-row.svg";
import GoogleIcon from "@/assets/icons/google-icon.svg";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const supabase = createClient();
    const redirectUrl =
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${redirectUrl}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "select_account",
        },
      },
    });

    if (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-card rounded-2xl p-8 py-20">
          <div className="mb-16 space-y-2">
            <LogoRow width={220} height={55} />
            <p className="text-slate-600 font-medium pl-2.5">
              당신의 영향력을 수익으로
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              size="lg"
              className="w-full flex items-center gap-2 py-4 text-base"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-neutral-800 border-t-transparent rounded-full animate-spin" />
              ) : (
                <GoogleIcon width={20} height={20} />
              )}
              <span className="text-base pl-2">Google로 시작하기</span>
            </Button>
          </div>

          <div className="mt-6 text-center text-sm text-neutral-500">
            구글 계정으로 간편하게 시작하세요
          </div>
        </div>
      </div>
    </div>
  );
}
