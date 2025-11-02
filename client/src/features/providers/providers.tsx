"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <QueryProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </QueryProvider>
    );
}
