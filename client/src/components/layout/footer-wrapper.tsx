"use client";

import { usePathname } from "next/navigation";
import { FooterLayout } from "./site/footer/footer-layout";

export const FooterWrapper = () => {
    const pathname = usePathname();
    return <>{pathname.includes("/admin") ? null : <FooterLayout />}</>;
};
