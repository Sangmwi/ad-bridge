"use client";

import { useDashboardStats } from "@/lib/queries/dashboard";
import { StatCard } from "@/components/patterns/StatCard";
import { DollarSign, Users, Target, TrendingUp } from "lucide-react";

interface DashboardStatsProps {
  campaignIds: string[];
  activeCampaignsCount: number;
}

export function DashboardStats({
  campaignIds,
  activeCampaignsCount,
}: DashboardStatsProps) {
  const { data, isLoading } = useDashboardStats(campaignIds);

  const totalClicks = data?.totalClicks ?? 0;
  const activeCreatorsCount = data?.activeCreatorsCount ?? 0;
  const averageClicks =
    activeCampaignsCount > 0
      ? Math.round(totalClicks / activeCampaignsCount)
      : 0;

  return (
    <div className="grid md:grid-cols-4 gap-6 mb-12">
      <StatCard
        icon={<DollarSign className="w-6 h-6" />}
        label="총 유입 클릭"
        value={
          isLoading ? (
            <span className="text-neutral-300">로딩중…</span>
          ) : (
            totalClicks.toLocaleString()
          )
        }
      />

      <StatCard
        icon={<Users className="w-6 h-6" />}
        label="활성 크리에이터"
        value={
          isLoading ? (
            <span className="text-neutral-300">로딩중…</span>
          ) : (
            activeCreatorsCount
          )
        }
      />

      <StatCard
        icon={<Target className="w-6 h-6" />}
        label="활성 캠페인"
        value={activeCampaignsCount}
        badge={<span className="text-neutral-600">진행중</span>}
      />

      <StatCard
        icon={<TrendingUp className="w-6 h-6" />}
        label="평균 클릭 수"
        value={
          isLoading ? (
            <span className="text-neutral-300">로딩중…</span>
          ) : (
            averageClicks.toLocaleString()
          )
        }
      />
    </div>
  );
}

