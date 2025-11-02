import { FooterWrapper } from "@/components/layout/footer-wrapper";
import { HeaderWrapper } from "@/components/layout/header-wrapper";
import { Separator } from "@/components/ui/separator";
import Providers from "@/features/providers/providers";
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
        <html lang="en" suppressHydrationWarning className="h-full text-2xl">
            <body
                suppressHydrationWarning
                className={cn(
                    geist.className,
                    "antialiased h-full flex flex-col"
                )}
            >
                <NextTopLoader showSpinner={false} />
                <Providers>
                    <HeaderWrapper />
                    <Toaster position="top-right" richColors closeButton />
                    <main className="flex-1">{children}</main>
                    <Separator />
                    <FooterWrapper />
                </Providers>
            </body>
        </html>
    );
}
