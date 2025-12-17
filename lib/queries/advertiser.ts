import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { queryKeys } from "./keys";

/**
 * 광고주의 캠페인 목록을 가져오는 훅
 */
export function useAdvertiserCampaigns(advertiserId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.advertiser.campaigns(advertiserId || ""),
    queryFn: async () => {
      const supabase = createClient();

      const { data: campaigns, error } = await supabase
        .from("campaigns")
        .select(
          `
          id,
          status,
          created_at,
          reward_type,
          reward_amount,
          products (
            name,
            price
          )
        `,
        )
        .eq("advertiser_id", advertiserId || "")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return campaigns || [];
    },
    enabled: !!advertiserId,
    staleTime: 30_000, // 30초
  });
}

/**
 * 광고주의 대기 중인 지원서 목록을 가져오는 훅
 */
export function useAdvertiserPendingApplications(advertiserId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.advertiser.applications(advertiserId || ""),
    queryFn: async () => {
      const supabase = createClient();

      const { data: applications, error } = await supabase
        .from("campaign_applications")
        .select(
          `
          id,
          status,
          created_at,
          campaigns!inner (
            id,
            products (
              name
            )
          ),
          profiles (
            email
          )
        `,
        )
        .eq("status", "pending")
        .eq("campaigns.advertiser_id", advertiserId || "")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return applications || [];
    },
    enabled: !!advertiserId,
    staleTime: 30_000, // 30초
  });
}

