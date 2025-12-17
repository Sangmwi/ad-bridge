import { Suspense } from "react";
import { PageHeader } from "@/components/patterns/PageHeader";
import { CampaignList } from "@/components/features/campaigns/CampaignList";
import { CampaignListSkeleton } from "@/components/features/campaigns/CampaignListSkeleton";

export default function CampaignsPage() {
  return (
    <div className="container">
      <PageHeader
        title="캠페인 탐색"
        description="진행 중인 다양한 캠페인을 확인하고 참여해보세요."
      />

      <Suspense fallback={<CampaignListSkeleton />}>
        <CampaignList />
      </Suspense>
    </div>
  );
}
