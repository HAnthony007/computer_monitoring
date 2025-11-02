"use client";

import { useQuery } from "@tanstack/react-query";
import { computersApi } from "@/lib/api/computers";
import { computerListSchema } from "../schemas/computer-schema";

export const useComputers = () => {
    return useQuery({
        queryKey: ["computers"],
        queryFn: async () => {
            const data = await computersApi.getAll();
            return computerListSchema.parse(data);
        },
        refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
        refetchIntervalInBackground: true, // Continue polling when tab is in background
        staleTime: 5000, // Consider data stale after 5 seconds
    });
};

