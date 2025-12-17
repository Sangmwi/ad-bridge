"use client";

import { useMyCampaigns, useCreatorClickCounts } from "@/lib/queries/creator";
import { useUser } from "@/lib/queries/auth";
import { MyCampaignCard } from "@/components/MyCampaignCard";
import { EmptyState } from "@/components/patterns/EmptyState";
import Link from "next/link";

export function MyCampaignsList() {
  const { data: user } = useUser();
  const { data: applications, isLoading } = useMyCampaigns(user?.id || "");
  const { data: clickCounts, isLoading: clicksLoading } = useCreatorClickCounts(
    user?.id || ""
  );

  if (isLoading || clicksLoading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 border-4 border-neutral-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <div>로그인이 필요합니다.</div>;
  }

  const myCampaigns = applications || [];

  if (myCampaigns.length === 0) {
    return (
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
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {myCampaigns.map((app: any) => (
        <MyCampaignCard
          key={app.id}
          applicationId={app.id}
          campaign={app.campaigns}
          creatorId={user.id}
          clicks={clickCounts?.[app.campaigns.id] || 0}
        />
      ))}
    </div>
  );
}

