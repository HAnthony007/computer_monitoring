import axiosInstance from "@/lib/axiosInstance";
import { User } from "@/types/User";
import { create } from "zustand";

type AuthState = {
    user: User | null;
    isLoading: boolean;
    fetchUser: () => Promise<void>;
    // login: (data: User) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isLoading: true,

    fetchUser: async () => {
        try {
            const response = await axiosInstance.get("/auth/me");
            set({ user: response.data });
        } catch (error) {
            console.error("Error fetching user:", error);
            set({ user: null });
        } finally {
            set({ isLoading: false });
        }
    },

    login: async (email: string, password: string) => {
        try {
            const response = await axiosInstance.post("/auth/login", {
                email,
                password,
            });
            set({ user: response.data });
            return response;
        } catch (error: any) {
            console.log(error);
            throw error.response?.data || "Login failed. Please try again.";
        }
    },

    logout: async () => {
        await axiosInstance.post("/auth/logout");
        set({ user: null });
    },
}));
