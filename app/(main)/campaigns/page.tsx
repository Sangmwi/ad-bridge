import { createClient } from "@/utils/supabase/server";
import { CampaignCard, type Campaign } from "@/components/CampaignCard";
import { PageHeader } from "@/components/patterns/PageHeader";
import { EmptyState } from "@/components/patterns/EmptyState";
import { CardGrid } from "@/components/patterns/CardGrid";

export default async function CampaignsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 사용자 역할 가져오기
  let userRole: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    userRole = profile?.role || null;
  }

  // 캠페인 목록 가져오기
  const { data: campaigns, error } = await supabase
    .from("campaigns")
    .select(`
      id,
      created_at,
      reward_type,
      reward_amount,
      conditions,
      products (
        name,
        price,
        image_url,
        description
      )
    `)
    .eq("status", "active") // 활성 캠페인만 노출
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching campaigns:", error);
    return <div>캠페인을 불러오는 중 오류가 발생했습니다.</div>;
  }

  // 비로그인 사용자를 위한 데이터 마스킹 (Server-side Sanitization)
  const sanitizedCampaigns = campaigns?.map((campaign) => {
    if (!user) {
      const { products } = campaign;
      return {
        ...campaign,
        reward_amount: null, // 민감 정보 숨김
        products: Array.isArray(products)
          ? products.map((p) => ({ ...p, price: null }))
          : products && typeof products === "object"
            ? { ...(products as Record<string, unknown>), price: null }
          : null,
      };
    }
    return campaign;
  });

  return (
    <div className="container">
      <PageHeader
        title="캠페인 탐색"
        description="진행 중인 다양한 캠페인을 확인하고 참여해보세요."
      />

      <CardGrid variant="campaigns">
        {sanitizedCampaigns?.map((campaign) => (
          <CampaignCard
            key={campaign.id}
            campaign={campaign as Campaign}
            userRole={userRole}
            isLoggedIn={!!user}
          />
        ))}
      </CardGrid>

      {(!sanitizedCampaigns || sanitizedCampaigns.length === 0) && (
        <EmptyState
          title="현재 진행 중인 캠페인이 없습니다."
          description="조금만 기다려주세요. 곧 새로운 캠페인이 올라올 거예요."
        />
      )}
    </div>
  );
}
