import { Header } from "@/components/Header";
import { createClient } from "@/utils/supabase/server";
import { CreatorManagementTable } from "@/components/CreatorManagementTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Clock, MousePointer2, Users, DollarSign } from "lucide-react";
import { formatWon } from "@/lib/format";
import { StatCard } from "@/components/patterns/StatCard";
import { Surface } from "@/components/primitives/Surface";
import { StatusBadge } from "@/components/primitives/StatusBadge";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. 캠페인 정보 조회
  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .select(
      `
      id,
      status,
      reward_type,
      reward_amount,
      created_at,
      products (
        name,
        price,
        image_url,
        description
      )
    `,
    )
    .eq("id", id)
    .single();

  if (campaignError || !campaign) {
    return <div>캠페인을 찾을 수 없습니다.</div>;
  }

  // 2. 전체 클릭 로그 조회 (통계 집계용)
  const { data: clicks } = await supabase
    .from("clicks")
    .select("creator_id")
    .eq("campaign_id", id);

  // 크리에이터별 클릭 수 집계
  const clickCountsByCreator = (clicks || []).reduce(
    (acc, click) => {
      acc[click.creator_id] = (acc[click.creator_id] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const totalClicks = clicks?.length || 0;
  // 임시 비용 계산 (단순 클릭당 비용이 아닌, CPS일 경우 판매 연동이 필요하나 현재는 예상치로 표시하거나 0으로)
  // 여기서는 reward_type이 cpc일 경우만 계산하고, cps는 아직 트래킹 안되므로 0
  const estimatedSpend =
    campaign.reward_type === "cpc" ? totalClicks * campaign.reward_amount : 0;

  // 3. 참여 크리에이터 조회
  const { data: applications, error: appError } = await supabase
    .from("campaign_applications")
    .select(
      `
      id,
      status,
      created_at,
      creator_id,
      profiles (
        email,
        creator_details (
          handle,
          bio,
          profile_image_url,
          instagram_url,
          youtube_url,
          tiktok_url,
          followers_count
        )
      )
    `,
    )
    .eq("campaign_id", id)
    .in("status", ["approved", "rejected"]); // 승인되었거나 거절된(중단된) 이력 포함

  if (appError) {
    console.error("Error fetching creators:", appError);
  }

  // 4. 데이터 매핑 (테이블용 포맷)
  const creatorsData = (applications || []).map((app: any) => {
    // profiles.creator_details는 배열일 수도, 객체일 수도 있으므로 안전하게 접근
    const details = Array.isArray(app.profiles?.creator_details)
      ? app.profiles.creator_details[0]
      : app.profiles?.creator_details;

    return {
      applicationId: app.id,
      creatorId: app.creator_id,
      status: app.status,
      joinedAt: app.created_at,
      email: app.profiles?.email || "",
      handle: details?.handle || "Unknown",
      bio: details?.bio || null,
      profileImage: details?.profile_image_url || null,
      channels: {
        instagram: details?.instagram_url,
        youtube: details?.youtube_url,
        tiktok: details?.tiktok_url,
      },
      followers: details?.followers_count || 0,
      clicks: clickCountsByCreator[app.creator_id] || 0,
    };
  });

  const activeCreatorsCount = creatorsData.filter(
    (c) => c.status === "approved",
  ).length;

  // Product Data
  const product = Array.isArray(campaign.products)
    ? campaign.products[0]
    : campaign.products;

  return (
    <div className="min-h-screen bg-white">
      {/* Header removed (moved to layout) */}

      <main>
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/advertiser/dashboard"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>대시보드로 돌아가기</span>
          </Link>
        </div>

        {/* Section A: Campaign Overview */}
        <div className="bg-white rounded-2xl border border-border p-8 mb-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-64 h-48 bg-gray-100 rounded-lg overflow-hidden shrink-0">
            {product?.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                No Image
              </div>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{product?.name}</h1>
                  <StatusBadge
                    size="md"
                    tone={campaign.status === "active" ? "success" : "neutral"}
                  >
                    {campaign.status === "active" ? "진행중" : "중지됨"}
                  </StatusBadge>
                </div>
                <p className="text-gray-600 mb-6">{product?.description}</p>
                <div className="flex gap-6 text-sm">
                  <div>
                    <span className="text-gray-500 block">보상 방식</span>
                    <span className="font-semibold text-gray-900">
                      {campaign.reward_type === "cps" ? "판매당" : "클릭당"}{" "}
                      {formatWon(campaign.reward_amount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">판매가</span>
                    <span className="font-semibold text-gray-900">
                      {product?.price != null ? formatWon(product.price) : "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500 block">생성일</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">수정</Button>
                <Button variant="destructive">조기 종료</Button>
              </div>
            </div>
          </div>
        </div>

        {/* Section B: KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<MousePointer2 className="w-6 h-6" />}
            label="총 유입 클릭"
            value={totalClicks.toLocaleString()}
          />
          <StatCard
            icon={<Users className="w-6 h-6" />}
            label="참여 크리에이터"
            value={
              <>
                {activeCreatorsCount.toLocaleString()}
                <span className="text-sm text-gray-400 ml-1 font-normal">
                  / {creatorsData.length}명
                </span>
              </>
            }
          />
          <StatCard
            icon={<DollarSign className="w-6 h-6" />}
            label={campaign.reward_type === "cpc" ? "총 지출 (예상)" : "총 지출"}
            value={
              <>
                {formatWon(estimatedSpend)}
                {campaign.reward_type === "cps" ? (
                  <span className="block text-xs text-gray-400 mt-1 font-normal">
                    * 판매 연동 전이므로 0원으로 표시됩니다.
                  </span>
                ) : null}
              </>
            }
          />
        </div>

        {/* Section C: Creator Management Table */}
        <CreatorManagementTable
          data={creatorsData}
          campaignId={campaign.id}
        />
      </main>
    </div>
  );
}

