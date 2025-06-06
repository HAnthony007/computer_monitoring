"use client"
import { useRequireAuth } from "../../src/hooks/useRequireAuth";
import Loading from "@app/loading";

export default function MainPage() {
    const { isLoading: isLoadingStats } = useRequireAuth();
    if (isLoadingStats) {
        return <Loading />;
    }
}
