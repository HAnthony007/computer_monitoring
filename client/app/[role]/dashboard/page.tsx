"use client";
import { SectionCards } from "@/features/dashboard/components/section-cards";
import { useAuthStore } from "@/store/authStore";
import Loading from "@app/loading";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
    const { user, isLoading } = useAuthStore();
    const router = useRouter();
    const { role } = useParams();

    useEffect(() => {
        if (!isLoading && user) {
            if (user.role !== role) {
                router.push(`/${user.role}/dashboard`);
            }
        } else if (!isLoading && !user) {
            router.push("/login");
        }
    }, [user, isLoading, role, router]);

    if (isLoading) {
        return <Loading />;
    }

    return <SectionCards />;
}
