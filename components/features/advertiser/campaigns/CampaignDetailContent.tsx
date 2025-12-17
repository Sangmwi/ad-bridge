"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft,
  MoreHorizontal,
} from "lucide-react";
import { formatWon } from "@/lib/format";
import { StatusBadge } from "@/components/primitives/StatusBadge";
import { formatTimeAgo } from "@/lib/time";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CampaignPerformancePanel } from "@/components/features/advertiser/campaigns/CampaignPerformancePanel";
import { CategoryText } from "@/components/primitives/CategoryText";
import { useCampaignDetail } from "@/lib/queries/campaigns";
import { useUser } from "@/lib/queries/auth";
import { ImageWithFallback } from "@/components/primitives/ImageWithFallback";
import { CampaignDetailSkeleton } from "./CampaignDetailSkeleton";

interface CampaignDetailContentProps {
  campaignId: string;
}

export function CampaignDetailContent({ campaignId }: CampaignDetailContentProps) {
  const { data: user, isLoading: userLoading } = useUser();
  // 광고주는 모든 상태의 캠페인을 볼 수 있어야 함
  const { data: campaign, isLoading: campaignLoading, error } = useCampaignDetail(campaignId, user || undefined, true);

  if (userLoading || campaignLoading) {
    return <CampaignDetailSkeleton />;
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen bg-white w-full">
        <main className="">
          <div className="mb-8">
            <Link
              href="/advertiser/dashboard"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>대시보드로 돌아가기</span>
            </Link>
          </div>
          <div className="text-center py-20 text-red-400">캠페인을 찾을 수 없습니다.</div>
        </main>
      </div>
    );
  }

  // Product Data
  const product = Array.isArray(campaign.products)
    ? campaign.products[0]
    : campaign.products;

  // Category extraction with type safety
  let category: { id: string; name: string; parent_id: string | null } | null = null;
  if (product && 'product_categories' in product) {
    const cat = (product as any).product_categories;
    if (Array.isArray(cat) && cat.length > 0) {
      category = cat[0] || null;
    } else if (cat && typeof cat === 'object' && 'id' in cat) {
      category = cat;
    }
  }

  return (
    <div className="min-h-screen bg-white w-full">
      <main className="">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/advertiser/dashboard"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>대시보드로 돌아가기</span>
          </Link>
        </div>

        {/* Section A: Campaign Overview */}
        <div className="bg-white rounded-2xl border border-border p-8 mb-8 flex flex-col md:flex-row gap-8 items-start">
          {/* Image: keep consistent ratio regardless of viewport */}
          <div className="w-full md:w-72 aspect-4/3 bg-gray-100 rounded-lg overflow-hidden shrink-0">
            <ImageWithFallback
              src={product?.image_url || null}
              alt={product?.name || "제품 이미지"}
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
            />
          </div>
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-col">
              {/* Row 1: title + actions */}
              <div className="flex items-start gap-2 w-full">
                <div className="min-w-0 flex-1">
                  <CategoryText category={category} className="mb-2" />
                  <h1 className="min-w-0 text-2xl sm:text-3xl font-bold wrap-break-word mb-2">
                    {product?.name}
                  </h1>
                </div>

                <div className="flex gap-2 flex-nowrap shrink-0">
                  {/* Desktop actions */}
                  <div className="hidden sm:flex gap-2">
                    <Button variant="outline" size="sm" className="px-4 whitespace-nowrap">
                      수정
                    </Button>
                    <Button variant="destructive" size="sm" className="px-4 whitespace-nowrap">
                      조기 종료
                    </Button>
                  </div>

                  {/* Mobile actions */}
                  <div className="sm:hidden">
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                          <MoreHorizontal className="h-5 w-5" />
                          <span className="sr-only">캠페인 관리</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>수정</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600 focus:text-red-600">
                          조기 종료
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Row 2: status + created at */}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] sm:text-xs text-neutral-500">
                <StatusBadge
                  size="sm"
                  tone={campaign.status === "active" ? "success" : "neutral"}
                >
                  {campaign.status === "active" ? "진행중" : "중지됨"}
                </StatusBadge>
                <span>
                  {formatTimeAgo(campaign.created_at)} ·{" "}
                  {new Date(campaign.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* Row 3: meta */}
              <div className="mt-4 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600">
                    {campaign.reward_type === "cps" ? "판매당" : "클릭당"}
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {campaign.reward_amount != null ? formatWon(campaign.reward_amount) : "-"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600">
                    판매가
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {product?.price != null ? formatWon(product.price) : "-"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description - Separated Section */}
        <div className="bg-white rounded-2xl border border-border p-6 md:p-8 mb-8">
          <h2 className="text-lg font-bold mb-4 text-neutral-900">제품 상세 설명</h2>
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
              {product?.description || "상세 설명이 없습니다."}
            </p>
          </div>
        </div>

        <CampaignPerformancePanel
          campaignId={campaign.id}
          rewardType={campaign.reward_type}
        />
      </main>
    </div>
  );
}

