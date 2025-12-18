"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Copy, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/primitives/StatusBadge";
import { ImageWithFallback } from "@/components/primitives/ImageWithFallback";
import { CampaignPriceInfo } from "@/components/primitives/CampaignPriceInfo";
import { CampaignRewardInfo } from "@/components/primitives/CampaignRewardInfo";
import { Button } from "@/components/ui/button";

type MyCampaignListItemProps = {
  campaign: {
    id: string;
    reward_type: string;
    reward_amount: number;
    products: {
      name: string;
      image_url: string | null;
      price: number;
    };
  };
  creatorId: string;
  clicks: number;
  className?: string;
};

export function MyCampaignListItem({
  campaign,
  creatorId,
  clicks,
  className,
}: MyCampaignListItemProps) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const trackingLink = origin ? `${origin}/cl/${campaign.id}/${creatorId}` : "";
  const product = Array.isArray(campaign.products)
    ? campaign.products[0]
    : campaign.products;

  if (!product) return null;

  const handleCopy = async () => {
    if (!trackingLink) return;
    await navigator.clipboard.writeText(trackingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-border hover:border-primary hover:shadow-md transition-all",
        className
      )}
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start gap-4">
          {/* 이미지 */}
          <div className="w-full sm:w-24 h-48 sm:h-24 rounded-lg overflow-hidden shrink-0">
            <ImageWithFallback
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              containerClassName="w-full h-full rounded-lg"
            />
          </div>

          {/* 메인 정보 */}
          <div className="flex-1 min-w-0 w-full">
            {/* 제목과 상태 배지 */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0 mb-3">
              <h3 className="font-bold text-lg mb-1 sm:mb-0 break-words">{product.name}</h3>
              <StatusBadge
                tone="success"
                size="sm"
                className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                승인됨
              </StatusBadge>
            </div>

            {/* 판매가/보상 정보 */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
              <CampaignPriceInfo
                productPrice={product.price}
                isLoggedIn={true}
                size="sm"
              />
              <CampaignRewardInfo
                rewardType={campaign.reward_type}
                rewardAmount={campaign.reward_amount}
                size="sm"
              />
            </div>

            {/* 통계 및 액션 */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-2">
              {/* 클릭 수 통계 */}
              <div className="text-sm">
                <span className="text-neutral-600">클릭 수</span>
                <span className="ml-2 font-bold text-primary text-lg">{clicks.toLocaleString()}</span>
              </div>

              {/* 액션 버튼들 */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                {/* 트래킹 링크 복사 */}
                <div className="flex items-center gap-2 bg-neutral-50 rounded-lg px-3 py-1.5 border border-neutral-200 min-w-0">
                  <input
                    type="text"
                    value={trackingLink}
                    readOnly
                    className="text-xs bg-transparent border-none outline-none text-neutral-700 flex-1 min-w-0 max-w-none sm:max-w-[200px] truncate"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCopy}
                    disabled={!trackingLink}
                    className="h-6 px-2 shrink-0"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-neutral-600" />
                    )}
                  </Button>
                </div>
                {/* 자세히 보기 버튼 */}
                <Link href={`/campaigns/${campaign.id}`} className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto shrink-0"
                  >
                    자세히 보기
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

