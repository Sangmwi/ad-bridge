import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { TrendingUp, Users, DollarSign, Target, Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { ApplicantList } from "@/components/ApplicantList";
import { EmptyState } from "@/components/common/EmptyState";
import { formatWon } from "@/lib/format";

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
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">
            안녕하세요, 브랜드 매니저님!
          </h1>
          <p className="text-lg text-neutral-600">
            캠페인 성과를 확인하세요 📊
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-neutral-600 mb-1">
              총 유입 클릭
            </p>
            <p className="text-3xl font-bold">{totalClicks.toLocaleString()}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-neutral-600 mb-1">
              활성 크리에이터
            </p>
            <p className="text-3xl font-bold">{activeCreatorsCount || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-info font-semibold">
                진행중
              </span>
            </div>
            <p className="text-sm text-neutral-600 mb-1">
              활성 캠페인
            </p>
            <p className="text-3xl font-bold">{activeCampaignsCount}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-border hover:border-primary hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-sm text-neutral-600 mb-1">평균 클릭 수</p>
            <p className="text-3xl font-bold">
              {activeCampaignsCount > 0
                ? Math.round(totalClicks / activeCampaignsCount).toLocaleString()
                : 0}
            </p>
          </div>
        </div>

        {/* Quick Actions & Applicants */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Action: New Campaign */}
          <Link
            href="/advertiser/campaigns/new"
            className="group p-8 rounded-xl border-2 border-border hover:border-primary hover:shadow-md transition-all text-left h-full bg-white"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">새 캠페인 만들기</h3>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                <Plus className="w-5 h-5 text-primary group-hover:text-white group-hover:rotate-90 transition-all" />
              </div>
            </div>
            <p className="text-neutral-600">
              새로운 제품을 등록하고 크리에이터를 모집해보세요.<br/>
              타겟팅 조건과 보상을 설정할 수 있습니다.
            </p>
          </Link>

          {/* Action: Applicants List */}
          <div className="p-8 rounded-xl bg-neutral-50 border border-border h-full overflow-y-auto max-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">크리에이터 지원서</h3>
              <span className="px-3 py-1 rounded-full bg-primary text-white text-sm font-semibold">
                {applications?.length || 0}건
              </span>
            </div>
            
            <ApplicantList initialApplications={applications || []} />
          </div>
        </div>

        {/* Active Campaigns List */}
        <div className="bg-white rounded-xl border border-border p-8 mb-12">
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
                  <Link
                    key={campaign.id}
                    href={`/advertiser/campaigns/${campaign.id}`}
                    className="block p-5 rounded-lg border border-border hover:border-primary hover:bg-neutral-50 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{product?.name}</h3>
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${campaign.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                        {campaign.status === 'active' ? '진행중' : '중지됨'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-neutral-600">보상 ({isCps ? '판매형' : '클릭형'})</p>
                        <p className="font-semibold text-neutral-900">{formatWon(campaign.reward_amount)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-neutral-600">총 클릭 수</p>
                        <p className="font-semibold text-primary">
                          {clicks.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
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
        </div>
      </main>
    </div>
  );
}
