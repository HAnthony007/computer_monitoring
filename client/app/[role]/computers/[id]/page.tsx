import ComputerDetails from "@/features/computers/components/computer-details";

export default async function ComputerDetailsPage({
    params,
}: {
    params: Promise<{ id: string; role: string }>;
}) {
    const p = await params;
    return <ComputerDetails computerId={p.id} />;
}
