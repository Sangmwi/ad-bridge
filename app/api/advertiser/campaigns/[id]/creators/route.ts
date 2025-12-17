import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

type CreatorRow = {
  applicationId: string;
  creatorId: string;
  status: string;
  joinedAt: string;
  email: string;
  handle: string;
  bio: string | null;
  profileImage: string | null;
  channels: {
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  followers: number;
  clicks: number;
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: applications, error: appError } = await supabase
    .from("campaign_applications")
    .select(
      `
      id,
      status,
      created_at,
      creator_id,
      profiles (
        email,
        creator_details (
          handle,
          bio,
          profile_image_url,
          instagram_url,
          youtube_url,
          tiktok_url,
          followers_count
        )
      )
    `
    )
    .eq("campaign_id", id)
    .in("status", ["approved", "rejected"]);

  if (appError) {
    return NextResponse.json(
      { message: "참여 크리에이터를 불러오지 못했습니다." },
      { status: 500 }
    );
  }

  const { data: clickCounts, error: clickError } = await supabase.rpc(
    "get_click_counts_by_creator",
    { p_campaign_id: id }
  );

  if (clickError) {
    return NextResponse.json(
      { message: "클릭 통계를 불러오지 못했습니다." },
      { status: 500 }
    );
  }

  const clickMap = new Map<string, number>();
  for (const row of (clickCounts as any[]) ?? []) {
    if (row?.creator_id) clickMap.set(row.creator_id, Number(row.clicks ?? 0));
  }

  const creatorsData: CreatorRow[] = (applications || []).map((app: any) => {
    const details = Array.isArray(app.profiles?.creator_details)
      ? app.profiles.creator_details[0]
      : app.profiles?.creator_details;

    return {
      applicationId: app.id,
      creatorId: app.creator_id,
      status: app.status,
      joinedAt: app.created_at,
      email: app.profiles?.email || "",
      handle: details?.handle || "Unknown",
      bio: details?.bio || null,
      profileImage: details?.profile_image_url || null,
      channels: {
        instagram: details?.instagram_url,
        youtube: details?.youtube_url,
        tiktok: details?.tiktok_url,
      },
      followers: details?.followers_count || 0,
      clicks: clickMap.get(app.creator_id) || 0,
    };
  });

  return NextResponse.json({
    creators: creatorsData,
    activeCreatorsCount: creatorsData.filter((c) => c.status === "approved")
      .length,
  });
}


