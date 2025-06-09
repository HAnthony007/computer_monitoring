"use client"
import { SectionCards } from "@/features/dashboard/components/section-cards";
import Loading from "@app/loading";
import { useAuthStore } from "@/store/authStore";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function DashboardPage() {
    useAuthGuard();
    const { isLoading} = useAuthStore();

    if (isLoading) {
        return <Loading />;
    }

    return <SectionCards />;
}
