"use client";
import Header from "@/components/layout/app/header/header-app";
import { FooterLayout } from "@/components/layout/site/footer/footer-layout";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/features/app/sidebar-app";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading, fetchUser } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        fetchUser();
    }, []);

    useEffect(() => {
        if (!isLoading && user) {
            const expectedRoute = `/${user.role}/dashboard`;
            if (window.location.pathname !== expectedRoute) {
                router.push(expectedRoute);
            }
        }
    }, [user, isLoading, router]);
    return (
        <SidebarProvider className="z-10 h-full min-h-full">
            <AppSidebar />
            <SidebarInset>
                <Header />
                {children}
                <FooterLayout />
            </SidebarInset>
        </SidebarProvider>
    );
}
