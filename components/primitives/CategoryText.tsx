"use client";

import { useAllCategories } from "@/lib/queries/categories";
import { findParentCategory, type ProductCategory } from "@/lib/productCategories";
import { cn } from "@/lib/utils";

interface CategoryTextProps {
  category: {
    id: string;
    name: string;
    parent_id: string | null;
  } | null;
  className?: string;
}

/**
 * 카테고리를 대분류/소분류 형태로 작고 옅은 브랜드색상으로 표시하는 컴포넌트
 * 제목 위에 배치되어 사용됩니다.
 */
export function CategoryText({ category, className }: CategoryTextProps) {
  const { data: allCategories } = useAllCategories();

  if (!category) return null;

  const parent = allCategories
    ? findParentCategory(allCategories, category)
    : null;

  return (
    <div className={cn("flex items-center gap-1.5 text-xs", className)}>
      {parent && (
        <>
          <span className="text-primary/60 font-medium">{parent.name}</span>
          <span className="text-primary/40">/</span>
        </>
      )}
      <span className="text-primary/70 font-medium">{category.name}</span>
    </div>
  );
}

