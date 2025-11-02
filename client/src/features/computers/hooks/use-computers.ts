"use client";

import { computersApi } from "@/lib/api/computers";
import { useQuery } from "@tanstack/react-query";
import { computerListSchema } from "../schemas/computer-schema";

export const useComputers = () => {
    return useQuery({
        queryKey: ["computers"],
        queryFn: async () => {
            const data = await computersApi.getAll();
            return computerListSchema.parse(data);
        },
        refetchInterval: 3000, // Refetch every 3 seconds for real-time updates
        refetchIntervalInBackground: true, // Continue polling when tab is in background
        staleTime: 2000, // Consider data stale after 2 seconds
    });
};
