"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// 빈 값을 나타내는 특별한 값 (Radix UI는 빈 문자열을 허용하지 않음)
const EMPTY_VALUE = "__empty__";

export interface FilterSelectProps {
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  paddingX?: string;
  minWidth?: string;
  name?: string;
}

export const FilterSelect = React.forwardRef<HTMLButtonElement, FilterSelectProps>(
  (
    {
      className,
      options,
      placeholder,
      value,
      defaultValue,
      onChange,
      disabled,
      paddingX = "px-3",
      minWidth,
      name,
      ...props
    },
    ref
  ) => {
    // 빈 값("")을 EMPTY_VALUE로 변환하여 Select에 전달
    const currentValue = value ?? defaultValue ?? "";
    const selectValue = currentValue === "" ? EMPTY_VALUE : currentValue;

    // 모든 옵션 생성 (placeholder가 있으면 빈 값 옵션 추가)
    const allOptions = React.useMemo(
      () =>
        placeholder
          ? [{ value: EMPTY_VALUE, label: placeholder }, ...options]
          : options,
      [options, placeholder]
    );

    return (
      <div className="relative inline-block" style={{ minWidth }}>
        <Select
          value={selectValue}
          defaultValue={defaultValue === "" ? EMPTY_VALUE : defaultValue}
          onValueChange={(newValue) => {
            // EMPTY_VALUE를 빈 문자열로 변환하여 onChange에 전달
            onChange?.(newValue === EMPTY_VALUE ? "" : newValue);
          }}
          disabled={disabled}
          name={name}
        >
          <SelectTrigger
            ref={ref}
            className={cn(
              "h-10 rounded-xl border border-neutral-200 bg-white/70 backdrop-blur-md text-sm",
              "focus:ring-2 focus:ring-black/5 disabled:opacity-60 transition-all",
              paddingX,
              className
            )}
            {...props}
          >
            <SelectValue placeholder={placeholder || "선택하세요"} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-neutral-200 bg-white/95 backdrop-blur-lg shadow-lg">
            {allOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="px-3 py-2 text-sm cursor-pointer focus:bg-neutral-100"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }
);
FilterSelect.displayName = "FilterSelect";
