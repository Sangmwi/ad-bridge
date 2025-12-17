"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Shield,
  Zap,
  Users,
  TrendingUp,
  CheckCircle2,
  Heart,
  BarChart3,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header removed (moved to layout) */}
      
      {/* Hero Section */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-24 md:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-sm font-medium">
                성과형 커머스 플랫폼
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                당신의 영향력을
                <br />
                <span className="text-primary">수익으로</span>
              </h1>

              <p className="text-lg text-neutral-600 leading-relaxed max-w-xl">
                광고주와 크리에이터를 성과형 커머스로 연결합니다. 나만의
                마이샵을 만들고, 좋아하는 제품을 판매하며, 투명한 수수료를
                받으세요.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/auth/login">
                  <Button size="lg" className="group w-full sm:w-auto">
                    크리에이터로 시작하기
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto"
                  >
                    광고주로 시작하기
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4">
                {["숨겨진 수수료 없음", "100% 정확한 귀속", "글로벌 진출"].map(
                  (item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 text-sm text-neutral-600"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span>{item}</span>
                    </div>
                  ),
                )}
              </div>
            </div>

            {/* Right: Visual */}
            <div className="relative">
              <div className="relative bg-white rounded-2xl shadow-lg border border-border p-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                      제
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">@제이미_shop</h3>
                      <p className="text-sm text-neutral-600">
                        패션 & 라이프스타일
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-xl bg-neutral-100"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-neutral-50">
                    <div>
                      <p className="text-sm text-neutral-600">
                        이번 달
                      </p>
                      <p className="text-2xl font-bold">₩3,420,000</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                </div>

                <div className="absolute -top-3 -right-3 bg-primary text-white px-4 py-2 rounded-lg shadow-lg text-sm font-semibold">
                  마이샵
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-20 px-6 lg:px-8 bg-neutral-50"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              왜 Ad-Bridge인가요?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              성과형 크리에이터 커머스를 위해 특별히 설계된 플랫폼
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Shield,
                title: "100% 정확한 귀속",
                description:
                  "마이샵 기반 추적으로 모든 판매가 정확하게 기록됩니다.",
              },
              {
                icon: Zap,
                title: "하이브리드 보상",
                description: "CPS 수수료와 기본 수수료를 모두 받으세요.",
              },
              {
                icon: Users,
                title: "직접 연결",
                description: "플랫폼 내 소통 관리로 공정한 협업을 보장합니다.",
              },
              {
                icon: TrendingUp,
                title: "브랜드 노출",
                description: "부스트 기능으로 신규 브랜드도 즉시 발견됩니다.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-xl bg-white border border-border hover:border-primary hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">이용 방법</h2>
          </div>

          {/* For Creators */}
          <div className="mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold mb-8 text-sm">
              <Heart className="w-4 h-4" />
              크리에이터
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "캠페인 탐색",
                  description:
                    "내 팔로워와 관심사에 맞는 브랜드와 제품을 발견하세요.",
                },
                {
                  step: "02",
                  title: "마이샵 구성",
                  description:
                    "승인받은 제품을 나만의 고유한 URL의 스토어에 추가하세요.",
                },
                {
                  step: "03",
                  title: "공유하고 수익 창출",
                  description:
                    "소셜 미디어에서 샵을 홍보하고 모든 판매에서 수수료를 받으세요.",
                },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="text-5xl font-bold text-primary/10 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 -right-4">
                      <ArrowRight className="w-6 h-6 text-neutral-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* For Brands */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-semibold mb-8 text-sm">
              <BarChart3 className="w-4 h-4" />
              광고주
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "캠페인 생성",
                  description:
                    "제품을 등록하고, 수수료 구조를 정의하며, 이상적인 크리에이터를 타겟팅하세요.",
                },
                {
                  step: "02",
                  title: "크리에이터 승인",
                  description:
                    "지원서를 검토하고 브랜드 가치에 부합하는 크리에이터를 승인하세요.",
                },
                {
                  step: "03",
                  title: "성과 추적",
                  description:
                    "실시간 대시보드에서 판매, ROI, 크리에이터 성과를 모니터링하세요.",
                },
              ].map((item, i) => (
                <div key={i} className="relative">
                  <div className="text-5xl font-bold text-primary/10 mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {item.description}
                  </p>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 -right-4">
                      <ArrowRight className="w-6 h-6 text-neutral-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section
        id="creators"
        className="py-20 px-6 lg:px-8 bg-neutral-50"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Creators */}
            <div className="p-8 rounded-2xl bg-white border border-border">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">크리에이터를 위한</h3>
              <p className="text-neutral-600 mb-6">
                팔로워 1만~10만? 진정으로 믿는 제품으로 영향력을 지속 가능한
                수익으로 전환하세요.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "개인 샵 구축",
                  "다양한 수익원",
                  "투명한 수수료",
                  "글로벌 제품 접근",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-neutral-700">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/login">
                <Button size="lg" className="w-full sm:w-auto">
                  수익 창출 시작
                </Button>
              </Link>
            </div>

            {/* Brands */}
            <div
              id="brands"
              className="p-8 rounded-2xl bg-primary text-white"
            >
              <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">광고주를 위한</h3>
              <p className="text-white/80 mb-6">
                진정성 있는 크리에이터 파트너십과 성과형 마케팅을 통해 성장할
                준비가 된 중소형 브랜드.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "수천 명의 크리에이터 접근",
                  "성과 기반 지불",
                  "실시간 분석",
                  "노출 부스트",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/auth/login">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full sm:w-auto bg-white text-primary hover:bg-white/90"
                >
                  캠페인 시작
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1)_100%)] bg-size-[64px_64px] opacity-10"></div>
        <div className="mx-auto max-w-4xl text-center relative z-10">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6 tracking-tight">
            다리를 놓을 준비가 되셨나요?
          </h2>
          <p className="text-lg text-white/90 mb-10 max-w-2xl mx-auto leading-relaxed">
            Ad-Bridge에서 지속 가능한 커머스 파트너십을 구축하는<br className="hidden sm:block" /> 
            수천 명의 크리에이터와 브랜드에 합류하세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto h-14 px-8 text-lg font-semibold bg-white text-primary hover:bg-white/90 shadow-xl border-0"
              >
                무료로 시작하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white pt-20 pb-10 px-6 lg:px-8 border-t border-neutral-800">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold text-xl text-white">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <span className="text-white font-bold text-lg">A</span>
                </div>
                <span>Ad-Bridge</span>
              </div>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-xs">
                크리에이터와 브랜드를 위한 투명하고 공정한<br/>성과형 커머스 플랫폼.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">서비스</h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li><Link href="#" className="hover:text-primary transition-colors">캠페인 탐색</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">광고주 찾기</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">성공 사례</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">요금제</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">회사</h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li><Link href="#" className="hover:text-primary transition-colors">회사 소개</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">채용 정보</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">블로그</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">문의하기</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">법적 고지</h4>
              <ul className="space-y-3 text-sm text-neutral-400">
                <li><Link href="#" className="hover:text-primary transition-colors">이용약관</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">개인정보처리방침</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">사업자 정보 확인</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
            <p>© 2025 Ad-Bridge. All rights reserved.</p>
            <div className="flex gap-4">
               {/* SNS Icons placehoder if needed */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
