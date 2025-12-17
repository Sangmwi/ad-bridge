import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { queryKeys } from "./keys";
import type { ProductCategory } from "@/lib/productCategories";

/**
 * 모든 카테고리 목록을 가져오는 훅 (parent 찾기용)
 */
export function useAllCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all(),
    queryFn: async () => {
      const supabase = createClient();
      const { data: categoryRows } = await supabase
        .from("product_categories")
        .select("id,parent_id,depth,slug,name")
        .order("depth", { ascending: true });

      return (categoryRows as ProductCategory[]) || [];
    },
    staleTime: 60 * 60 * 1000, // 60분
  });
}

