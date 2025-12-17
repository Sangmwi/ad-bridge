import { AdvertiserDashboardContent } from "@/components/dashboard/AdvertiserDashboardContent";

/**
 * 광고주 대시보드 페이지
 * 
 * 레이아웃은 SSR로 유지하고, 데이터 페칭은 CSR (React Query)로 처리합니다.
 * 이를 통해 React Query 캐싱을 활용하여 네비게이션 성능을 최적화합니다.
 */
export default function AdvertiserDashboard() {
  return <AdvertiserDashboardContent />;
}
