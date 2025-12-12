import { Header } from "@/components/Header";
import { createClient } from "@/utils/supabase/server";
import { MyCampaignCard } from "@/components/MyCampaignCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function MyCampaignsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  // 승인된 캠페인 목록 조회
  const { data: applications, error } = await supabase
    .from("campaign_applications")
    .select(
      `
      id,
      status,
      campaigns (
        id,
        reward_type,
        reward_amount,
        products (
          name,
          price,
          image_url
        )
      )
    `,
    )
    .eq("creator_id", user.id)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching my campaigns:", error);
  }

  const myCampaigns = applications || [];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/creator/dashboard"
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold">마이 캠페인</h1>
            <p className="text-gray-500 mt-1">
              승인된 캠페인의 홍보 링크를 생성하고 관리하세요.
            </p>
          </div>
        </div>

        {myCampaigns.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {myCampaigns.map((app: any) => (
              <MyCampaignCard
                key={app.id}
                applicationId={app.id}
                campaign={app.campaigns}
                creatorId={user.id}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              아직 승인된 캠페인이 없어요 😢
            </h3>
            <p className="text-gray-500 mb-6">
              새로운 캠페인을 찾아 신청해보세요!
            </p>
            <Link href="/creator/dashboard">
              <button className="px-6 py-3 bg-[var(--primary)] text-white rounded-lg font-bold hover:bg-[var(--primary-dark)] transition-colors">
                캠페인 탐색하러 가기
              </button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

