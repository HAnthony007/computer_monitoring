"use client"
import { SectionCards } from "@/features/dashboard/components/section-cards";
import Loading from "@app/loading";
import { useRequireAuth } from "../../../src/hooks/useRequireAuth";

export default function DashboardPage() {
    const { isLoading: isLoadingStats, user: statsUser } = useRequireAuth();

    if (isLoadingStats) {
        return <Loading />;
    }

    return <SectionCards />;
}
