"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ["dashboard", "stats"],
        queryFn: async () => {
            return await dashboardApi.getStats();
        },
        refetchInterval: 15000, // Refetch every 15 seconds for real-time updates
        refetchIntervalInBackground: true, // Continue polling when tab is in background
        staleTime: 10000, // Consider data stale after 10 seconds
    });
};

