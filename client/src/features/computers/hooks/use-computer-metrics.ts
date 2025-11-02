"use client";

import { useQuery } from "@tanstack/react-query";
import { metricsApi } from "@/lib/api/computers";

export const useComputerMetrics = (computerId: string) => {
    return useQuery({
        queryKey: ["computer", computerId, "metrics"],
        queryFn: async () => {
            return await metricsApi.getLatest(computerId);
        },
        enabled: !!computerId,
        refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
        refetchIntervalInBackground: true, // Continue polling when tab is in background
        staleTime: 3000, // Consider data stale after 3 seconds
    });
};
