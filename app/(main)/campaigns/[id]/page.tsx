"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { CampaignDetailForCreator } from "@/components/features/campaigns/CampaignDetailForCreator";
import { CampaignDetailForCreatorSkeleton } from "@/components/features/campaigns/CampaignDetailForCreatorSkeleton";
import { useCampaignDetail } from "@/lib/queries/campaigns";
import { useUserProfile } from "@/lib/queries/auth";
import { Campaign } from "@/lib/types/campaign";

export default function CampaignDetailPageForCreator() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: profile, isLoading: profileLoading } = useUserProfile();
  const { data: campaign, isLoading: campaignLoading, error } = useCampaignDetail(
    id,
    profile?.user
  );

  // 크리에이터 역할 체크
  useEffect(() => {
    if (!profileLoading && profile) {
      if (!profile.user) {
        router.push("/auth/login");
        return;
      }
      if (profile.role !== "creator") {
        router.push("/campaigns");
      }
    }
  }, [profile, profileLoading, router]);

  if (profileLoading || campaignLoading) {
    return <CampaignDetailForCreatorSkeleton />;
  }

  if (error || !campaign) {
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

  return <CampaignDetailForCreator campaign={campaign as Campaign} />;
}
