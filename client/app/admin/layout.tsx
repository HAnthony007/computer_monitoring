import Header from "@/components/layout/app/header/header-app";
import { FooterLayout } from "@/components/layout/site/footer/footer-layout";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/features/app/sidebar-app";

export default function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
