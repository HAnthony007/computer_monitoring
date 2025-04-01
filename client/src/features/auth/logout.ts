import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";

export const useHandleLogout = () => {
    const { logout } = useAuthStore();
    const router = useRouter();
    return async () => {
        await logout();
        router.push("/login");
    };
};
