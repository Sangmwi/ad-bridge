"use client";

import { Plus } from "lucide-react";
import { ApplicantList } from "@/components/ApplicantList";
import { PageHeader } from "@/components/patterns/PageHeader";
import { Surface } from "@/components/primitives/Surface";
import { PanelHeader } from "@/components/patterns/PanelHeader";
import { ActionCardLink } from "@/components/patterns/ActionCardLink";
import { CountBadge } from "@/components/primitives/CountBadge";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { CampaignListWithStats } from "@/components/dashboard/CampaignListWithStats";
import { useUserProfile } from "@/lib/queries/auth";
import { useAdvertiserCampaigns, useAdvertiserPendingApplications } from "@/lib/queries/advertiser";
import { AdvertiserDashboardSkeleton } from "./AdvertiserDashboardSkeleton";

export function AdvertiserDashboardContent() {
  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: campaigns, isLoading: campaignsLoading } = useAdvertiserCampaigns(profile?.user?.id);
  const { data: applications, isLoading: applicationsLoading } = useAdvertiserPendingApplications(profile?.user?.id);

  const campaignIds = campaigns?.map((c) => c.id) || [];
  const activeCampaignsCount = campaigns?.filter((c) => c.status === "active").length || 0;
  const displayName = profile?.nickname || "브랜드 매니저님";

  if (profileLoading || campaignsLoading || applicationsLoading) {
    return <AdvertiserDashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-white w-full">
      <main>
        <PageHeader
          title={`안녕하세요, ${displayName}님!`}
          description="캠페인 성과를 확인하세요"
          className="mb-12"
        />

        {/* Stats Grid - CSR로 처리 */}
        <DashboardStats
          campaignIds={campaignIds}
          activeCampaignsCount={activeCampaignsCount}
        />

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
              right={<CountBadge count={applications?.length || 0} />}
            />
            <ApplicantList initialApplications={applications || []} />
          </Surface>
        </div>

        {/* Active Campaigns List - 클릭 수는 CSR로 처리 */}
        <Surface className="p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">내 캠페인 목록</h2>
          </div>

          <CampaignListWithStats campaigns={campaigns || []} />
        </Surface>
      </main>
    </div>
  );
}

