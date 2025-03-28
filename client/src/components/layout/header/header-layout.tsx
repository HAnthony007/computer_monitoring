import { Button } from "@/components/ui/button";
import { ToggleTheme } from "@/features/themes/theme-toogle";
import Link from "next/link";

export const HeaderLayout = () => {
    return (
        <header className="flex items-center justify-between px-4 py-2 border-b border-accent">
            <p>Monitoring System</p>
            <div className="flex-1"></div>
            <div className="flex gap-2 justify-center items-center">
                <Link href="/login">
                    <Button>Login</Button>
                </Link>
                <Link href="/signup">
                    <Button variant="outline">Signup</Button>
                </Link>
                <ToggleTheme />
            </div>
        </header>
    );
};
