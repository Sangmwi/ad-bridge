# 📘 Ad-Bridge — Product Requirements Document (PRD)

**Version:** 1.0
**Updated:** 2025-12-11
**Document Purpose:**
Ad-Bridge는 **광고주(브랜드/셀러)**와 **중소형 크리에이터**를 연결하여, *성과 기반 판매(Performance Commerce)*를 통해 매출을 발생시키는 글로벌 커머스 플랫폼이다.
본 문서는 Ad-Bridge의 MVP 제품 요구사항을 명확히 정의해, 기획·디자인·개발·운영 모든 팀의 기준점을 제공한다.

---

# 0. Product Vision

> _"누구나 자신의 영향력으로 돈을 벌고, 작은 브랜드도 세계 어디서든 성장하는 성과형 커머스 생태계를 만든다."_

- 광고주는 쉽게 크리에이터 기반 판매 채널을 확장한다.
- 크리에이터는 **개인 마이샵(My Shop)**을 기반으로 지속적인 수익을 창출한다.
- 어트리뷰션은 "링크/쿠키가 아닌 **마이샵 중심 구조**"로 100% 명확하게 보장된다.

---

# 1. Ad-Bridge 개요 (Overview)

## 1.1 한 줄 정의

광고주는 캠페인을 등록하고, 크리에이터는 이를 공유하여 자신의 **마이샵**에서 제품을 판매하며, 결제 기반으로 보상을 정산받는 _성과형 광고·커머스 플랫폼_.

## 1.2 핵심 차별점 (USP)

| Pain Point       | 기존 문제                       | Ad-Bridge의 해결책                        |
| ---------------- | ------------------------------- | ----------------------------------------- |
| 어트리뷰션 누락  | 쿠키/링크 기반 누락·중복        | **My Shop 고유 URL 기반 직접 어트리뷰션** |
| 플랫폼 우회거래  | 광고주가 크리에이터 개인 연락   | **플랫폼 내 메시징 + 정보 노출 제한**     |
| CPS-only 위험    | "안 팔리면 0원" 구조            | **Hybrid 보상 모델(CPS+고정비) 지원**     |
| 신규 브랜드 외면 | 크리에이터는 인기 캠페인만 선택 | **Boost 노출 기능 제공**                  |

---

# 2. 주요 사용자 (User Roles)

### ① Advertiser / Seller

브랜드, 스마트스토어 셀러, Shopify 셀러는 제품을 등록하고 캠페인을 운영한다.

### ② Creator (크리에이터)

팔로워 1만~10만 규모의 인플루언서 중심.
캠페인을 선택하여 마이샵에서 제품을 판매한다.

### ③ Customer (소비자)

크리에이터 마이샵에서 실제로 제품을 구매하는 최종 유저.

### ④ Admin (관리자)

캠페인 관리, 승인, 신고 처리, 정산 검증 담당.

---

# 3. 비즈니스 플로우 (High-Level Flows)

## 3.1 광고주 플로우

1. 회원가입 → 브랜드 프로필 생성
2. 제품(Product) 등록
3. 캠페인(Campaign) 생성
   - 보상 모델(CPS/CPC/Flat/Hybrid)
   - 조건(국가/팔로워 수/카테고리)
   - Boost 옵션
4. 크리에이터 지원 승인/거절
5. 성과 확인 (판매/매출/ROI)
6. 정산 요청

---

## 3.2 크리에이터 플로우

1. 회원가입 & SNS 인증
2. 캠페인 탐색/필터
3. 캠페인 지원 또는 마이샵 담기
4. 승인된 제품 자동 진열
5. 마이샵 링크(SNS/유튜브)에 공유
6. 실적(판매/수익) 확인
7. 정산 요청

---

## 3.3 마이샵(My Shop) 플로우 — Ad-Bridge의 핵심

1. 크리에이터마다 고유 URL 발급
   - 예: `https://ad-bridge.com/shop/@jamie`
2. 소비자는 이 URL에서만 구매
3. Orders.attributed_creator_id로 귀속
4. 판매 기반으로 CPS 계산
5. 성과·수익이 명확하게 구분됨

**핵심 가치:**

- 정확한 어트리뷰션
- 크리에이터 수익 극대화
- 정산 구조 단순화
- 장기적 판매 생태계 구축

---

# 4. 기능 요구사항 (Functional Requirements)

## 4.1 계정/인증

- 회원가입/로그인(JWT 기반)
- 역할(Role) 기반 접근 제어
- SNS API 연동(추후 확장)

---

## 4.2 광고주 기능

### 제품(Product) 등록

- 제목 / 가격 / 카테고리 / 이미지 / 설명 / 판매 국가

### 캠페인(Campaign) 등록

- 보상 모델
  - CPS(amount/%), CPC, Flat Fee, Hybrid
- 조건
  - 타겟 국가, 언어, 팔로워 수, 관심사
- 마케팅 옵션
  - is_new_brand
  - boost_level
  - boost 기간

### 캠페인 운영

- 지원 크리에이터 승인/거절
- 캠페인 성과 대시보드
- 정산 요청

---

## 4.3 크리에이터 기능

- 캠페인 탐색/필터링
- 캠페인 지원
- 마이샵 담기(Add to My Shop)
- 마이샵 자동 구성
- SNS 공유용 링크 생성
- 실적 확인 & 정산 요청

---

## 4.4 마이샵(My Shop)

### 구성 요소

- 프로필/핸들
- 진열된 제품 목록
- 장바구니/결제 기능
- 리뷰(추후)
- 어트리뷰션 자동 기록

### 핵심 룰

`"이 마이샵에서 발생한 모든 주문 → 해당 크리에이터의 실적"`

---

## 4.5 주문/결제(Orders)

- 장바구니 → 결제(PG 연동)
- 결제 성공 시 order 생성
- 필수 기록: attributed_creator_id
- 주문 상태 관리(PAID / REFUNDED / CANCELED)

---

## 4.6 대시보드

### 광고주

- 캠페인별 판매
- 크리에이터별 성과
- 예산 소진 상태

### 크리에이터

- 마이샵 판매 통계
- CPS 수익
- 예상 정산액

### 관리자

- 사용자 관리
- 캠페인 승인
- 신고 처리
- 정산 검증

---

# 5. 비기능 요구사항 (NFR)

## 5.1 기술 스택

- **Frontend:** Next.js, TypeScript
- **Backend:** Node.js + Express or Next.js API Routes
- **DB:** PostgreSQL
- **Storage:** S3 호환 스토리지
- **Auth:** JWT & Role-based Access Control

---

## 5.2 확장성

- product_id, creator_id 등 인덱스 최적화
- Boost 정렬 처리 (boost_level DESC → created_at DESC)
- 추천 알고리즘을 위한 이벤트 로그 구조 준비

---

## 5.3 보안

- bcrypt 기반 패스워드 해싱
- 민감정보 암호화
- 결제정보 저장 금지(PG 위임)
- Role 기반 접근 제어

---

# 6. 데이터 모델 (Entity Model)

## Users

- id
- role (ADVERTISER / CREATOR / ADMIN)
- email
- password_hash
- created_at

## Creators

- user_id(FK)
- handle
- display_name
- profile_image_url
- sns_channels(JSON)

## Advertisers

- user_id(FK)
- brand_name
- homepage_url
- description

## Products

- id
- advertiser_id(FK)
- name
- category
- price
- currency
- description
- image_url
- status

## Campaigns

- id
- product_id(FK)
- reward_type(CPS, CPC, FLAT, HYBRID)
- cps_amount
- base_fee
- max_budget
- start_at / end_at
- min_followers
- target_country
- is_new_brand
- boost_level
- status

## ShopSelections (My Shop)

- id
- creator_id
- product_id
- campaign_id
- custom_comment
- created_at

## Orders

- id
- customer_id(optional)
- attributed_creator_id
- product_id
- campaign_id
- quantity
- total_amount
- status(PAID, REFUNDED, CANCELED)
- created_at

---

# 7. MVP 범위 (Scope)

## 포함

- 회원가입/로그인
- 제품 등록
- 캠페인 등록/리스트
- 크리에이터 캠페인 탐색 및 지원
- 마이샵 생성 및 제품 진열
- 장바구니 및 결제 구조
- Orders에 creator attribution 저장
- 대시보드 기본 기능
- 관리자 기본 패널

## 제외(향후 개발)

- AI 추천 알고리즘
- 자동 정산
- 고급 필터링/랭킹 시스템
- 리뷰/평점
- 글로벌 다국어 지원
- LLM 기반 상담

---

# 8. 주요 KPI

### Creator KPI

- 마이샵 방문수
- 판매량
- CPS 기준 수익

### Advertiser KPI

- 참여 크리에이터 수
- 전환율(CTR → 결제)
- 캠페인 매출

### Platform KPI

- 전체 거래액(GMV)
- 플랫폼 수수료
- Boost 구매 매출

---

# 9. 리스크 & 대응

| 리스크                      | 대응 방안                       |
| --------------------------- | ------------------------------- |
| CPS-only 모델의 낮은 참여율 | Hybrid(고정비+성과비) 모델 지원 |
| 신규 브랜드 기피            | Boost 기능, 추천 우선순위 조정  |
| 우회 거래                   | 플랫폼 내 메시징 제한           |
| 어트리뷰션 오류             | My Shop 구매 구조 고정          |

---

# 10. 로드맵 (Roadmap)

## Phase 1 — MVP

- 캠페인/마이샵/결제 기본 구조
- 대시보드
- Admin 패널
- 수기 정산 프로세스

## Phase 2

- 리뷰/평점 시스템
- SNS API 인증 자동화
- Boost 결제 기능
- 크리에이터 성장 추천

## Phase 3

- 자동 정산
- AI 기반 콘텐츠 분석·매칭
- 글로벌 지원(다국어/다국가 결제)

---

# ✔️ Next Steps

1. ERD 설계
2. API 스펙 정의
3. DB 스키마 작성
4. Next.js 라우팅/페이지 구조 제안
5. MVP 코드 구현
