import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { queryKeys } from "./keys";

export function useMyCampaigns(creatorId: string) {
  return useQuery({
    queryKey: queryKeys.creatorCampaigns.myCampaigns(),
    queryFn: async () => {
      const supabase = createClient();
      const { data: applications, error } = await supabase
        .from("campaign_applications")
        .select(
          `
          id,
          status,
          campaigns (
            id,
            reward_type,
            reward_amount,
            products (
              name,
              price,
              image_url
            )
          )
        `
        )
        .eq("creator_id", creatorId)
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return applications || [];
    },
    enabled: !!creatorId,
    staleTime: 30_000,
  });
}

export function useCreatorClickCounts(creatorId: string) {
  return useQuery({
    queryKey: queryKeys.creatorCampaigns.clickCounts(creatorId),
    queryFn: async () => {
      const supabase = createClient();
      const { data: myClicks } = await supabase
        .from("clicks")
        .select("campaign_id")
        .eq("creator_id", creatorId);

      return (myClicks || []).reduce(
        (acc, click) => {
          acc[click.campaign_id] = (acc[click.campaign_id] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );
    },
    enabled: !!creatorId,
    staleTime: 30_000,
  });
}

