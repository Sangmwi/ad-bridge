import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { queryKeys } from "./keys";

export function useDashboardStats(campaignIds: string[]) {
  return useQuery({
    queryKey: queryKeys.dashboard.stats(campaignIds),
    queryFn: async () => {
      const supabase = createClient();
      
      // 클릭 수 조회
      const { data: clicks } =
        campaignIds.length > 0
          ? await supabase
              .from("clicks")
              .select("campaign_id")
              .in("campaign_id", campaignIds)
          : { data: [] };

      // 캠페인별 클릭 수 매핑
      const clickCounts = (clicks || []).reduce(
        (acc, click) => {
          acc[click.campaign_id] = (acc[click.campaign_id] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const totalClicks = clicks?.length || 0;

      // 활성 크리에이터 수 조회
      const { count: activeCreatorsCount } = await supabase
        .from("campaign_applications")
        .select("*", { count: "exact", head: true })
        .eq("status", "approved")
        .in("campaign_id", campaignIds);

      return {
        totalClicks,
        clickCounts,
        activeCreatorsCount: activeCreatorsCount || 0,
      };
    },
    enabled: campaignIds.length > 0,
    staleTime: 30_000, // 30초
  });
}

/**
 * @deprecated useDashboardStats를 사용하세요. clickCounts가 포함되어 있습니다.
 * 중복 요청을 방지하기 위해 통합되었습니다.
 */
export function useCampaignClickCounts(campaignIds: string[]) {
  const { data: stats } = useDashboardStats(campaignIds);
  return {
    data: stats?.clickCounts || {},
    isLoading: !stats,
  };
}

