"use client"
import { useEffect } from 'react';
import { useAuthStore } from "@/store/authStore";
import { useParams, useRouter } from "next/navigation";

export function useRequireAuth() {
    const { user, isLoading } = useAuthStore();
    const router = useRouter();
    const { role } = useParams();

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                // Redirect to login if not logged in
                router.push("/login");
            } else if (user.role !== role) {
                // Redirect to correct dashboard if role doesn't match
                router.push(`/${user.role}/dashboard`);
            }
        }
    }, [user, isLoading, role, router]);

    // Optionally return loading state
    return { isLoading, user };
} 