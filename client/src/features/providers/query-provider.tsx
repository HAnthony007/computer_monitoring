"use client";

import {
    isServer,
    QueryClient,
    QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";

const makeQueryClient = () => {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 1000 * 60,
            },
        },
    });
};

let browserQueryClient: QueryClient | undefined;

const getQueryClient = () => {
    if (isServer) {
        return makeQueryClient();
    } else {
        if (!browserQueryClient) browserQueryClient = makeQueryClient();
        return browserQueryClient;
    }
};

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const queryClient = getQueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryStreamedHydration>
                {children}
            </ReactQueryStreamedHydration>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
