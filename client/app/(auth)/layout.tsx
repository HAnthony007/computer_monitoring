export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="min-h-full size-full">{children}</div>;
}
