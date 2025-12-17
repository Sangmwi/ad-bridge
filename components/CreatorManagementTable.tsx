"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatusBadge } from "@/components/primitives/StatusBadge";
import {
  MoreHorizontal,
  Instagram,
  Youtube,
  Search,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

// Types
type Creator = {
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

// Icon mapping
const ChannelIcon = ({ type, url }: { type: string; url?: string }) => {
  if (!url) return null;
  
  let icon = <ExternalLink className="w-5 h-5" />;
  if (type === "instagram") icon = <Instagram className="w-5 h-5" />;
  if (type === "youtube") icon = <Youtube className="w-5 h-5" />;
  if (type === "tiktok") icon = <span className="font-bold text-xs">TikTok</span>;
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 text-neutral-500 hover:bg-primary hover:text-white transition-all"
      onClick={(e) => e.stopPropagation()}
    >
      {icon}
    </a>
  );
};

export function CreatorManagementTable({
  data,
  campaignId,
}: {
  data: Creator[];
  campaignId: string;
}) {
  const [creators, setCreators] = useState(data);
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [sortConfig, setSortConfig] = useState<{
    key: "clicks" | "joinedAt";
    direction: "asc" | "desc";
  }>({ key: "clicks", direction: "desc" });
  
  const supabase = createClient();
  const router = useRouter();

  // Sorting logic
  const sortedCreators = [...creators].sort((a, b) => {
    if (sortConfig.key === "clicks") {
      return sortConfig.direction === "desc"
        ? b.clicks - a.clicks
        : a.clicks - b.clicks;
    } else {
      return sortConfig.direction === "desc"
        ? new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
        : new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
    }
  });

  const handleStatusUpdate = async (applicationId: string, newStatus: string) => {
    if (!confirm("정말 상태를 변경하시겠습니까?")) return;

    try {
      const { error } = await supabase
        .from("campaign_applications")
        .update({ status: newStatus })
        .eq("id", applicationId);

      if (error) throw error;

      setCreators((prev) =>
        prev.map((c) =>
          c.applicationId === applicationId ? { ...c, status: newStatus } : c
        )
      );
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Header & Filter */}
      <div className="p-4 border-b border-border flex justify-between items-center bg-white">
        <h3 className="font-bold text-lg">참여 크리에이터 <span className="text-neutral-400 text-sm font-normal ml-1">{creators.length}명</span></h3>
        <div className="flex gap-2">
          <select
            className="text-sm border border-border rounded-lg px-3 py-2 bg-white hover:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            onChange={(e) =>
              setSortConfig({
                key: e.target.value as "clicks" | "joinedAt",
                direction: "desc",
              })
            }
          >
            <option value="clicks">기여도(클릭) 높은 순</option>
            <option value="joinedAt">최신 승인 순</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-neutral-50 text-neutral-500 font-medium border-b border-border">
            <tr>
              <th className="px-6 py-3 whitespace-nowrap">크리에이터</th>
              <th className="px-6 py-3 whitespace-nowrap">채널</th>
              <th className="px-6 py-3 text-right whitespace-nowrap">팔로워</th>
              <th className="px-6 py-3 text-right whitespace-nowrap">기여도 (클릭)</th>
              <th className="px-6 py-3 text-center whitespace-nowrap">상태</th>
              <th className="px-6 py-3 text-right whitespace-nowrap">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {sortedCreators.map((creator) => (
              <tr
                key={creator.creatorId}
                className="hover:bg-neutral-50 transition-colors cursor-pointer group"
                onClick={() => setSelectedCreator(creator)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden border border-border">
                      {creator.profileImage ? (
                        <img
                          src={creator.profileImage}
                          alt={creator.handle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-neutral-400 font-bold">
                          {creator.handle.substring(0, 1).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold flex items-center gap-1 text-neutral-900">
                        {creator.handle}
                        {creator.followers > 1000 && (
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                        )}
                      </div>
                      <div className="text-xs text-neutral-500">{creator.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1.5">
                    <ChannelIcon
                      type="instagram"
                      url={creator.channels.instagram}
                    />
                    <ChannelIcon type="youtube" url={creator.channels.youtube} />
                    <ChannelIcon type="tiktok" url={creator.channels.tiktok} />
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-medium text-neutral-600">
                  {creator.followers.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <span className="font-bold text-lg text-primary">{creator.clicks.toLocaleString()}</span>
                    <span className="text-xs font-normal text-neutral-400 mt-1">
                      clicks
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <StatusBadge
                    size="md"
                    tone={creator.status === "approved" ? "success" : "danger"}
                  >
                    {creator.status === "approved" ? "활동중" : "중단됨"}
                  </StatusBadge>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-3 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate(
                        creator.applicationId,
                        creator.status === "approved" ? "rejected" : "approved"
                      );
                    }}
                  >
                    {creator.status === "approved" ? "중단" : "복구"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedCreator && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedCreator(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8 border-b border-border text-center bg-neutral-50/50">
              <div className="w-24 h-24 rounded-full bg-white mx-auto mb-5 flex items-center justify-center shadow-md overflow-hidden border-4 border-white">
                {selectedCreator.profileImage ? (
                  <img
                    src={selectedCreator.profileImage}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-neutral-300">
                    {selectedCreator.handle.substring(0, 1)}
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-bold text-neutral-900">{selectedCreator.handle}</h2>
              <p className="text-neutral-500 text-sm mt-1">{selectedCreator.email}</p>
              
              <div className="flex justify-center gap-3 mt-6">
                <ChannelIcon type="instagram" url={selectedCreator.channels.instagram} />
                <ChannelIcon type="youtube" url={selectedCreator.channels.youtube} />
                <ChannelIcon type="tiktok" url={selectedCreator.channels.tiktok} />
              </div>
            </div>

            <div className="p-8 space-y-8">
               <div>
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                  소개
                </label>
                <p className="text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-lg text-sm">
                  {selectedCreator.bio || "등록된 소개가 없습니다."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl text-center">
                  <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">
                    총 팔로워
                  </p>
                  <p className="text-2xl font-bold text-blue-900 mt-2">
                    {selectedCreator.followers.toLocaleString()}
                  </p>
                </div>
                <div className="p-5 bg-green-50/50 border border-green-100 rounded-2xl text-center">
                  <p className="text-xs text-green-600 font-bold uppercase tracking-wider">
                    기여한 클릭
                  </p>
                  <p className="text-2xl font-bold text-green-900 mt-2">
                    {selectedCreator.clicks.toLocaleString()}
                  </p>
                </div>
              </div>

              <Button
                className="w-full h-12 text-base"
                variant="outline"
                onClick={() => setSelectedCreator(null)}
              >
                닫기
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

