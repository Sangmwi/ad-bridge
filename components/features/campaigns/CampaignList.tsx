"use client";

import { useCampaigns, useCategories } from "@/lib/queries/campaigns";
import { useUserProfile } from "@/lib/queries/auth";
import { CampaignCard, type Campaign } from "@/components/CampaignCard";
import { CardGrid } from "@/components/patterns/CardGrid";
import { EmptyState } from "@/components/patterns/EmptyState";
import { CampaignExploreFilterBar } from "./CampaignExploreFilterBar";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export function CampaignList() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const c1 = searchParams.get("c1") ?? "";
  const c2 = searchParams.get("c2") ?? "";

  const filters = useMemo(
    () => ({
      q: q.trim() || undefined,
      c1: c1 || undefined,
      c2: c2 || undefined,
    }),
    [q, c1, c2]
  );

  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: profile } = useUserProfile();
  const { data: campaigns, isLoading } = useCampaigns(filters, profile?.user);

  if (categoriesLoading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block w-8 h-8 border-4 border-neutral-200 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <CampaignExploreFilterBar
        categories={categories || []}
        className="mb-6"
      />

      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-block w-8 h-8 border-4 border-neutral-200 border-t-primary rounded-full animate-spin"></div>
        </div>
      ) : (
        <>
          <CardGrid variant="campaigns">
            {campaigns?.map((campaign) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign as Campaign}
                userRole={profile?.role || null}
                isLoggedIn={!!profile?.user}
              />
            ))}
          </CardGrid>

          {(campaigns && campaigns?.length === 0) && (
            <EmptyState
              title="조건과 일치하는 캠페인이 없습니다."
              description="조금만 기다려주세요. 곧 새로운 캠페인이 올라올 거예요."
            />
          )}
        </>
      )}
    </>
  );
}

