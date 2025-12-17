import { Skeleton } from "@/components/primitives/Skeleton";

export function CampaignDetailForCreatorSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container">
        {/* Image and Basic Info */}
        <div className="mb-8">
          <Skeleton className="w-full aspect-4/3 rounded-lg mb-6" />
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-8 w-3/4 mb-4" />
          <div className="flex gap-4 mb-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
        </div>

        {/* Description */}
        <div className="mb-8">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* Conditions */}
        <div className="mb-8">
          <Skeleton className="h-6 w-32 mb-4" />
          <Skeleton className="h-5 w-48" />
        </div>

        {/* Button */}
        <div className="flex justify-end">
          <Skeleton className="h-12 w-40 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

