"use client";

import { cn } from "@/lib/utils";
import { CampaignPriceInfo } from "./CampaignPriceInfo";
import { CampaignRewardInfo } from "./CampaignRewardInfo";

interface CampaignMetaInfoProps {
  /** 보상 타입 ("cps" | "cpc") */
  rewardType: string;
  /** 보상 금액 */
  rewardAmount: number | null;
  /** 제품 가격 */
  productPrice: number | null;
  /** 로그인 여부 (가격 잠금에 사용) */
  isLoggedIn?: boolean;
  /** 추가 클래스명 */
  className?: string;
  /** 텍스트 크기 */
  size?: "sm" | "md";
}

/**
 * 캠페인의 메타 정보(판매가, 보상)를 함께 표시하는 컴포넌트
 * 캠페인 상세 페이지에서 사용
 * 개별 컴포넌트: CampaignPriceInfo, CampaignRewardInfo
 */
export function CampaignMetaInfo({
  rewardType,
  rewardAmount,
  productPrice,
  isLoggedIn = true,
  className,
  size = "sm",
}: CampaignMetaInfoProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3 md:gap-4", className)}>
      <CampaignRewardInfo
        rewardType={rewardType}
        rewardAmount={rewardAmount}
        size={size}
      />
      <CampaignPriceInfo
        productPrice={productPrice}
        isLoggedIn={isLoggedIn}
        size={size}
      />
    </div>
  );
}

