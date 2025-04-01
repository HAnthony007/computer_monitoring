"use client";
import { useAuthStore } from "@/store/authStore";
import Loading from "@app/loading";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function PagePage() {
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

    return (
        <h1 className="h-full ">
            Bienvennue: {user?.username} sur votre dashboard
        </h1>
    );
}
