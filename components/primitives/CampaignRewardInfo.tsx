"use client";

import { cn } from "@/lib/utils";
import { formatWon } from "@/lib/format";

interface CampaignRewardInfoProps {
  /** 보상 타입 ("cps" | "cpc") */
  rewardType: string;
  /** 보상 금액 */
  rewardAmount: number | null;
  /** 추가 클래스명 */
  className?: string;
  /** 텍스트 크기 */
  size?: "sm" | "md";
}

/**
 * 캠페인의 보상 정보만 표시하는 컴포넌트
 */
export function CampaignRewardInfo({
  rewardType,
  rewardAmount,
  className,
  size = "sm",
}: CampaignRewardInfoProps) {
  const rewardLabel = rewardType === "cps" ? "판매당" : "클릭당";
  const textSize = size === "sm" ? "text-xs sm:text-sm" : "text-sm";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600">
        {rewardLabel}
      </span>
      <span className={cn("font-semibold text-neutral-900", textSize)}>
        {rewardAmount != null ? formatWon(rewardAmount) : "-"}
      </span>
    </div>
  );
}

