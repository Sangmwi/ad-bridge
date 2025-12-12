"use client";

import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, CheckCircle } from "lucide-react";
import { useState } from "react";

type MyCampaignProps = {
  applicationId: string;
  campaign: {
    id: string;
    reward_type: string;
    reward_amount: number;
    products: {
      name: string;
      image_url: string | null;
      price: number;
    };
  };
  creatorId: string;
};

export function MyCampaignCard({ campaign, creatorId }: MyCampaignProps) {
  const [copied, setCopied] = useState(false);

  // 실제 서비스에서는 도메인을 환경변수 등으로 관리해야 합니다.
  // 트래킹 링크 형식: /cl/{campaign_id}/{creator_id}
  const trackingLink = `${window.location.origin}/cl/${campaign.id}/${creatorId}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(trackingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const product = Array.isArray(campaign.products)
    ? campaign.products[0]
    : campaign.products;

  if (!product) return null;

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden hover:shadow-md transition-all flex flex-col">
      {/* 상단 이미지 & 상태 */}
      <div className="relative h-48 bg-gray-100">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            No Image
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-green-500/90 text-white text-xs font-bold rounded-full flex items-center gap-1 backdrop-blur-sm">
            <CheckCircle className="w-3 h-3" />
            승인됨
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-3 py-1.5 rounded-lg font-semibold backdrop-blur-sm">
          {campaign.reward_type === "cps" ? "판매당" : "클릭당"} ₩
          {campaign.reward_amount.toLocaleString()}
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-4">
          판매가: ₩{product.price.toLocaleString()}
        </p>

        <div className="mt-auto space-y-3">
          {/* 링크 박스 */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-center justify-between gap-2">
            <code className="text-xs text-gray-500 truncate flex-1">
              {trackingLink}
            </code>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0"
              onClick={handleCopyLink}
              title="링크 복사"
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              className={`w-full ${copied ? "bg-green-600 hover:bg-green-700" : ""}`}
              onClick={handleCopyLink}
            >
              {copied ? "복사완료!" : "링크 복사"}
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <ExternalLink className="w-4 h-4" />
              상품 보기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

