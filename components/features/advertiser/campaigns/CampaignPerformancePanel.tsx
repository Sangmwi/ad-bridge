"use client";

import { StatCard } from "@/components/patterns/StatCard";
import { CreatorManagementTable } from "@/components/CreatorManagementTable";
import { formatWon } from "@/lib/format";
import { DollarSign, MousePointer2, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

type StatsResponse = {
  totalClicks: number;
  estimatedSpend: number;
};

type Creator = {
  applicationId: string;
  creatorId: string;
  status: string;
  joinedAt: string;
  email: string;
  handle: string;
  bio: string | null;
  profileImage: string | null;
  channels: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  followers: number;
  clicks: number;
};

type CreatorsResponse = {
  creators: Creator[];
  activeCreatorsCount: number;
};

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, { credentials: "include" });
  if (!res.ok) throw new Error("요청에 실패했습니다.");
  return (await res.json()) as T;
}

export function CampaignPerformancePanel({
  campaignId,
  rewardType,
}: {
  campaignId: string;
  rewardType: "cpc" | "cps" | string;
}) {
  const statsQuery = useQuery({
    queryKey: ["campaign", campaignId, "stats"],
    queryFn: () =>
      fetchJson<StatsResponse>(`/api/advertiser/campaigns/${campaignId}/stats`),
  });

  const creatorsQuery = useQuery({
    queryKey: ["campaign", campaignId, "creators"],
    queryFn: () =>
      fetchJson<CreatorsResponse>(
        `/api/advertiser/campaigns/${campaignId}/creators`
      ),
  });

  const totalClicks = statsQuery.data?.totalClicks ?? 0;
  const estimatedSpend = statsQuery.data?.estimatedSpend ?? 0;

  const creators = creatorsQuery.data?.creators ?? [];
  const activeCreatorsCount = creatorsQuery.data?.activeCreatorsCount ?? 0;

  return (
    <>
      {/* Section B: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          icon={<MousePointer2 className="w-6 h-6" />}
          label="총 유입 클릭"
          value={
            statsQuery.isLoading ? (
              <span className="text-neutral-300">로딩중…</span>
            ) : (
              totalClicks.toLocaleString()
            )
          }
        />
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="참여 크리에이터"
          value={
            creatorsQuery.isLoading ? (
              <span className="text-neutral-300">로딩중…</span>
            ) : (
              <>
                {activeCreatorsCount.toLocaleString()}
                <span className="text-sm text-gray-400 ml-1 font-normal">
                  / {creators.length}명
                </span>
              </>
            )
          }
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6" />}
          label={rewardType === "cpc" ? "총 지출 (예상)" : "총 지출"}
          value={
            statsQuery.isLoading ? (
              <span className="text-neutral-300">로딩중…</span>
            ) : (
              <>
                {formatWon(estimatedSpend)}
                {rewardType === "cps" ? (
                  <span className="block text-xs text-gray-400 mt-1 font-normal">
                    * 판매 연동 전이므로 0원으로 표시됩니다.
                  </span>
                ) : null}
              </>
            )
          }
        />
      </div>

      {/* Section C: Creator Management Table */}
      {creatorsQuery.isLoading ? (
        <div className="rounded-xl border border-border bg-white p-6 text-sm text-neutral-400">
          참여 크리에이터를 불러오는 중…
        </div>
      ) : creatorsQuery.isError ? (
        <div className="rounded-xl border border-border bg-white p-6 text-sm text-red-600">
          참여 크리에이터를 불러오지 못했습니다. 새로고침 해주세요.
        </div>
      ) : (
        <CreatorManagementTable data={creators} campaignId={campaignId} />
      )}
    </>
  );
}


