"use client";

import { metricsApi } from "@/lib/api/computers";
import { useQuery } from "@tanstack/react-query";

export const useComputerMetrics = (computerId: string) => {
    return useQuery({
        queryKey: ["computer", computerId, "metrics"],
        queryFn: async () => {
            return await metricsApi.getLatest(computerId);
        },
        enabled: !!computerId,
        refetchInterval: 3000, // Refetch every 3 seconds for real-time updates
        refetchIntervalInBackground: true, // Continue polling when tab is in background
        staleTime: 2000, // Consider data stale after 2 seconds
    });
};
