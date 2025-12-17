"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Copy, ExternalLink, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/primitives/StatusBadge";
import { ImageWithFallback } from "@/components/primitives/ImageWithFallback";
import { formatWon } from "@/lib/format";
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

  const rewardText =
    campaign.reward_type === "cps"
      ? `판매당 ${formatWon(campaign.reward_amount)}`
      : `클릭당 ${formatWon(campaign.reward_amount)}`;

  return (
    <div
      className={cn(
        "bg-white rounded-lg border border-border hover:border-primary hover:shadow-md transition-all",
        className
      )}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* 이미지 */}
          <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0">
            <ImageWithFallback
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
              containerClassName="w-full h-full rounded-lg"
            />
          </div>

          {/* 메인 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-3">
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
                <div className="flex items-center gap-3 text-sm text-neutral-600">
                  <span>
                    판매가: <span className="font-semibold text-neutral-900">{formatWon(product.price)}</span>
                  </span>
                  <span className="text-neutral-300">|</span>
                  <span>
                    보상: <span className="font-semibold text-neutral-900">{rewardText}</span>
                  </span>
                </div>
              </div>
              <StatusBadge
                tone="success"
                size="sm"
                className="flex items-center gap-1.5 shrink-0"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                승인됨
              </StatusBadge>
            </div>

            {/* 통계 및 액션 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-neutral-600">클릭 수</span>
                  <span className="ml-2 font-bold text-primary text-lg">{clicks.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-neutral-50 rounded-lg px-3 py-1.5 border border-neutral-200">
                  <input
                    type="text"
                    value={trackingLink}
                    readOnly
                    className="text-xs bg-transparent border-none outline-none text-neutral-700 min-w-0 max-w-[200px] truncate"
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
                <Link href={trackingLink} target="_blank">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 shrink-0"
                    disabled={!trackingLink}
                  >
                    <ExternalLink className="w-4 h-4" />
                    테스트
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

