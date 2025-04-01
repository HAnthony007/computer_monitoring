"use client";

import { UserRole } from "@/types/User";
import { usePathname } from "next/navigation";
import { HeaderLayout } from "./site/header/header-layout";

export const HeaderWrapper = () => {
    const pathname = usePathname();
    const isRolePath = UserRole.some((role) => pathname.startsWith(`/${role}`));
    const isDashboardPath = pathname.startsWith("/dashboard");
    return <>{isRolePath || isDashboardPath ? null : <HeaderLayout />}</>;
};
