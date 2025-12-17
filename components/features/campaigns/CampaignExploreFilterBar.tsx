"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { CategoryTreeNode } from "@/lib/productCategories";
import { Search, X } from "lucide-react";

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
        {/* search */}
        <div className="relative flex-1">
          <Search
            strokeWidth={2.5}
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-900"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="제목으로 검색…"
            className="w-full rounded-xl border border-neutral-200 bg-white/70 backdrop-blur-md pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-black/5"
          />
        </div>

        {/* categories */}
        <div className="grid grid-cols-2 gap-2 sm:flex sm:gap-3">
          <select
            value={c1}
            onChange={(e) => {
              const nextC1 = e.target.value;
              setC1(nextC1);
              setC2("");
            }}
            className="h-10 rounded-xl border border-neutral-200 bg-white/70 backdrop-blur-md px-3 text-sm outline-none focus:ring-2 focus:ring-black/5"
          >
            <option value="">전체(대)</option>
            {categories.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            value={c2}
            disabled={!c1}
            onChange={(e) => {
              const nextC2 = e.target.value;
              setC2(nextC2);
            }}
            className="h-10 rounded-xl border border-neutral-200 bg-white/70 backdrop-blur-md px-3 text-sm outline-none focus:ring-2 focus:ring-black/5 disabled:opacity-60"
          >
            <option value="">전체(소)</option>
            {childOptions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isPending}
          className={cn(
            "relative inline-flex h-10 min-w-[96px] items-center justify-center rounded-xl px-4 text-sm font-semibold text-white disabled:opacity-70 disabled:backdrop-blur-sm",
            isSubmitting || isPending
              ? "bg-black"
              : "bg-neutral-900 hover:bg-neutral-800"
          )}
        >
          {/* keep layout stable: label is always "검색" */}
          <span className={cn("inline-flex items-center gap-2", (isSubmitting || isPending) && "opacity-40")}>
            <Search className="h-4 w-4" aria-hidden="true" />
            검색
          </span>
          {isSubmitting || isPending ? (
            <span
              className="absolute inset-0 m-auto h-5 w-5 animate-spin rounded-full border-2 border-white/60 border-t-white"
              aria-hidden="true"
            />
          ) : null}
        </button>

        <button
          type="button"
          onClick={clearAll}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white/70 backdrop-blur-md px-3 text-sm text-neutral-700 hover:bg-white/90"
        >
          <X className="h-4 w-4" />
          초기화
        </button>
      </form>

      {/* no inline pending text; pending state is shown on the search button */}
    </div>
  );
}


