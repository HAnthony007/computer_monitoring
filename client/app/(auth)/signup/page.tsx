import Signup from "@/features/auth/signup/signup";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up | System Monitoring",
    description:
        "Join to access the real-time computer system monitoring and management platform.",
};
export default function SignupPage() {
    return <Signup />;
}
