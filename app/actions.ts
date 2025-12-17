"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function signOut() {
  const supabase = await createClient();
  
  // 1. 서버 사이드 세션 삭제
  await supabase.auth.signOut();

  // 2. 캐시 무효화 (모든 경로의 레이아웃/페이지 데이터 갱신)
  revalidatePath("/", "layout");
  
  // 3. 메인 페이지로 리다이렉트
  redirect("/");
}

