"use client";

import { UserRole } from "@/types/User";
import { usePathname } from "next/navigation";
import { FooterLayout } from "./site/footer/footer-layout";

export const FooterWrapper = () => {
    const pathname = usePathname();
    const isRolePath = UserRole.some((role) => pathname.startsWith(`/${role}`));
    return <>{isRolePath ? null : <FooterLayout />}</>;
};
