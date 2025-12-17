import { Skeleton } from "@/components/primitives/Skeleton";
import { CardGrid } from "@/components/patterns/CardGrid";

export function CampaignListSkeleton() {
  return (
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
  );
}

