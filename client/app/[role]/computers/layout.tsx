import { Main } from "@/components/layout/main";

export default function ComputersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <Main>{children}</Main>;
}
