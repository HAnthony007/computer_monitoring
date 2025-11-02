"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api/dashboard";

export const useDashboardStats = () => {
    return useQuery({
        queryKey: ["dashboard", "stats"],
        queryFn: async () => {
            return await dashboardApi.getStats();
        },
    });
};

