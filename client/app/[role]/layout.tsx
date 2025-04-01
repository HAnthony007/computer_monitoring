"use client";
import { SiteHeader } from "@/components/layout/app/header/site-header";
import { FooterLayout } from "@/components/layout/site/footer/footer-layout";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/features/app/sidebar-app";
import { useAuthStore } from "@/store/authStore";
import Loading from "@app/loading";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isLoading, fetchUser } = useAuthStore();
    const router = useRouter();
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        fetchUser();
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (!isLoading && user && hasMounted) {
            const expectedRoute = `/${user.role}/dashboard`;
            if (
                typeof window !== "undefined" &&
                window.location.pathname !== expectedRoute
            ) {
                router.push(expectedRoute);
            }
        }
    }, [user, isLoading, router, hasMounted]);

    if (isLoading || !hasMounted) {
        return <Loading />;
    }
    return (
        // <SidebarProvider className="z-10 h-full min-h-full">
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                {/* <Header /> */}
                <SiteHeader />
                <div className="flex flex-1 flex-col">
                    <div className="@container/main flex flex-1 flex-col gap-2">
                        {children}
                    </div>
                </div>
                <FooterLayout />
            </SidebarInset>
        </SidebarProvider>
    );
}
