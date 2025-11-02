"use client";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import Loading from "@app/loading";

export default function DashboardLayout({
    children,
    bar_stats,
}: {
    children: React.ReactNode;
    bar_stats: React.ReactNode;
}) {
    const { isLoading } = useAuthGuard();

    if (isLoading) {
        return <Loading />;
    }
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {children}
            <div className="px-4 lg:px-6">{bar_stats}</div>
        </div>
    );
}
