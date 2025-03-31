"use client";
import { useAuthStore } from "@/store/authStore";
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
        return <h1 className="h-full ">Loading...</h1>;
    }

    return (
        <h1 className="h-full ">
            Bienvennue: {user?.username} sur votre dashboard
        </h1>
    );
}
