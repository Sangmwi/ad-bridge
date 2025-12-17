import { Skeleton } from "@/components/primitives/Skeleton";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function CampaignDetailSkeleton() {
  return (
    <div className="min-h-screen bg-white w-full">
      <main className="">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/advertiser/dashboard"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>대시보드로 돌아가기</span>
          </Link>
        </div>

        {/* Campaign Overview Skeleton */}
        <div className="bg-white rounded-2xl border border-border p-8 mb-8 flex flex-col md:flex-row gap-8 items-start">
          {/* Image Skeleton */}
          <div className="w-full md:w-72 aspect-4/3 bg-neutral-100 rounded-lg shrink-0">
            <Skeleton className="w-full h-full rounded-lg" />
          </div>

          {/* Content Skeleton */}
          <div className="flex-1 min-w-0 w-full">
            <div className="flex flex-col">
              {/* Title + Actions */}
              <div className="flex items-start gap-2 w-full mb-4">
                <div className="min-w-0 flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-8 w-3/4 mb-2" />
                </div>
                <div className="hidden sm:flex gap-2">
                  <Skeleton className="h-9 w-16" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </div>

              {/* Status + Created at */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Meta badges */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-5 w-24" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Description Skeleton */}
        <div className="bg-white rounded-2xl border border-border p-6 md:p-8 mb-8">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Performance Panel Skeleton */}
        <div className="bg-white rounded-2xl border border-border p-6 md:p-8">
          <Skeleton className="h-6 w-40 mb-6" />
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <Skeleton className="h-5 w-24 mb-2" />
                <Skeleton className="h-8 w-32" />
              </div>
            ))}
          </div>
          <Skeleton className="h-64 w-full rounded-lg" />
        </div>
      </main>
    </div>
  );
}

