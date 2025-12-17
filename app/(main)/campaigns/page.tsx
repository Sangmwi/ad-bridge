import { PageHeader } from "@/components/patterns/PageHeader";
import { CampaignList } from "@/components/features/campaigns/CampaignList";

export default function CampaignsPage() {
  return (
    <div className="container">
      <PageHeader
        title="캠페인 탐색"
        description="진행 중인 다양한 캠페인을 확인하고 참여해보세요."
      />

      <CampaignList />
    </div>
  );
}
