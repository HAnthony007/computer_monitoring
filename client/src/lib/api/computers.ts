import axiosInstance from "@/lib/axiosInstance";
import { Computer } from "@/features/computers/schemas/computer-schema";
import { LatestMetrics, MetricsHistory } from "@/types/Metrics";

export const computersApi = {
    getAll: async (): Promise<Computer[]> => {
        const response = await axiosInstance.get("/computers");
        return response.data;
    },

    getById: async (id: string): Promise<Computer> => {
        const response = await axiosInstance.get(`/computers/${id}`);
        return response.data;
    },

    getAgents: async (computerId: string) => {
        const response = await axiosInstance.get(
            `/computers/${computerId}/agents`
        );
        return response.data;
    },
};

export const metricsApi = {
    getLatest: async (computerId: string): Promise<LatestMetrics> => {
        const response = await axiosInstance.get(
            `/computers/${computerId}/metrics/latest`
        );
        return response.data;
    },

    getHistory: async (
        computerId: string,
        params?: {
            type?: "cpu" | "memory" | "disk" | "network" | "processes";
            from?: string;
            to?: string;
            limit?: number;
            offset?: number;
        }
    ): Promise<MetricsHistory> => {
        const response = await axiosInstance.get(
            `/computers/${computerId}/metrics`,
            { params }
        );
        return response.data;
    },

    killProcess: async (computerId: string, pid: number): Promise<void> => {
        await axiosInstance.post(`/computers/${computerId}/processes/${pid}/kill`);
    },
};
