import { Skeleton } from "@/components/primitives/Skeleton";

export function MyCampaignsListSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="flex items-center gap-4 p-5 rounded-lg border border-border bg-white"
        >
          {/* Image Skeleton */}
          <Skeleton className="w-24 h-24 rounded-lg shrink-0" />

          {/* Content Skeleton */}
          <div className="flex-1 min-w-0">
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-32 mb-3" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          {/* Actions Skeleton */}
          <div className="flex-shrink-0 flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-9 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

