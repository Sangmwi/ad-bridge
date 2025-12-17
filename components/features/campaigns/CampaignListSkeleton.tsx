import { Skeleton } from "@/components/primitives/Skeleton";
import { CardGrid } from "@/components/patterns/CardGrid";

export function CampaignExploreFilterBarSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-border p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-3 items-end">
        {/* Search Input */}
        <div className="flex-1 w-full">
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>

        {/* Category Filters */}
        <div className="flex gap-3 w-full md:w-auto">
          <Skeleton className="h-10 w-32 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 w-full md:w-auto">
          <Skeleton className="h-10 w-20 rounded-lg" />
          <Skeleton className="h-10 w-20 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function CampaignListSkeleton() {
  return (
    <>
      <CampaignExploreFilterBarSkeleton />
      <CardGrid>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-border p-6">
            {/* Image */}
            <Skeleton className="w-full aspect-4/3 rounded-lg mb-4" />

            {/* Category */}
            <Skeleton className="h-3 w-24 mb-2" />

            {/* Title */}
            <Skeleton className="h-6 w-3/4 mb-3" />

            {/* Description */}
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3 mb-4" />

            {/* Price and Reward */}
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-32" />
            </div>

            {/* Button */}
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ))}
      </CardGrid>
    </>
  );
}

