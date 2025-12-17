import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { queryKeys } from "./keys";
import { buildCategoryTree } from "@/lib/productCategories";

export interface CampaignFilters {
  q?: string;
  c1?: string;
  c2?: string;
}

export function useCampaigns(
  filters: CampaignFilters = {},
  user: { id: string } | null | undefined = undefined
) {
  return useQuery({
    queryKey: queryKeys.campaigns.list(filters, user?.id),
    queryFn: async () => {
      const supabase = createClient();
      
      // user가 전달되지 않았을 때만 내부에서 확인 (중복 호출 방지)
      let effectiveUser = user;
      if (effectiveUser === undefined) {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        effectiveUser = currentUser || null;
      }

      // 필터가 없으면 바로 campaigns 조회
      const hasFilters = !!(filters.q || filters.c1 || filters.c2);
      let filteredProductIds: string[] | null = null;

      // 1. 필터가 있을 때만 products 테이블에서 필터링 조건에 맞는 product_id들을 가져옴
      if (hasFilters) {
        let productQuery = supabase.from("products").select("id");

        if (filters.q) {
          productQuery = productQuery.ilike("name", `%${filters.q}%`);
        }
        if (filters.c2) {
          productQuery = productQuery.eq("category_id", filters.c2);
        } else if (filters.c1) {
          // c1이 있으면 자식 카테고리들을 직접 조회
          const { data: childCategories } = await supabase
            .from("product_categories")
            .select("id")
            .eq("parent_id", filters.c1);
          
          const childIds = childCategories?.map((c) => c.id) ?? [];
          if (childIds.length > 0) {
            productQuery = productQuery.in("category_id", childIds);
          } else {
            // 자식이 없으면 빈 결과 반환
            return [];
          }
        }

        const { data: filteredProducts, error: productError } = await productQuery;

        if (productError) throw productError;

        // 필터 결과가 없으면 빈 배열 반환
        if (!filteredProducts || filteredProducts.length === 0) {
          return [];
        }

        filteredProductIds = filteredProducts.map((p) => p.id);
      }

      // 2. campaigns 조회
      let campaignQuery = supabase
        .from("campaigns")
        .select(`
          id,
          created_at,
          reward_type,
          reward_amount,
          conditions,
          products (
            name,
            price,
            image_url,
            description,
            category_id,
            product_categories (
              id,
              name,
              parent_id
            )
          )
        `)
        .eq("status", "active");

      // 필터가 있으면 product_id로 필터링
      if (filteredProductIds && filteredProductIds.length > 0) {
        campaignQuery = campaignQuery.in("product_id", filteredProductIds);
      }

      campaignQuery = campaignQuery.order("created_at", { ascending: false });

      const { data: campaigns, error: campaignError } = await campaignQuery;

      if (campaignError) throw campaignError;

      // 비로그인 사용자를 위한 데이터 마스킹
      const sanitizedCampaigns = campaigns?.map((campaign) => {
        if (!effectiveUser) {
          const { products } = campaign;
          return {
            ...campaign,
            reward_amount: null,
            products: Array.isArray(products)
              ? products.map((p: any) => ({ ...p, price: null }))
              : products && typeof products === "object"
                ? { ...(products as Record<string, unknown>), price: null }
                : null,
          };
        }
        return campaign;
      });

      return sanitizedCampaigns || [];
    },
    staleTime: 30_000, // 30초
  });
}

/**
 * 단일 캠페인 상세 정보를 가져오는 훅
 * @param includeInactive - true인 경우 inactive 상태의 캠페인도 조회 (광고주용)
 */
export function useCampaignDetail(
  id: string,
  user: { id: string } | null | undefined = undefined,
  includeInactive: boolean = false
) {
  return useQuery({
    queryKey: queryKeys.campaigns.detail(id),
    queryFn: async () => {
      const supabase = createClient();

      // user가 전달되지 않았을 때만 내부에서 확인 (중복 호출 방지)
      let effectiveUser = user;
      if (effectiveUser === undefined) {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        effectiveUser = currentUser || null;
      }

      let query = supabase
        .from("campaigns")
        .select(`
          id,
          status,
          reward_type,
          reward_amount,
          created_at,
          conditions,
          products (
            name,
            price,
            image_url,
            description,
            category_id,
            product_categories (
              id,
              name,
              parent_id
            )
          )
        `)
        .eq("id", id);

      // 크리에이터는 active만, 광고주는 모든 상태 조회 가능
      if (!includeInactive) {
        query = query.eq("status", "active");
      }

      const { data: campaign, error } = await query.single();

      if (error) throw error;
      if (!campaign) return null;

      // 비로그인 사용자를 위한 데이터 마스킹
      if (!effectiveUser) {
        const { products } = campaign;
        return {
          ...campaign,
          reward_amount: null,
          products: Array.isArray(products)
            ? products.map((p: any) => ({ ...p, price: null }))
            : products && typeof products === "object"
              ? { ...(products as Record<string, unknown>), price: null }
              : null,
        };
      }

      return campaign;
    },
    enabled: !!id,
    staleTime: 30_000, // 30초
  });
}

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories.list(),
    queryFn: async () => {
      const supabase = createClient();
      const { data: categoryRows } = await supabase
        .from("product_categories")
        .select("id,parent_id,depth,slug,name")
        .order("depth", { ascending: true });

      return buildCategoryTree((categoryRows as any[]) || []);
    },
    staleTime: 60 * 60 * 1000, // 60분 (카테고리는 자주 변경되지 않음)
  });
}

