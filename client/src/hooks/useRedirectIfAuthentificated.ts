import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useRedirectIfAuthentificated() {
    const { user, isLoading, fetchUser } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (isLoading && user === null) {
            fetchUser();
        }
        if (!isLoading && user !== null) {
            router.replace(`/${user.role}/dashboard`);
        }
    }, [user, isLoading, fetchUser, router]);
    return { isLoading };
}