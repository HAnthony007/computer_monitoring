"use client";
import { SectionCards } from "@/features/dashboard/components/section-cards";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Loading from "@app/loading";

export default function DashboardPage() {
    const { isLoading } = useAuthGuard();

    if (isLoading) {
        return <Loading />;
    }

    return <SectionCards />;
}
