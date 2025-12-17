import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .select("reward_type,reward_amount")
    .eq("id", id)
    .single();

  if (campaignError || !campaign) {
    return NextResponse.json(
      { message: "캠페인을 찾을 수 없습니다." },
      { status: 404 }
    );
  }

  const { count: totalClicks, error: clicksError } = await supabase
    .from("clicks")
    .select("*", { count: "exact", head: true })
    .eq("campaign_id", id);

  if (clicksError) {
    return NextResponse.json(
      { message: "클릭 통계를 불러오지 못했습니다." },
      { status: 500 }
    );
  }

  const clicks = totalClicks ?? 0;
  const estimatedSpend =
    campaign.reward_type === "cpc" ? clicks * campaign.reward_amount : 0;

  return NextResponse.json({
    totalClicks: clicks,
    estimatedSpend,
  });
}


