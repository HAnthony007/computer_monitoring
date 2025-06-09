"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export function useAuthGuard() {
    const { user, isLoading, fetchUser } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isLoading && user === null) {
            fetchUser();
        }
        if (!isLoading && user === null) {
            router.replace("/login");
        }
    }, [user, isLoading, fetchUser, router]);
    return { isLoading };
}
