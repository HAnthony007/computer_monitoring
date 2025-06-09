"use client"
import { SectionCards } from "@/features/dashboard/components/section-cards";
import Loading from "@app/loading";
import { useAuthGuard } from "@/hooks/useAuthGuard";

export default function DashboardPage() {
    const { isLoading } = useAuthGuard();

    if (isLoading) {
        return <Loading />;
    }

    return <SectionCards />;
}
