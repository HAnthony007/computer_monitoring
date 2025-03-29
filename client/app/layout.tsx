import { FooterLayout } from "@/components/layout/footer/footer-layout";
import { HeaderLayout } from "@/components/layout/header/header-layout";
import { Separator } from "@/components/ui/separator";
import { ThemeProvider } from "@/features/providers/theme-provider";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
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
                className={cn(
                    geistSans.variable,
                    geistMono.variable,
                    "antialiased h-full flex flex-col "
                )}
            >
                <NextTopLoader showSpinner={false} />
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <HeaderLayout />
                    <Toaster position="bottom-right" richColors closeButton />
                    <main className="flex-1">{children}</main>
                    <Separator />
                    <FooterLayout />
                </ThemeProvider>
            </body>
        </html>
    );
}
