import { createClient } from "@/utils/supabase/server";
import { CampaignCard } from "@/components/CampaignCard";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { CardGrid } from "@/components/common/CardGrid";

export default async function CreatorDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    <main>
      <PageHeader
        title="캠페인 탐색"
        description="내 마이샵에 담을 상품을 찾아보세요."
        actions={
          <Link href="/creator/my-campaigns">
            <Button variant="outline" className="gap-2">
              📂 마이 캠페인 보기
            </Button>
          </Link>
        }
        className="mb-12"
      />

      {campaignList.length > 0 ? (
        <CardGrid variant="dashboard">
          {campaignList.map((campaign: any) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              userRole={"creator"}
              isLoggedIn={!!user}
            />
          ))}
        </CardGrid>
      ) : (
        <EmptyState title="현재 모집 중인 캠페인이 없습니다." />
      )}
    </main>
  );
}
