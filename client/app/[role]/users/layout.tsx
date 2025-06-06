import { Main } from "@/components/layout/main";
import { UsersPrimaryButtons } from "@/features/users/components/users-primary-buttons";

export default function UsersLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Main>
            <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        User List
                    </h2>
                    <p className="text-muted-foreground">
                        Manage your users and their roles here.
                    </p>
                </div>
                <UsersPrimaryButtons />
            </div>
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                {children}
            </div>
        </Main>
    );
}
