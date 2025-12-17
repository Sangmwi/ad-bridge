import * as React from "react";
import LockIcon from "@/assets/icons/lock-simple.svg";
import { cn } from "@/lib/utils";

type LockedValueProps = {
  /** 실제로 보여줄 값(로그인 상태) */
  value: React.ReactNode;
  /** 비로그인 상태에서 블러로 “미리보기”로 보여줄 값(예: ₩0, ₩12,000, ???) */
  preview: React.ReactNode;
  /** 잠금 여부 */
  locked: boolean;
  /** 잠금 표시 스타일 */
  variant?: "center-lock" | "none";
  className?: string;
};

export function LockedValue({
  value,
  preview,
  locked,
  variant = "center-lock",
  className,
}: LockedValueProps) {
  if (!locked) return <span className={className}>{value}</span>;

  return (
    <span className={cn("relative inline-block align-middle tabular-nums", className)}>
      <span className="select-none blur-sm opacity-60 leading-none">{preview}</span>
      {variant === "center-lock" ? (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <LockIcon
            width={16}
            height={16}
            className=""
            aria-hidden="true"
          />
        </span>
      ) : null}
    </span>
  );
}


