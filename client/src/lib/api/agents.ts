import axiosInstance from "@/lib/axiosInstance";
import { Agent } from "@/features/computers/schemas/computer-schema";

export const agentsApi = {
    getAll: async (): Promise<Agent[]> => {
        const response = await axiosInstance.get("/agents");
        return response.data;
    },

    getById: async (id: string): Promise<Agent> => {
        const response = await axiosInstance.get(`/agents/${id}`);
        return response.data;
    },

    regenerateKey: async (id: string): Promise<{ apiKey: string }> => {
        const response = await axiosInstance.post(`/agents/${id}/regenerate-key`);
        return response.data;
    },
};

