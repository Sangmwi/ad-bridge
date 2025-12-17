# 📐 Ad-Bridge 프로젝트 구조도

**Version:** 1.1  
**Updated:** 2025-12-18

---

## 1. 디렉토리 구조

```
ad-bridge/
├── app/                          # Next.js App Router
│   ├── (main)/                   # 인증 필요 페이지 그룹
│   │   ├── advertiser/           # 광고주 전용 페이지
│   │   │   ├── dashboard/        # 대시보드 (CSR + React Query)
│   │   │   └── campaigns/
│   │   │       ├── [id]/         # 캠페인 상세 (CSR + React Query)
│   │   │       └── new/          # 캠페인 생성 (CSR)
│   │   ├── campaigns/            # 공용 캠페인 페이지
│   │   │   ├── page.tsx          # 캠페인 탐색 (CSR + React Query)
│   │   │   └── [id]/             # 캠페인 상세 (CSR + React Query)
│   │   ├── creator/              # 크리에이터 전용 페이지
│   │   │   └── my-campaigns/     # 내 캠페인 목록 (CSR + React Query)
│   │   └── layout.tsx            # 메인 레이아웃
│   ├── auth/                     # 인증 관련 페이지
│   │   ├── login/
│   │   ├── register/
│   │   ├── select-role/
│   │   └── callback/             # OAuth 콜백
│   ├── api/                      # API 라우트
│   │   └── advertiser/
│   │       └── campaigns/
│   │           └── [id]/
│   │               ├── creators/  # 크리에이터 목록 API
│   │               └── stats/    # 통계 API
│   ├── cl/                       # 트래킹 링크 (서버 라우트)
│   │   └── [campaignId]/[creatorId]/
│   ├── actions.ts                # 서버 액션
│   ├── layout.tsx                # 루트 레이아웃
│   └── page.tsx                  # 랜딩 페이지
│
├── components/                   # React 컴포넌트
│   ├── primitives/               # 원자적 UI 컴포넌트
│   │   ├── Badge 계열
│   │   │   ├── CategoryBadge.tsx
│   │   │   ├── CategoryText.tsx      # 대분류/소분류 텍스트
│   │   │   ├── CategoryTextServer.tsx
│   │   │   ├── RewardTypeBadge.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── ImageWithFallback.tsx     # 이미지 + Fallback
│   │   └── ProductPriceBadge.tsx     # 판매가 뱃지
│   ├── patterns/                 # 재사용 가능한 패턴
│   │   ├── CampaignListItem.tsx      # 목록 아이템
│   │   ├── LockedValue.tsx           # 잠금 가격 표시
│   │   ├── EmptyState.tsx
│   │   └── CopyField.tsx
│   ├── features/                 # 기능별 도메인 컴포넌트
│   │   ├── campaigns/
│   │   │   ├── CampaignList.tsx
│   │   │   ├── CampaignDetailForCreator.tsx
│   │   │   └── CampaignExploreFilterBar.tsx
│   │   └── advertiser/
│   │       └── campaigns/
│   │           └── CampaignPerformancePanel.tsx
│   ├── creator/                  # 크리에이터 전용 컴포넌트
│   │   ├── MyCampaignsList.tsx
│   │   └── MyCampaignListItem.tsx
│   ├── dashboard/                # 대시보드 컴포넌트
│   ├── ui/                       # 기본 UI 컴포넌트
│   └── providers/
│       └── QueryProvider.tsx     # React Query Provider
│
├── lib/                          # 공통 라이브러리
│   ├── types/                    # 타입 정의
│   │   └── campaign.ts           # Campaign, Product 타입
│   ├── queries/                  # React Query 훅
│   │   ├── auth.ts               # 인증 관련 쿼리
│   │   ├── campaigns.ts          # 캠페인 쿼리
│   │   ├── categories.ts         # 카테고리 쿼리
│   │   ├── advertiser.ts          # 광고주 쿼리
│   │   ├── creator.ts             # 크리에이터 쿼리
│   │   ├── dashboard.ts          # 대시보드 쿼리 (useDashboardStats - 통합됨)
│   │   ├── keys.ts               # 쿼리 키 관리
│   │   └── shop.ts               # 마이샵 쿼리
│   ├── productCategories.ts      # 카테고리 유틸
│   ├── format.ts                 # 포맷팅 유틸
│   ├── time.ts                   # 시간 유틸
│   └── utils.ts                  # 공통 유틸
│
├── utils/                        # 유틸리티
│   └── supabase/
│       ├── client.ts             # 클라이언트 Supabase
│       ├── server.ts             # 서버 Supabase
│       └── middleware.ts        # 미들웨어 헬퍼
│
├── middleware.ts                 # Next.js Middleware
├── docs/                         # 문서
│   ├── PRD.md                    # 제품 요구사항 문서
│   ├── ARCHITECTURE.md           # 아키텍처 문서
│   └── STRUCTURE.md              # 구조도 (본 문서)
└── sc/                           # 설계 문서
    └── design.md
```

---

## 2. 데이터 흐름도

### 2.1 캠페인 탐색 플로우

```
사용자
  ↓
/campaigns (페이지)
  ↓
CampaignList (Client Component)
  ↓
useCampaigns() + useCategories() + useUserProfile()
  ↓
React Query Cache
  ↓
Supabase Client
  ↓
PostgreSQL
  ↓
데이터 반환
  ↓
CampaignCard 렌더링
```

### 2.2 캠페인 상세 플로우

```
사용자
  ↓
/campaigns/[id] (페이지)
  ↓
CampaignDetailPageForCreator (Client Component)
  ↓
useCampaignDetail() + useUserProfile()
  ↓
React Query Cache
  ↓
Supabase Client
  ↓
PostgreSQL
  ↓
CampaignDetailForCreator 렌더링
```

### 2.3 광고주 대시보드 플로우

```
광고주
  ↓
/advertiser/dashboard (페이지)
  ↓
AdvertiserDashboardContent (Client Component)
  ↓
useUserProfile() + useAdvertiserCampaigns() + useAdvertiserPendingApplications()
  ↓
React Query Cache
  ↓
Supabase Client
  ↓
PostgreSQL
  ↓
데이터 반환 및 캐싱
```

### 2.4 트래킹 링크 플로우

```
소비자 클릭
  ↓
/cl/[campaignId]/[creatorId]
  ↓
서버 라우트 (GET)
  ↓
1. 캠페인 조회
2. 클릭 로그 기록 (clicks 테이블)
3. target_url로 리다이렉트
```

---

## 3. 컴포넌트 계층도

```
RootLayout
├── QueryProvider
│   └── QueryClient
├── Header
│   ├── Navigation
│   └── UserMenu
└── Page Content
    ├── Server Components (정적 레이아웃만)
    │   └── PageHeader
    │
    └── Client Components (동적 데이터 페칭)
        ├── AdvertiserDashboardContent
        │   ├── DashboardStats
        │   └── CampaignListWithStats
        ├── CampaignDetailContent (Advertiser)
        ├── CampaignList
        │   ├── CampaignExploreFilterBar
        │   └── CampaignCard
        │       ├── CategoryText
        │       ├── RewardTypeBadge
        │       └── LockedValue
        │
        ├── CampaignDetailForCreator
        │   ├── CategoryText
        │   └── ProductPriceBadge
        │
        └── MyCampaignsList
            └── MyCampaignListItem
                ├── ImageWithFallback
                └── StatusBadge
```

---

## 4. 상태 관리 구조

### 4.1 React Query 쿼리 구조

```
queryKeys (계층적 구조)
├── campaigns
│   ├── list(filters, userId)
│   └── detail(id)
├── categories
│   ├── all()
│   └── list()
├── auth
│   ├── user()
│   └── profile()
└── creatorCampaigns
    ├── myCampaigns()
    └── clickCounts(creatorId)
```

### 4.2 데이터 페칭 전략

| 페이지/기능 | 방식 | 이유 |
|------------|------|------|
| 캠페인 탐색 | CSR + React Query | 필터링, 검색 등 인터랙티브 |
| 캠페인 상세 (크리에이터) | CSR + React Query | React Query 캐싱 활용 |
| 캠페인 상세 (광고주) | CSR + React Query | React Query 캐싱 활용, 일관된 패턴 |
| 광고주 대시보드 | CSR + React Query | React Query 캐싱으로 네비게이션 최적화 |
| 내 캠페인 목록 | CSR + React Query | 실시간 업데이트 필요 |

---

## 5. 라우팅 및 인가

### 5.1 공용 경로 (인증 불필요)

- `/` - 랜딩 페이지
- `/auth/*` - 인증 관련
- `/campaigns` - 캠페인 탐색
- `/cl/*` - 트래킹 링크
- `/api/*` - API 라우트

### 5.2 보호된 경로

**크리에이터 전용**
- `/campaigns/[id]` - 캠페인 상세
- `/creator/my-campaigns` - 내 캠페인

**광고주 전용**
- `/advertiser/dashboard` - 대시보드
- `/advertiser/campaigns/*` - 캠페인 관리

### 5.3 Middleware 처리

1. 세션 확인 (Supabase Auth)
2. 공용 경로 체크
3. Role 확인 및 리다이렉트
4. 역할별 경로 접근 제어

---

## 6. 주요 데이터 모델

### 6.1 Campaign

```typescript
{
  id: string
  status: "active" | "inactive"
  reward_type: "cps" | "cpc"
  reward_amount: number | null
  created_at: string
  conditions: { min_followers: number }
  products: Product | Product[]
}
```

### 6.2 Product

```typescript
{
  name: string
  price: number | null
  image_url: string | null
  description: string
  category_id: string | null
  product_categories: {
    id: string
    name: string
    parent_id: string | null
  } | null
}
```

### 6.3 Category

```typescript
{
  id: string
  name: string
  parent_id: string | null
  depth: 1 | 2
  slug: string
}
```

---

## 7. 주요 기능 매핑

| 기능 | 컴포넌트 | 쿼리 훅 | 라우트 |
|------|----------|---------|--------|
| 캠페인 탐색 | CampaignList | useCampaigns | /campaigns |
| 캠페인 상세 | CampaignDetailForCreator | useCampaignDetail | /campaigns/[id] |
| 내 캠페인 | MyCampaignsList | useMyCampaigns | /creator/my-campaigns |
| 광고주 대시보드 | AdvertiserDashboard | useDashboardStats | /advertiser/dashboard |
| 트래킹 링크 | - | - | /cl/[campaignId]/[creatorId] |

---

## 8. 의존성 그래프

```
┌─────────────────────────────────────┐
│         Next.js 16                 │
│      (App Router)                  │
└──────────────┬──────────────────────┘
               │
    ┌──────────┴──────────┐
    │                     │
┌───▼────┐          ┌────▼────┐
│  SSR   │          │   CSR    │
│ Pages  │          │ Pages    │
└───┬────┘          └────┬────┘
    │                     │
    └──────────┬──────────┘
               │
      ┌────────▼────────┐
      │  React Query    │
      │  (TanStack)     │
      └────────┬────────┘
               │
      ┌────────▼────────┐
      │   Supabase     │
      │  (Client/      │
      │   Server)      │
      └────────┬────────┘
               │
      ┌────────▼────────┐
      │  PostgreSQL    │
      │  Database      │
      └────────────────┘
```

---

**문서 버전**: 1.0  
**최종 업데이트**: 2025-12-18

