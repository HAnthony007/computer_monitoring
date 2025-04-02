"use client";
import { useAuthStore } from "@/store/authStore";
import Loading from "@app/loading";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainPage() {
    const router = useRouter();
    const { user, isLoading } = useAuthStore();
    const role = user?.role;

    useEffect(() => {
        router.push(`/${role}/dashboard`);
    }, [role, router]);

    if (isLoading || !user) {
        return <Loading />;
    }
}
