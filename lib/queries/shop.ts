import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { queryKeys } from "./keys";

export interface ShopItem {
  id: string;
  custom_link: string;
  campaigns: {
    reward_type: string;
    reward_amount: number;
    products: {
      name: string;
      price: number;
      image_url: string | null;
      description: string;
    };
  };
}

export function useMyShop(creatorId: string) {
  return useQuery({
    queryKey: queryKeys.shop.myShop(creatorId),
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      
      if (!user) throw new Error("로그인이 필요합니다");

      const { data, error } = await supabase
        .from("my_shop_items")
        .select(
          `
          id,
          custom_link,
          campaigns (
            reward_type,
            reward_amount,
            products (
              name,
              price,
              image_url,
              description
            )
          )
        `
        )
        .eq("creator_id", user.id);

      if (error) throw error;
      return (data as ShopItem[]) || [];
    },
    enabled: !!creatorId,
    staleTime: 30_000,
  });
}

