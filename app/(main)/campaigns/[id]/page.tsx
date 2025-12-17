import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { CampaignDetailForCreator } from "@/components/features/campaigns/CampaignDetailForCreator";

export default async function CampaignDetailPageForCreator({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // 사용자 확인
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // 프로필 확인
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  // 크리에이터가 아니면 리다이렉트
  if (profile?.role !== "creator") {
    redirect("/campaigns");
  }

  // 캠페인 정보 조회
  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .select(
      `
      id,
      status,
      reward_type,
      reward_amount,
      created_at,
      conditions,
      products (
        name,
        price,
        image_url,
        description,
        category_id,
        product_categories (
          id,
          name,
          parent_id
        )
      )
    `
    )
    .eq("id", id)
    .eq("status", "active")
    .single();

  if (campaignError || !campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">캠페인을 찾을 수 없습니다</h1>
          <p className="text-neutral-600 mb-4">존재하지 않거나 종료된 캠페인입니다.</p>
          <a href="/campaigns" className="text-primary hover:underline">
            캠페인 탐색으로 돌아가기
          </a>
        </div>
      </div>
    );
  }

  return <CampaignDetailForCreator campaign={campaign} />;
}

