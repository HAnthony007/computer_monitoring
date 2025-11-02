"use client";

import { dashboardApi } from "@/lib/api/dashboard";
import { useQuery } from "@tanstack/react-query";

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ["dashboard", "stats"],
        queryFn: async () => {
            return await dashboardApi.getStats();
        },
        refetchInterval: 5000, // Refetch every 5 seconds for real-time updates
        refetchIntervalInBackground: true, // Continue polling when tab is in background
        staleTime: 3000, // Consider data stale after 3 seconds
    });
};
