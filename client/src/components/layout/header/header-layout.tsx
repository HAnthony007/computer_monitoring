import { ToggleTheme } from "@/features/themes/theme-toogle";
import Image from "next/image";
import Link from "next/link";

export const HeaderLayout = () => {
    return (
        <header className="z-10 flex items-center justify-between px-4 py-2 border-b border-accent backdrop-blur-sm sticky top-0">
            <span>
                <Link
                    href="/"
                    className="flex items-center gap-2 font-semibold text-lg"
                >
                    <Image
                        src="/logo.webp"
                        alt="logo"
                        width={40}
                        height={40}
                        className="rounded-full"
                    />
                    Monitoring System
                </Link>
            </span>
            <div className="flex-1"></div>
            <div className="flex gap-2 justify-center items-center">
                {/* <Link href="/login">
                    <Button>Login</Button>
                </Link>
                <Link href="/signup">
                    <Button variant="outline">Signup</Button>
                </Link> */}
                <ToggleTheme />
            </div>
        </header>
    );
};
