import { Login } from "@/features/auth/login/login";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login | System Monitoring",
    description:
        "Log in to access the real-time computer system monitoring and management platform.",
};

export default function LoginPage() {
    return <Login />;
}
