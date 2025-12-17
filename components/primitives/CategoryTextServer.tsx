import { createClient } from "@/utils/supabase/server";
import { findParentCategory, type ProductCategory } from "@/lib/productCategories";
import { cn } from "@/lib/utils";

interface CategoryTextServerProps {
  category: {
    id: string;
    name: string;
    parent_id: string | null;
  } | null;
  className?: string;
}

/**
 * 서버 컴포넌트용 CategoryText
 * 대분류/소분류 형태로 작고 옅은 브랜드색상으로 표시
 */
export async function CategoryTextServer({
  category,
  className,
}: CategoryTextServerProps) {
  if (!category) return null;

  const supabase = await createClient();
  let parent: ProductCategory | null = null;

  if (category.parent_id) {
    const { data: allCategories } = await supabase
      .from("product_categories")
      .select("id,parent_id,depth,slug,name")
      .order("depth", { ascending: true });

    if (allCategories) {
      parent = findParentCategory(
        allCategories as ProductCategory[],
        category
      );
    }
  }

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

