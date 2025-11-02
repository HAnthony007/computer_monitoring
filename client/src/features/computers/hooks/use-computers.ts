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
    });
};

