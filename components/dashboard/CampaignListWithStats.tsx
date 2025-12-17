"use client";

import { useCampaignClickCounts } from "@/lib/queries/dashboard";
import { CampaignListItem } from "@/components/patterns/CampaignListItem";
import { formatWon } from "@/lib/format";
import { EmptyState } from "@/components/patterns/EmptyState";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Campaign {
  id: string;
  status: string;
  reward_type: string;
  reward_amount: number;
  products: Array<{ name: string; price: number }> | { name: string; price: number };
}

interface CampaignListWithStatsProps {
  campaigns: Campaign[];
}

export function CampaignListWithStats({
  campaigns,
}: CampaignListWithStatsProps) {
  const campaignIds = campaigns.map((c) => c.id);
  const { data: clickCounts, isLoading } = useCampaignClickCounts(campaignIds);

  if (campaigns.length === 0) {
    return (
      <EmptyState
        title="아직 등록된 캠페인이 없습니다."
        action={
          <Link href="/advertiser/campaigns/new">
            <Button variant="outline">첫 캠페인 만들기</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      {campaigns.map((campaign) => {
        const product = Array.isArray(campaign.products)
          ? campaign.products[0]
          : campaign.products;
        const clicks = isLoading ? 0 : clickCounts?.[campaign.id] || 0;
        const isCps = campaign.reward_type === "cps";

        return (
          <CampaignListItem
            key={campaign.id}
            href={`/advertiser/campaigns/${campaign.id}`}
            title={product?.name || "-"}
            status={campaign.status === "active" ? "active" : "inactive"}
            leftLabel={`보상 (${isCps ? "판매형" : "클릭형"})`}
            leftValue={formatWon(campaign.reward_amount)}
            rightLabel="총 클릭 수"
            rightValue={isLoading ? "로딩중…" : clicks.toLocaleString()}
          />
        );
      })}
    </div>
  );
}

