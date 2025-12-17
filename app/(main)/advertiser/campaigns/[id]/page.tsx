import { CampaignDetailContent } from "@/components/features/advertiser/campaigns/CampaignDetailContent";

/**
 * 광고주 캠페인 상세 페이지
 * 
 * 레이아웃은 SSR로 유지하고, 데이터 페칭은 CSR (React Query)로 처리합니다.
 * 이를 통해 React Query 캐싱을 활용하여 네비게이션 성능을 최적화합니다.
 */
export default function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <CampaignDetailContentWrapper params={params} />;
}

async function CampaignDetailContentWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CampaignDetailContent campaignId={id} />;
}
