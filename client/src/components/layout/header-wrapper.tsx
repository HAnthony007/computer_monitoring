"use client";

import { usePathname } from "next/navigation";
import { HeaderLayout } from "./site/header/header-layout";

export const HeaderWrapper = () => {
    const pathname = usePathname();
    return <>{pathname.includes("/admin") ? null : <HeaderLayout />}</>;
};
