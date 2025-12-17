import { LockedValue } from "@/components/patterns/LockedValue";
import { formatWon } from "@/lib/format";

interface ProductPriceBadgeProps {
  price: number | null;
  isLoggedIn?: boolean;
  className?: string;
}

export function ProductPriceBadge({
  price,
  isLoggedIn = true,
  className,
}: ProductPriceBadgeProps) {
  return (
    <div className={`flex items-center gap-2 ${className || ""}`}>
      <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600">
        판매가
      </span>
      <span className="font-semibold text-neutral-900">
        <LockedValue
          locked={!isLoggedIn || price === null}
          value={price !== null ? formatWon(price) : "가격 정보 없음"}
          preview="????원"
          className="inline-flex"
        />
      </span>
    </div>
  );
}

