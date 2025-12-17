import { Skeleton } from "@/components/primitives/Skeleton";
import { StatCard } from "@/components/patterns/StatCard";
import { DollarSign, Users, Target, TrendingUp } from "lucide-react";

export function DashboardStatsSkeleton() {
  return (
    <div className="grid md:grid-cols-4 gap-6 mb-12">
      <StatCard
        icon={<DollarSign className="w-6 h-6" />}
        label="총 유입 클릭"
        value={<Skeleton className="h-6 w-20" variant="text" />}
      />
      <StatCard
        icon={<Users className="w-6 h-6" />}
        label="활성 크리에이터"
        value={<Skeleton className="h-6 w-16" variant="text" />}
      />
      <StatCard
        icon={<Target className="w-6 h-6" />}
        label="활성 캠페인"
        value={<Skeleton className="h-6 w-12" variant="text" />}
      />
      <StatCard
        icon={<TrendingUp className="w-6 h-6" />}
        label="평균 클릭 수"
        value={<Skeleton className="h-6 w-20" variant="text" />}
      />
    </div>
  );
}

