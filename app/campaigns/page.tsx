"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search, Filter, TrendingUp, Heart, Star } from "lucide-react";

export default function CampaignsPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--neutral-200)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-teal)] flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-2xl font-bold">Ad-Bridge</span>
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              href="/creator/dashboard"
              className="text-sm font-medium text-[var(--neutral-800)] hover:text-[var(--primary)]"
            >
              대시보드
            </Link>
            <Link
              href="/campaigns"
              className="text-sm font-medium text-[var(--primary)]"
            >
              캠페인
            </Link>
            <Link
              href="/my-shop"
              className="text-sm font-medium text-[var(--neutral-800)] hover:text-[var(--primary)]"
            >
              마이샵
            </Link>
            <Button variant="ghost" size="sm">
              @제이미_shop
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">캠페인 탐색</h1>
          <p className="text-[var(--neutral-800)]">
            나에게 맞는 브랜드와 제품을 찾아보세요
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--neutral-800)]" />
            <input
              type="text"
              placeholder="캠페인, 브랜드, 카테고리 검색..."
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--neutral-200)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
            />
          </div>
          <Button variant="outline" size="lg">
            <Filter className="w-4 h-4 mr-2" />
            필터
          </Button>
        </div>

        {/* Campaign Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              brand: "뷰티 브랜드 X",
              campaign: "여름 스킨케어 컬렉션",
              category: "뷰티",
              commission: "15% CPS + ₩10,000 기본",
              bonus: "부스트",
              image: "bg-gradient-to-br from-pink-400 to-purple-400",
            },
            {
              brand: "패션 하우스 Y",
              campaign: "가을 신상 프리뷰",
              category: "패션",
              commission: "20% CPS",
              image: "bg-gradient-to-br from-amber-400 to-orange-400",
            },
            {
              brand: "라이프스타일 Z",
              campaign: "홈 인테리어 특가",
              category: "리빙",
              commission: "12% CPS + ₩15,000 기본",
              bonus: "신규",
              image: "bg-gradient-to-br from-teal-400 to-cyan-400",
            },
            {
              brand: "헬스케어 A",
              campaign: "영양제 시리즈",
              category: "건강",
              commission: "18% CPS",
              image: "bg-gradient-to-br from-green-400 to-emerald-400",
            },
            {
              brand: "테크 브랜드 B",
              campaign: "스마트 기기 런칭",
              category: "전자제품",
              commission: "10% CPS + ₩20,000 기본",
              bonus: "인기",
              image: "bg-gradient-to-br from-blue-400 to-indigo-400",
            },
            {
              brand: "푸드 컴퍼니 C",
              campaign: "건강 간식 세트",
              category: "식품",
              commission: "25% CPS",
              bonus: "부스트",
              image: "bg-gradient-to-br from-red-400 to-rose-400",
            },
          ].map((campaign, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[var(--neutral-200)] overflow-hidden hover:shadow-xl transition-all group"
            >
              <div className={`h-48 ${campaign.image} relative`}>
                {campaign.bonus && (
                  <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-[var(--primary)]">
                    {campaign.bonus}
                  </span>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-[var(--accent-light)] text-[var(--accent)] font-semibold">
                    {campaign.category}
                  </span>
                  <button className="text-[var(--neutral-800)] hover:text-red-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="font-bold text-lg mb-1">{campaign.campaign}</h3>
                <p className="text-sm text-[var(--neutral-800)] mb-4">
                  {campaign.brand}
                </p>

                <div className="pt-4 border-t border-[var(--neutral-200)]">
                  <p className="text-xs text-[var(--neutral-800)] mb-2">
                    수수료
                  </p>
                  <p className="font-semibold text-[var(--primary)] mb-4">
                    {campaign.commission}
                  </p>

                  <div className="flex gap-2">
                    <Button variant="default" size="sm" className="flex-1">
                      지원하기
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      상세보기
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
