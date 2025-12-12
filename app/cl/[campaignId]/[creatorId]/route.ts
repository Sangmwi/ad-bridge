import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ campaignId: string; creatorId: string }> }
) {
  const { campaignId, creatorId } = await params;
  const supabase = await createClient();

  // 1. 캠페인 및 타겟 URL 조회
  // (성능을 위해 products 테이블을 조인해서 target_url을 바로 가져옴)
  const { data: campaign, error } = await supabase
    .from("campaigns")
    .select(
      `
      id,
      products (
        target_url
      )
    `,
    )
    .eq("id", campaignId)
    .single();

  if (error || !campaign || !campaign.products) {
    console.error("Tracking Error: Campaign not found", error);
    return new NextResponse("Campaign not found", { status: 404 });
  }

  // target_url이 없으면 기본 페이지로 이동 (방어 코드)
  // 타입 단언: Supabase 응답 타입이 정확하지 않을 수 있어 any로 처리하거나 유연하게 접근
  const productData = Array.isArray(campaign.products)
    ? campaign.products[0]
    : campaign.products;
    
  const targetUrl = productData?.target_url || "/";

  // 2. 클릭 로그 기록 (비동기로 처리하여 리다이렉트 속도 저하 방지)
  // 주의: Vercel 등 Serverless 환경에서는 await를 안 하면 프로세스가 죽을 수 있어 await 권장
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  await supabase.from("clicks").insert({
    campaign_id: campaignId,
    creator_id: creatorId,
    ip_address: ip,
    user_agent: userAgent,
  });

  // 3. 실제 판매 페이지로 리다이렉트
  return NextResponse.redirect(targetUrl);
}

