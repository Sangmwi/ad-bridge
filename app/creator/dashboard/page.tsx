import { Header } from "@/components/Header";
import { createClient } from "@/utils/supabase/server";
import { CampaignCard } from "@/components/CampaignCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CreatorDashboard() {
  const supabase = await createClient();

  const { data: campaigns, error } = await supabase
    .from("campaigns")
    .select(
      `
      *,
      products (*)
    `,
    )
    .eq("status", "active");

  if (error) {
    console.error("Error fetching campaigns:", error);
  }

  const campaignList = campaigns || [];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-3">캠페인 탐색</h1>
            <p className="text-lg text-[var(--neutral-600)]">
              내 마이샵에 담을 상품을 찾아보세요.
            </p>
          </div>
          <Link href="/creator/my-campaigns">
            <Button variant="outline" className="gap-2">
              📂 마이 캠페인 보기
            </Button>
          </Link>
        </div>

        {campaignList.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {campaignList.map((campaign: any) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-xl border-2 border-dashed border-[var(--border)]">
            <p className="text-[var(--neutral-600)]">
              현재 모집 중인 캠페인이 없습니다.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
