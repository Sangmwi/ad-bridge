"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/Header";
import { TrendingUp, Users, DollarSign, Target, Plus } from "lucide-react";

export default function AdvertiserDashboard() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-3">
            안녕하세요, 브랜드 매니저님!
          </h1>
          <p className="text-lg text-[var(--neutral-600)]">
            캠페인 성과를 확인하세요 📊
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <span className="text-xs text-[var(--success)] font-semibold">
                +18%
              </span>
            </div>
            <p className="text-sm text-[var(--neutral-600)] mb-1">
              이번 달 매출
            </p>
            <p className="text-3xl font-bold">₩12,840,000</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <span className="text-xs text-[var(--success)] font-semibold">
                +12
              </span>
            </div>
            <p className="text-sm text-[var(--neutral-600)] mb-1">
              활성 크리에이터
            </p>
            <p className="text-3xl font-bold">47</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <span className="text-xs text-[var(--info)] font-semibold">
                진행중
              </span>
            </div>
            <p className="text-sm text-[var(--neutral-600)] mb-1">
              활성 캠페인
            </p>
            <p className="text-3xl font-bold">8</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[var(--primary)]" />
              </div>
              <span className="text-xs text-[var(--success)] font-semibold">
                +2.3x
              </span>
            </div>
            <p className="text-sm text-[var(--neutral-600)] mb-1">평균 ROI</p>
            <p className="text-3xl font-bold">3.8x</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link
            href="/advertiser/campaigns/new"
            className="group p-8 rounded-xl border-2 border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">새 캠페인 만들기</h3>
              <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center group-hover:bg-[var(--primary)] transition-colors">
                <Plus className="w-5 h-5 text-[var(--primary)] group-hover:text-white group-hover:rotate-90 transition-all" />
              </div>
            </div>
            <p className="text-[var(--neutral-600)]">
              제품과 조건을 설정하여 캠페인을 시작하세요
            </p>
          </Link>

          <button className="group p-8 rounded-xl bg-[var(--primary)] text-white hover:shadow-md transition-all text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">크리에이터 지원서</h3>
              <span className="px-3 py-1.5 rounded-lg bg-white/20 text-sm font-semibold">
                12건
              </span>
            </div>
            <p className="text-white/90">
              새로운 크리에이터 지원서를 검토하세요
            </p>
          </button>
        </div>

        {/* Active Campaigns */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-8 mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">활성 캠페인</h2>
            <Button variant="ghost" size="sm">
              전체 보기
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                name: "여름 컬렉션 프로모션",
                creators: 15,
                sales: "₩3,240,000",
                status: "진행중",
              },
              {
                name: "신제품 런칭 캠페인",
                creators: 12,
                sales: "₩2,890,000",
                status: "진행중",
              },
              {
                name: "특별 할인 이벤트",
                creators: 20,
                sales: "₩4,120,000",
                status: "진행중",
              },
              {
                name: "인플루언서 협업",
                creators: 8,
                sales: "₩1,650,000",
                status: "진행중",
              },
            ].map((campaign, i) => (
              <div
                key={i}
                className="p-5 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--neutral-50)] transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold">{campaign.name}</h3>
                  <span className="px-2 py-1 rounded-md bg-[var(--success)]/10 text-[var(--success)] text-xs font-semibold">
                    {campaign.status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <p className="text-[var(--neutral-600)]">크리에이터</p>
                    <p className="font-semibold">{campaign.creators}명</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[var(--neutral-600)]">매출</p>
                    <p className="font-semibold text-[var(--primary)]">
                      {campaign.sales}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-[var(--border)] p-8">
          <h2 className="text-2xl font-bold mb-6">최근 활동</h2>
          <div className="space-y-3">
            {[
              {
                action: "새로운 판매",
                creator: "@제이미_shop",
                amount: "₩89,000",
                time: "10분 전",
              },
              {
                action: "크리에이터 지원",
                creator: "@뷰티러버",
                amount: "승인 대기",
                time: "30분 전",
              },
              {
                action: "새로운 판매",
                creator: "@패션피플",
                amount: "₩125,000",
                time: "1시간 전",
              },
              {
                action: "캠페인 종료",
                campaign: "봄 시즌 세일",
                amount: "성공",
                time: "어제",
              },
            ].map((activity, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--neutral-50)] transition-all"
              >
                <div>
                  <p className="font-semibold">{activity.action}</p>
                  <p className="text-sm text-[var(--neutral-600)]">
                    {activity.creator || activity.campaign}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[var(--primary)]">
                    {activity.amount}
                  </p>
                  <p className="text-sm text-[var(--neutral-600)]">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
