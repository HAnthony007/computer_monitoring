"use client";

import { metricsApi } from "@/lib/api/computers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export const useKillProcess = (computerId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (pid: number) => {
            await metricsApi.killProcess(computerId, pid);
        },
        onSuccess: () => {
            // Invalidate and refetch metrics to show updated process list
            queryClient.invalidateQueries({
                queryKey: ["computer", computerId, "metrics"],
            });
            toast.success("Process killed successfully");
        },
        onError: (error: unknown) => {
            const errorMessage = isAxiosError(error)
                ? error.response?.data?.message || error.message
                : error instanceof Error
                ? error.message
                : "Failed to kill process";
            toast.error(errorMessage);
        },
    });
};
