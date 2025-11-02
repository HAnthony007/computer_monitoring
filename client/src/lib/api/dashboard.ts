import axiosInstance from "@/lib/axiosInstance";
import { ComputerSummary, DashboardStats } from "@/types/Dashboard";

export const dashboardApi = {
    getStats: async (): Promise<DashboardStats> => {
        const response = await axiosInstance.get("/dashboard/stats");
        return response.data;
    },

    getComputersSummary: async (): Promise<ComputerSummary[]> => {
        const response = await axiosInstance.get(
            "/dashboard/computers-summary"
        );
        return response.data;
    },
};
