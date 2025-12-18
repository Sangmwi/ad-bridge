"use client";

import { cn } from "@/lib/utils";
import { formatWon } from "@/lib/format";
import { LockedValue } from "@/components/patterns/LockedValue";

interface CampaignPriceInfoProps {
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
 * 캠페인의 판매가 정보만 표시하는 컴포넌트
 */
export function CampaignPriceInfo({
  productPrice,
  isLoggedIn = true,
  className,
  size = "sm",
}: CampaignPriceInfoProps) {
  const textSize = size === "sm" ? "text-xs sm:text-sm" : "text-sm";

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600">
        판매가
      </span>
      <span className={cn("font-semibold text-neutral-900", textSize)}>
        <LockedValue
          locked={!isLoggedIn || productPrice === null}
          value={productPrice !== null ? formatWon(productPrice) : "가격 정보 없음"}
          preview="????원"
          className="inline-flex"
        />
      </span>
    </div>
  );
}

