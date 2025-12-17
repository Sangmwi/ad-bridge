"use client";

import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, CheckCircle, MousePointer2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { formatWon } from "@/lib/format";

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
  clicks: number;
};

export function MyCampaignCard({ campaign, creatorId, clicks }: MyCampaignProps) {
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const trackingLink = origin ? `${origin}/cl/${campaign.id}/${creatorId}` : "";

  const handleCopyLink = () => {
    if (!trackingLink) return;
    navigator.clipboard.writeText(trackingLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const product = Array.isArray(campaign.products)
    ? campaign.products[0]
    : campaign.products;

  if (!product) return null;

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden hover:border-primary hover:shadow-md transition-all flex flex-col group">
      {/* 상단 이미지 & 상태 */}
      <div className="relative h-48 bg-neutral-100 overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-400">
            No Image
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 bg-green-500/90 text-white text-xs font-bold rounded-full flex items-center gap-1.5 backdrop-blur-sm shadow-sm">
            <CheckCircle className="w-3.5 h-3.5" />
            승인됨
          </span>
        </div>
        <div className="absolute top-3 right-3 bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg font-semibold backdrop-blur-sm shadow-sm">
          {campaign.reward_type === "cps" ? "판매당" : "클릭당"} {formatWon(campaign.reward_amount)}
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="font-bold text-lg mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-neutral-500 mb-4">
          판매가: <span className="text-neutral-900 font-semibold">{formatWon(product.price)}</span>
        </p>

        {/* 성과 요약 */}
        <div className="mb-5 bg-neutral-50 rounded-lg p-3 flex items-center justify-between border border-neutral-100">
          <div className="flex items-center gap-2 text-sm text-neutral-600">
            <MousePointer2 className="w-4 h-4 text-primary" />
            <span>내 링크 클릭 수</span>
          </div>
          <span className="font-bold text-lg text-neutral-900">{clicks.toLocaleString()}</span>
        </div>

        <div className="mt-auto space-y-3">
          {/* 링크 박스 */}
          <div className="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200 flex items-center justify-between gap-2">
            <code className="text-xs text-neutral-500 truncate flex-1 font-mono bg-white px-2 py-1 rounded border border-neutral-100">
              {trackingLink || "링크 생성 중..."}
            </code>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 w-7 p-0 text-neutral-500 hover:text-primary"
              onClick={handleCopyLink}
              title="링크 복사"
              disabled={!trackingLink}
            >
              {copied ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              className={`w-full ${copied ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary-dark"}`}
              onClick={handleCopyLink}
              disabled={!trackingLink}
            >
              {copied ? "복사완료!" : "링크 복사"}
            </Button>
            {/* 실제 상품 페이지로 이동하는 버튼이 필요하다면 targetUrl이 필요하지만, 현재는 트래킹 링크 테스트용으로 대체 */}
            <Link href={trackingLink} target="_blank" className="w-full"> 
               <Button variant="outline" className="w-full gap-2 text-neutral-600" disabled={!trackingLink}>
                <ExternalLink className="w-4 h-4" />
                테스트
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

