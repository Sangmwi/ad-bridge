"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatWon } from "@/lib/format";
import { formatTimeAgo } from "@/lib/time";
import { CategoryBadge } from "@/components/primitives/CategoryBadge";
import { LockedValue } from "@/components/patterns/LockedValue";
import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  name: string;
  price: number | null;
  image_url: string | null;
  description: string;
  category_id?: string | null;
  product_categories?: {
    id: string;
    name: string;
    parent_id: string | null;
  } | null;
};

type Campaign = {
  id: string;
  status: string;
  reward_type: string;
  reward_amount: number | null;
  created_at: string;
  conditions: { min_followers: number };
  products: Product | Product[] | null;
};

export function CampaignDetailForCreator({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const product = Array.isArray(campaign.products)
    ? campaign.products[0]
    : campaign.products;

  if (!product) return null;

  const category = product.product_categories;
  const categoryName = category?.name || null;

  const handleApply = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth/login");
        return;
      }

      const { error } = await supabase.from("campaign_applications").insert({
        campaign_id: campaign.id,
        creator_id: user.id,
        status: "pending",
      });

      if (error) {
        if (error.code === "23505") {
          alert("이미 신청한 캠페인입니다.");
        } else {
          throw error;
        }
      } else {
        alert("신청이 완료되었습니다! 광고주의 승인을 기다려주세요.");
        router.push("/creator/my-campaigns");
      }
    } catch (error) {
      console.error(error);
      alert("신청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/campaigns"
            className="inline-flex items-center gap-2 text-neutral-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>캠페인 탐색으로 돌아가기</span>
          </Link>
        </div>

        {/* Campaign Overview */}
        <div className="bg-card rounded-2xl border border-border p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Image */}
            <div className="w-full md:w-80 aspect-4/3 bg-neutral-100 rounded-xl overflow-hidden shrink-0">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-neutral-400">
                  No Image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-2xl md:text-3xl font-bold flex-1">{product.name}</h1>
                {categoryName && <CategoryBadge name={categoryName} size="md" />}
              </div>

              {/* Meta Info */}
              <div className="flex flex-wrap items-center gap-3 md:gap-4 mb-4 text-sm">
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
                    <LockedValue
                      locked={product.price === null}
                      value={product.price !== null ? formatWon(product.price) : ""}
                      preview="????원"
                      className="inline-flex"
                    />
                  </span>
                </div>
              </div>

              {/* Created At */}
              <p className="text-xs text-neutral-500 mb-6">
                {formatTimeAgo(campaign.created_at)} ·{" "}
                {new Date(campaign.created_at).toLocaleDateString()}
              </p>

              {/* Conditions */}
              {campaign.conditions?.min_followers != null && campaign.conditions.min_followers > 0 && (
                <div className="mb-6 p-4 bg-neutral-50 rounded-lg border border-border">
                  <p className="text-sm text-neutral-600">
                    <span className="font-semibold">최소 팔로워 수:</span>{" "}
                    {campaign.conditions.min_followers.toLocaleString()}명
                  </p>
                </div>
              )}

              {/* Apply Button */}
              <div className="flex justify-end mt-auto pt-6">
                <Button
                  onClick={handleApply}
                  disabled={loading}
                  size="lg"
                  className="w-full md:w-auto"
                >
                  {loading ? "신청 중..." : "캠페인 신청하기"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description - Separated Section */}
        <div className="bg-card rounded-2xl border border-border p-6 md:p-8">
          <h2 className="text-lg font-bold mb-4 text-neutral-900">제품 상세 설명</h2>
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
              {product.description || "상세 설명이 없습니다."}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

