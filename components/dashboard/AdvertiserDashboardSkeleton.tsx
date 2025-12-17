import { PageHeader } from "@/components/patterns/PageHeader";
import { Surface } from "@/components/primitives/Surface";
import { Skeleton } from "@/components/primitives/Skeleton";
import { DashboardStatsSkeleton } from "./DashboardStatsSkeleton";

export function AdvertiserDashboardSkeleton() {
  return (
    <div className="min-h-screen bg-white w-full">
      <main>
        <PageHeader
          title="안녕하세요, 매니저님!"
          description="캠페인 성과를 확인하세요"
          className="mb-12"
        />

        {/* Stats Grid Skeleton */}
        <DashboardStatsSkeleton />

        {/* Quick Actions & Applicants Skeleton */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Action Card Skeleton */}
          <Surface className="p-8 rounded-xl">
            <Skeleton className="h-6 w-40 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </Surface>

          {/* Applicants List Skeleton */}
          <Surface className="p-8 rounded-xl bg-neutral-50 border border-border">
            <div className="flex items-center justify-between mb-6">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-6 w-6 rounded-full" variant="circular" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-lg border border-border bg-white">
                  <Skeleton className="h-4 w-48 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
          </Surface>
        </div>

        {/* Campaigns List Skeleton */}
        <Surface className="p-8 mb-12">
          <Skeleton className="h-8 w-32 mb-6" />
          <div className="grid md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-6 rounded-lg border border-border">
                <Skeleton className="h-5 w-3/4 mb-4" />
                <div className="flex justify-between items-center">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Surface>
      </main>
    </div>
  );
}

