"use client";
import { I18nProviderClient } from "@/components/locales/client";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { FC, ReactNode } from "react";

export type ProvidersProps = {
    locale: string;
    children: ReactNode;
};

export const Providers: FC<ProvidersProps> = ({ locale, children }) => {
    return (
        <I18nProviderClient locale={locale}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </I18nProviderClient>
    );
};
