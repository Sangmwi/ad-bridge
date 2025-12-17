import { Header } from "@/components/Header";
import { createClient } from "@/utils/supabase/server";
import { MyCampaignCard } from "@/components/MyCampaignCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";

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

  // 내 클릭 성과 조회
  const { data: myClicks } = await supabase
    .from("clicks")
    .select("campaign_id")
    .eq("creator_id", user.id);

  // 캠페인별 클릭 수 집계
  const clickCounts = (myClicks || []).reduce(
    (acc, click) => {
      acc[click.campaign_id] = (acc[click.campaign_id] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const myCampaigns = applications || [];

  return (
    <div className="min-h-screen bg-white">
      {/* Header removed (moved to layout) */}

      <main className="max-w-7xl mx-auto">
        <PageHeader
          title="마이 캠페인"
          description="승인된 캠페인의 홍보 링크를 생성하고 관리하세요."
        />

        {myCampaigns.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myCampaigns.map((app: any) => (
              <MyCampaignCard
                key={app.id}
                applicationId={app.id}
                campaign={app.campaigns}
                creatorId={user.id}
                clicks={clickCounts[app.campaigns.id] || 0}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            size="lg"
            title="아직 승인된 캠페인이 없어요"
            description="새로운 캠페인을 찾아 신청해보세요!"
            action={
              <Link href="/campaigns">
              <button className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors">
                캠페인 탐색하러 가기
              </button>
            </Link>
            }
          />
        )}
      </main>
    </div>
  );
}

