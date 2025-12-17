"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { LockedValue } from "@/components/patterns/LockedValue";
import { formatWon } from "@/lib/format";
import { formatTimeAgo } from "@/lib/time";
import { RewardTypeBadge } from "@/components/primitives/RewardTypeBadge";

export type Product = {
  name: string;
  price: number | null;
  image_url: string | null;
  description: string;
};

export type Campaign = {
  id: string;
  created_at?: string;
  reward_type: string;
  reward_amount: number | null;
  conditions: { min_followers: number };
  products: Product | Product[] | null;
};

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

  const handleApply = async () => {
    if (!isLoggedIn) {
      window.location.href = "/auth/login";
      return;
    }

    if (userRole === "advertiser") return;

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
      if (!user) return;

      const { error } = await supabase.from("campaign_applications").insert({
        campaign_id: campaign.id,
        creator_id: user.id,
        status: "pending",
      });

      if (error) {
        if (error.code === "23505") {
          alert("이미 신청한 캠페인입니다.");
        } else {
          throw error;
        }
      } else {
        alert("신청이 완료되었습니다! 광고주의 승인을 기다려주세요.");
      }
    } catch (error) {
      console.error(error);
      alert("신청 중 오류가 발생했습니다.");
    }
  };

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
        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
        <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
          {product.description}
        </p>
        {campaign.created_at ? (
          <p className="text-xs text-neutral-500">
            {formatTimeAgo(campaign.created_at)}
          </p>
        ) : null}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
          <div className="text-sm">
            <span className="text-neutral-600">가격:</span>
            <span className="font-semibold ml-2 text-neutral-900">
              <LockedValue
                locked={product.price === null}
                value={product.price !== null ? formatWon(product.price) : ""}
                preview="????원"
                className="inline-flex"
              />
            </span>
          </div>
          
          {userRole !== "advertiser" && (
            <Button onClick={handleApply} size="sm">
              {isLoggedIn ? "신청하기" : "로그인하고 신청"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

