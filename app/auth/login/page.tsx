"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import LogoRow from "@/assets/logos/Ad-Bridge-logo-row.svg";
import GoogleIcon from "@/assets/icons/google-icon.svg";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
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
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 py-20 border border-(--border)">
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
            계정이 없으신가요?{" "}
            <Link
              href="/auth/signup"
              className="text-brand-500 font-semibold hover:underline"
            >
              <span className="">회원가입</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
