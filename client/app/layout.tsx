import { FooterWrapper } from "@/components/layout/footer-wrapper";
import { HeaderWrapper } from "@/components/layout/header-wrapper";
import { Separator } from "@/components/ui/separator";
import { ThemeProvider } from "@/features/providers/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import "./globals.css";

const geist = Geist({
    weight: "400",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Monitoring System",
    description:
        "This application monitors computer performance (CPU, RAM, storage, etc.) in real-time. It is designed for system administrators and companies looking to track their machines efficiently.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning className="h-full">
            <body
                suppressHydrationWarning
                className={cn(
                    geist.className,
                    "antialiased h-full flex flex-col"
                )}
            >
                <NextTopLoader showSpinner={false} />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <HeaderWrapper />
                    <Toaster position="top-left" richColors closeButton />
                    <main className="flex-1">{children}</main>
                    <Separator />
                    <FooterWrapper />
                </ThemeProvider>
            </body>
        </html>
    );
}
