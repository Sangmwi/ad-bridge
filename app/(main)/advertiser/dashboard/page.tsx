import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { TrendingUp, Users, DollarSign, Target, Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { ApplicantList } from "@/components/ApplicantList";
import { EmptyState } from "@/components/patterns/EmptyState";
import { formatWon } from "@/lib/format";
import { PageHeader } from "@/components/patterns/PageHeader";
import { StatCard } from "@/components/patterns/StatCard";
import { Surface } from "@/components/primitives/Surface";
import { PanelHeader } from "@/components/patterns/PanelHeader";
import { ActionCardLink } from "@/components/patterns/ActionCardLink";
import { CampaignListItem } from "@/components/patterns/CampaignListItem";
import { CountBadge } from "@/components/primitives/CountBadge";

export default async function AdvertiserDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. 내 캠페인 목록 조회 (활성 상태인 것들)
  const { data: campaigns, error: campaignsError } = await supabase
    .from("campaigns")
    .select(
      `
      id,
      status,
      created_at,
      reward_type,
      reward_amount,
      products (
        name,
        price
      )
    `,
    )
    .eq("advertiser_id", user?.id || "")
    .order("created_at", { ascending: false });

  // 2. 대기 중인 지원서 조회
  const { data: applications, error: appError } = await supabase
    .from("campaign_applications")
    .select(
      `
      id,
      status,
      created_at,
      campaigns!inner (
        id,
        products (
          name
        )
      ),
      profiles (
        email
      )
    `,
    )
    .eq("status", "pending")
    .eq("campaigns.advertiser_id", user?.id || "")
    .order("created_at", { ascending: false });

  // 3. 통계 데이터 집계 (실제 데이터 기반)
  // 클릭 수 조회를 위한 별도 쿼리 (캠페인 ID들로 필터링)
  const campaignIds = campaigns?.map((c) => c.id) || [];
  const { data: clicks } =
    campaignIds.length > 0
      ? await supabase.from("clicks").select("campaign_id").in("campaign_id", campaignIds)
      : { data: [] };

  // 캠페인별 클릭 수 매핑
  const clickCounts = (clicks || []).reduce(
    (acc, click) => {
      acc[click.campaign_id] = (acc[click.campaign_id] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  // 전체 통계 계산
  const totalClicks = clicks?.length || 0;
  const activeCampaignsCount = campaigns?.filter((c) => c.status === "active").length || 0;
  
  // 참여 중인 크리에이터 수 (승인된 지원서 수)
  const { count: activeCreatorsCount } = await supabase
    .from("campaign_applications")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved")
    .in("campaign_id", campaignIds);

  return (
    <div className="min-h-screen bg-white">
      {/* Header removed (moved to layout) */}

      <main>
        <PageHeader
          title="안녕하세요, 브랜드 매니저님!"
          description="캠페인 성과를 확인하세요"
          className="mb-12"
        />

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            label="총 유입 클릭"
            value={totalClicks.toLocaleString()}
          />

          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="활성 크리에이터"
            value={activeCreatorsCount || 0}
          />

          <StatCard
            icon={<Target className="w-6 h-6" />}
            label="활성 캠페인"
            value={activeCampaignsCount}
            badge={<span className="text-neutral-600">진행중</span>}
          />

          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="평균 클릭 수"
            value={
              activeCampaignsCount > 0
                ? Math.round(totalClicks / activeCampaignsCount).toLocaleString()
                : 0
            }
          />
        </div>

        {/* Quick Actions & Applicants */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Action: New Campaign */}
          <ActionCardLink
            href="/advertiser/campaigns/new"
            title="새 캠페인 만들기"
            description={
              <>
                새로운 제품을 등록하고 크리에이터를 모집해보세요.
                <br />
                타겟팅 조건과 보상을 설정할 수 있습니다.
              </>
            }
            icon={<Plus className="w-5 h-5 group-hover:rotate-90 transition-all" />}
          />

          {/* Action: Applicants List */}
          <Surface className="p-8 rounded-xl bg-neutral-50 border border-border h-full overflow-y-auto max-h-[400px]">
            <PanelHeader
              title="크리에이터 지원서"
              right={
                <CountBadge count={applications?.length || 0} />
              }
            />
            <ApplicantList initialApplications={applications || []} />
          </Surface>
        </div>

        {/* Active Campaigns List */}
        <Surface className="p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">내 캠페인 목록</h2>
          </div>
          
          {campaigns && campaigns.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {campaigns.map((campaign: any) => {
                 const product = Array.isArray(campaign.products) ? campaign.products[0] : campaign.products;
                 const clicks = clickCounts[campaign.id] || 0;
                 const isCps = campaign.reward_type === 'cps';
                 
                 return (
                  <CampaignListItem
                    key={campaign.id}
                    href={`/advertiser/campaigns/${campaign.id}`}
                    title={product?.name || "-"}
                    status={campaign.status === "active" ? "active" : "inactive"}
                    leftLabel={`보상 (${isCps ? "판매형" : "클릭형"})`}
                    leftValue={formatWon(campaign.reward_amount)}
                    rightLabel="총 클릭 수"
                    rightValue={clicks.toLocaleString()}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="아직 등록된 캠페인이 없습니다."
              action={
                <Link href="/advertiser/campaigns/new">
                  <Button variant="outline">첫 캠페인 만들기</Button>
                </Link>
              }
            />
          )}
        </Surface>
      </main>
    </div>
  );
}
