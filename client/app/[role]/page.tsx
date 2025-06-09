"use client"
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useAuthStore } from "@/store/authStore";
import Loading from "@app/loading";

export default function MainPage() {
    useAuthGuard();
    const { user, isLoading } = useAuthStore()
    if (isLoading || !user) {
        return <Loading />
    }
}
