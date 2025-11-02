import axiosInstance from "@/lib/axiosInstance";
import { User } from "@/types/User";
import { AxiosResponse } from "axios";
import { create } from "zustand";

type AuthState = {
    user: User | null;
    isLoading: boolean;
    fetchUser: () => Promise<void>;
    // login: (data: User) => Promise<void>;
    login: (email: string, password: string) => Promise<AxiosResponse<User>>;
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
        } catch (error: unknown) {
            console.log(error);
            if (error && typeof error === "object" && "response" in error) {
                const axiosError = error as { response?: { data?: unknown } };
                throw (
                    axiosError.response?.data ||
                    "Login failed. Please try again."
                );
            }
            throw "Login failed. Please try again.";
        }
    },

    logout: async () => {
        await axiosInstance.post("/auth/logout");
        document.cookie =
            "JSESSIONID=; Max-Age=0; path=/; HttpOnly; Secure; SameSite=Strict";
        set({ user: null });
    },
}));
