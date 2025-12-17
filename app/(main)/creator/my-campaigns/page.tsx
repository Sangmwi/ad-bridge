import { PageHeader } from "@/components/patterns/PageHeader";
import { MyCampaignsList } from "@/components/creator/MyCampaignsList";

export default function MyCampaignsPage() {
  return (
    <div className="min-h-screen bg-white w-full">
      <main>
        <PageHeader
          title="내 캠페인"
          description="승인된 캠페인의 홍보 링크를 생성하고 관리하세요."
        />

        <MyCampaignsList />
      </main>
    </div>
  );
}

