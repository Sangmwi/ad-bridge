"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { CategoryTreeNode } from "@/lib/productCategories";
import { SearchInput } from "@/components/ui/search-input";
import { FilterSelect } from "@/components/ui/filter-select";
import { SearchButton } from "@/components/ui/search-button";
import { ClearButton } from "@/components/ui/clear-button";

function setParam(params: URLSearchParams, key: string, value?: string) {
  if (!value) params.delete(key);
  else params.set(key, value);
}

export function CampaignExploreFilterBar({
  categories,
  className,
}: {
  categories: CategoryTreeNode[];
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const initialQ = searchParams.get("q") ?? "";
  const initialL1 = searchParams.get("c1") ?? "";
  const initialL2 = searchParams.get("c2") ?? "";

  const [q, setQ] = useState(initialQ);
  const [c1, setC1] = useState(initialL1);
  const [c2, setC2] = useState(initialL2);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedParent = useMemo(
    () => categories.find((c) => c.id === c1),
    [categories, c1]
  );
  const childOptions = selectedParent?.children ?? [];

  // keep local state in sync on back/forward
  useEffect(() => {
    setQ(initialQ);
    setC1(initialL1);
    setC2(initialL2);
    setIsSubmitting(false); // navigation finished
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const applyAll = (nextQ: string, nextC1: string, nextC2: string) => {
    const current = new URLSearchParams(searchParams.toString());
    const next = new URLSearchParams(searchParams.toString());
    setParam(next, "q", nextQ.trim());
    setParam(next, "c1", nextC1);
    setParam(next, "c2", nextC2);
    if (current.toString() === next.toString()) {
      setIsSubmitting(false);
      return;
    }
    startTransition(() => router.push(`${pathname}?${next.toString()}`));
  };

  const clearAll = () => {
    setQ("");
    setC1("");
    setC2("");
    setIsSubmitting(false);
  };

  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur-lg p-4 sm:p-5",
        className
      )}
    >
      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setIsSubmitting(true);
          applyAll(q, c1, c2);
        }}
      >
        <SearchInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="제목으로 검색…"
        />

        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-2">
          <FilterSelect
            value={c1}
            onChange={(nextC1) => {
              setC1(nextC1);
              setC2("");
            }}
            options={categories.map((p) => ({ value: p.id, label: p.name }))}
            placeholder="전체(대)"
          />

          <FilterSelect
            value={c2}
            disabled={!c1}
            onChange={(nextC2) => {
              setC2(nextC2);
            }}
            options={childOptions.map((c) => ({ value: c.id, label: c.name }))}
            placeholder="전체(소)"
          />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:flex sm:gap-2">
          <SearchButton type="submit" isLoading={isSubmitting || isPending} />
          <ClearButton onClick={clearAll} />
        </div>
      </form>

      {/* no inline pending text; pending state is shown on the search button */}
    </div>
  );
}
