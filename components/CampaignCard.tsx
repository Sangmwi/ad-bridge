"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { formatTimeAgo } from "@/lib/time";
import { RewardTypeBadge } from "@/components/primitives/RewardTypeBadge";
import { CategoryText } from "@/components/primitives/CategoryText";
import { CampaignPriceInfo } from "@/components/primitives/CampaignPriceInfo";
import type { Campaign, Product } from "@/lib/types/campaign";
import Link from "next/link";

export interface CampaignCardProps {
  campaign: Campaign;
  userRole?: string | null;
  isLoggedIn: boolean;
}

export function CampaignCard({ campaign, userRole, isLoggedIn }: CampaignCardProps) {
  const supabase = createClient();
  const product = Array.isArray(campaign.products)
    ? campaign.products[0]
    : campaign.products;

  if (!product) return null;

  const category = product.product_categories ?? null;

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden hover:border-primary hover:shadow-md transition-all">
      <div className="aspect-video bg-neutral-100 relative">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            No Image
          </div>
        )}
        <div className="absolute top-3 right-3">
          <RewardTypeBadge rewardType={campaign.reward_type} amount={campaign.reward_amount} />
        </div>
      </div>

      <div className="p-6">
        <CategoryText category={category} className="mb-1.5" />
        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
        <p className="text-xs text-neutral-600 mb-3 line-clamp-1 leading-relaxed">
          {product.description}
        </p>
        {campaign.created_at && (
          <p className="text-xs text-neutral-500 mb-3">
            {formatTimeAgo(campaign.created_at)}
          </p>
        )}

        <div className="mt-4 pt-4 border-t border-border space-y-3">
          {/* 메타 정보 (판매가만 - 보상은 이미지 위 RewardTypeBadge에 표시됨) */}
          <CampaignPriceInfo
            productPrice={product.price}
            isLoggedIn={isLoggedIn}
            size="sm"
          />
          
          {/* 액션 버튼 */}
          <div className="flex justify-end">
            {!isLoggedIn && (
              <Button onClick={() => window.location.href = "/auth/login"} size="sm">
                시작하기
              </Button>
            )}
            {isLoggedIn && userRole === "creator" && (
              <Link href={`/campaigns/${campaign.id}`}>
                <Button size="sm" variant="outline">
                  자세히 보기
                </Button>
              </Link>
            )}
            {/* 광고주는 자신의 캠페인에 신청할 수 없으므로 버튼 표시하지 않음 */}
          </div>
        </div>
      </div>
    </div>
  );
}

