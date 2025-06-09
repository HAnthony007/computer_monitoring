import { Main } from "@/components/layout/main";

export default function UsersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Main>
            {children}
        </Main>
    );
}
