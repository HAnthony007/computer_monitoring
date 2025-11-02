"use client";

import { useQuery } from "@tanstack/react-query";
import { computersApi } from "@/lib/api/computers";

export const useComputerDetails = (computerId: string) => {
    return useQuery({
        queryKey: ["computer", computerId],
        queryFn: async () => {
            return await computersApi.getById(computerId);
        },
        enabled: !!computerId,
    });
};

