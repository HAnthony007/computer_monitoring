export default function DashboardLayout({
    children,
    bar_stats,
}: {
    children: React.ReactNode;
    bar_stats: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {children}
            <div className="px-4 lg:px-6">{bar_stats}</div>
            <h1>Hello Stats</h1>
        </div>
    );
}
