"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 쿼리 타입별로 staleTime 조정
            staleTime: (query) => {
              const queryKey = query.queryKey;
              const firstKey = queryKey[0];

              // 통계 데이터는 더 길게 (60초)
              if (firstKey === "dashboard") return 60_000;
              
              // 카테고리는 매우 길게 (60분)
              if (firstKey === "categories") return 60 * 60 * 1000;
              
              // 인증 정보는 중간 길이 (5분)
              if (firstKey === "auth") return 5 * 60 * 1000;
              
              // 기본값: 30초
              return 30_000;
            },
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}


