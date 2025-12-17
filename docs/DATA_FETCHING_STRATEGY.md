# 📊 데이터 페칭 전략 가이드

**Date:** 2025-12-18

---

## 핵심 원칙

### ✅ CSR (Client-Side Rendering) - 데이터 페칭

**언제 사용:**
- 동적 데이터 (캠페인 목록, 사용자 정보, 통계 등)
- 인터랙티브 기능 (필터링, 검색, 정렬)
- React Query로 관리되는 모든 데이터

**이유:**
- ✅ 캐싱 활용 (네비게이션 시 즉시 표시)
- ✅ 백그라운드 리페칭 (자동 업데이트)
- ✅ 일관된 패턴 (코드 유지보수성)
- ✅ 클라이언트 사이드 네비게이션 최적화

### ✅ SSR (Server-Side Rendering) - 정적 컨텐츠

**언제 사용:**
- 정적 레이아웃 (Header, Footer, Navigation)
- 정적 텍스트 (랜딩 페이지 콘텐츠)
- SEO가 중요한 페이지 (공개 페이지)

**이유:**
- ✅ 초기 HTML에 포함 (빠른 First Paint)
- ✅ SEO 최적화
- ✅ 검색 엔진 크롤링 용이

---

## ✅ 현재 구조 (2025-12-18 업데이트 완료)

### ✅ CSR 우선 전략 (최적화 완료)

```typescript
// 광고주 대시보드 - CSR로 데이터 페칭
export default function AdvertiserDashboard() {
  return <AdvertiserDashboardContent />; // 정적 레이아웃만
}

"use client";
function AdvertiserDashboardContent() {
  const { data: profile } = useUserProfile();
  const { data: campaigns } = useAdvertiserCampaigns(profile?.user?.id);
  
  // React Query 캐시 활용 ✅
  // 네비게이션 시 즉시 표시 ✅
  
  return (
    <div>
      <PageHeader title={`안녕하세요, ${profile?.nickname || '브랜드 매니저'}님!`} />
      <DashboardStats campaignIds={campaignIds} />
      <CampaignListWithStats campaigns={campaigns} />
    </div>
  );
}
```

**개선 효과:**
- ✅ React Query 캐시 활용
- ✅ 네비게이션 시 즉시 표시
- ✅ 일관된 데이터 페칭 패턴

---

### ✅ 권장 구조

```typescript
// 광고주 대시보드 - 레이아웃만 SSR, 데이터는 CSR
export default function AdvertiserDashboard() {
  return (
    <div>
      {/* 정적 레이아웃 - SSR ✅ */}
      <PageHeader title="대시보드" />
      
      {/* 동적 데이터 - CSR ✅ */}
      <DashboardContent />
    </div>
  );
}

// Client Component
"use client";
function DashboardContent() {
  const { data: user } = useUser();
  const { data: campaigns } = useQuery({
    queryKey: ["advertiser", "campaigns", user?.id],
    queryFn: () => fetchCampaigns(user?.id),
  });
  
  // React Query 캐시 활용 ✅
  // 네비게이션 시 즉시 표시 ✅
  
  return (
    <>
      <DashboardStats campaignIds={campaignIds} />
      <CampaignListWithStats campaigns={campaigns} />
    </>
  );
}
```

---

## 구체적인 적용 예시

### 1. 광고주 대시보드

**변경 전 (SSR):**
```typescript
// app/(main)/advertiser/dashboard/page.tsx
export default async function AdvertiserDashboard() {
  const campaigns = await supabase.from("campaigns").select(...); // ❌
  return <CampaignList campaigns={campaigns} />;
}
```

**변경 후 (CSR):**
```typescript
// app/(main)/advertiser/dashboard/page.tsx
export default function AdvertiserDashboard() {
  return <DashboardContent />; // 정적 레이아웃만
}

// components/dashboard/DashboardContent.tsx
"use client";
export function DashboardContent() {
  const { data: campaigns } = useAdvertiserCampaigns(); // ✅ CSR
  return <CampaignList campaigns={campaigns} />;
}
```

---

### 2. 캠페인 상세 페이지

**변경 전 (SSR):**
```typescript
// app/(main)/advertiser/campaigns/[id]/page.tsx
export default async function CampaignDetailPage({ params }) {
  const campaign = await supabase.from("campaigns").select(...).eq("id", id); // ❌
  return <CampaignDetail campaign={campaign} />;
}
```

**변경 후 (CSR):**
```typescript
// app/(main)/advertiser/campaigns/[id]/page.tsx
export default function CampaignDetailPage({ params }: { params: { id: string } }) {
  return <CampaignDetailContent id={params.id} />; // 정적 라우팅만
}

// components/features/advertiser/campaigns/CampaignDetailContent.tsx
"use client";
export function CampaignDetailContent({ id }: { id: string }) {
  const { data: campaign } = useCampaignDetail(id); // ✅ CSR
  return <CampaignDetail campaign={campaign} />;
}
```

---

### 3. 정적 레이아웃은 SSR 유지

**올바른 사용 예시:**
```typescript
// app/layout.tsx - SSR ✅
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* 정적 Header - SSR ✅ */}
        <Header />
        {children}
      </body>
    </html>
  );
}

// components/patterns/PageHeader.tsx - SSR ✅
export function PageHeader({ title, description }) {
  return (
    <div>
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  );
}
```

---

## 데이터 페칭 패턴 비교

| 페이지 | 현재 상태 | 이유 |
|--------|----------|------|
| 광고주 대시보드 | ✅ CSR (데이터) | React Query 캐싱 활용 |
| 광고주 캠페인 상세 | ✅ CSR (데이터) | React Query 캐싱 활용 |
| 크리에이터 캠페인 탐색 | ✅ CSR | 필터링, 검색 등 인터랙티브 |
| 크리에이터 캠페인 상세 | ✅ CSR | React Query 캐싱 활용 |
| 레이아웃 (Header, Footer) | ✅ SSR | 정적 컨텐츠 |
| 랜딩 페이지 | ✅ SSR | SEO 중요 |

---

## ✅ 마이그레이션 완료 (2025-12-18)

### 단계 1: 쿼리 훅 생성 ✅
- ✅ `useAdvertiserCampaigns()` 생성
- ✅ `useAdvertiserPendingApplications()` 생성
- ✅ 기존 SSR 로직을 쿼리 함수로 이동
- ✅ 중복 쿼리 통합 (`useDashboardStats`로 통합)

### 단계 2: 페이지 컴포넌트 분리 ✅
- ✅ Server Component: 정적 레이아웃만 유지
- ✅ Client Component: 데이터 페칭 및 표시
- ✅ 스켈레톤 UI 적용

### 단계 3: 추가 개선 ✅
- ✅ React Query 설정 최적화 (쿼리 타입별 staleTime 조정)
- ✅ 로딩 상태 처리 개선 (스켈레톤 UI)
- ✅ 사용자 닉네임 기능 추가

---

## 성능 기대 효과

### 네비게이션 개선
- **현재**: SSR → 페이지 이동 시 매번 새로 페칭 (500-1000ms)
- **개선 후**: CSR → React Query 캐시 즉시 표시 (0ms)

### 네트워크 요청 감소
- **현재**: 페이지 이동 시마다 API 호출
- **개선 후**: 캐시된 데이터 재사용 (30초 내)

### 코드 일관성
- **현재**: SSR + CSR 혼재
- **개선 후**: 일관된 CSR 패턴

---

## 예외 사항

### SSR이 여전히 필요한 경우

1. **SEO가 중요한 공개 페이지**
   ```typescript
   // 랜딩 페이지 - SSR ✅
   export default async function LandingPage() {
     const featuredCampaigns = await fetchFeaturedCampaigns();
     return <LandingContent campaigns={featuredCampaigns} />;
   }
   ```

2. **초기 로드가 매우 중요한 경우**
   - 랜딩 페이지
   - 공개 블로그/콘텐츠 페이지

3. **서버에서만 접근 가능한 데이터**
   - 민감한 서버 설정
   - 환경 변수

---

## 요약

### ✅ CSR로 통합할 것
- 모든 동적 데이터 페칭
- React Query로 관리되는 데이터
- 인터랙티브 기능

### ✅ SSR 유지할 것
- 정적 레이아웃 (Header, Footer)
- 정적 텍스트/콘텐츠
- SEO가 중요한 공개 페이지

### ❌ 하이브리드 피할 것
- SSR로 데이터 페칭 + CSR로 통계 (현재 광고주 페이지)
- 일관성 없는 패턴

**결론: 데이터 페칭은 CSR + React Query로 통합, 정적 컨텐츠는 SSR 유지**

