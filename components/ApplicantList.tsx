"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { Check, X } from "lucide-react";

type Application = {
  id: string;
  status: string;
  created_at: string;
  campaigns: {
    products: {
      name: string;
    };
  };
  profiles: {
    email: string;
  };
};

export function ApplicantList({
  initialApplications,
}: {
  initialApplications: any[];
}) {
  const [applications, setApplications] = useState(initialApplications);
  const supabase = createClient();

  const handleStatusUpdate = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      const { error } = await supabase
        .from("campaign_applications")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      // 목록에서 제거 (처리 완료된 항목 숨김)
      setApplications((prev) => prev.filter((app) => app.id !== id));
      
      alert(newStatus === "approved" ? "승인되었습니다." : "거절되었습니다.");
    } catch (error) {
      console.error(error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-10 text-[var(--neutral-600)]">
        대기 중인 지원자가 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((app) => (
        <div
          key={app.id}
          className="flex items-center justify-between p-4 rounded-lg border border-[var(--border)] bg-white hover:border-[var(--primary)] transition-all"
        >
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{app.profiles?.email}</span>
              <span className="text-sm text-[var(--neutral-600)]">님이</span>
            </div>
            <p className="text-sm mt-1">
              <span className="font-medium text-[var(--primary)]">
                {app.campaigns?.products?.name}
              </span>{" "}
              캠페인에 지원했습니다.
            </p>
            <p className="text-xs text-[var(--neutral-400)] mt-1">
              {new Date(app.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
              onClick={() => handleStatusUpdate(app.id, "rejected")}
            >
              <X className="w-4 h-4 mr-1" />
              거절
            </Button>
            <Button
              size="sm"
              className="bg-[var(--primary)] hover:bg-[var(--primary-dark)]"
              onClick={() => handleStatusUpdate(app.id, "approved")}
            >
              <Check className="w-4 h-4 mr-1" />
              승인
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

