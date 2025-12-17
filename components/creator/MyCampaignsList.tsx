"use client";

import { useMyCampaigns, useCreatorClickCounts } from "@/lib/queries/creator";
import { useUser } from "@/lib/queries/auth";
import { MyCampaignListItem } from "@/components/creator/MyCampaignListItem";
import { EmptyState } from "@/components/patterns/EmptyState";
import Link from "next/link";

export function MyCampaignsList() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: applications, isLoading } = useMyCampaigns(user?.id || "");
  const { data: clickCounts, isLoading: clicksLoading } = useCreatorClickCounts(
    user?.id || ""
  );

  if (userLoading || isLoading || clicksLoading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 border-4 border-neutral-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <EmptyState
      size="lg"
      title="로그인이 필요합니다"
      description="로그인 후 이용해주세요."
      action={
        <Link href="/auth/login">
          <button className="px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors">
            로그인하러 가기
          </button>
        </Link>
      }
    />;
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
    <div className="space-y-4">
      {myCampaigns.map((app: any) => (
        <MyCampaignListItem
          key={app.id}
          campaign={app.campaigns}
          creatorId={user.id}
          clicks={clickCounts?.[app.campaigns.id] || 0}
        />
      ))}
    </div>
  );
}

