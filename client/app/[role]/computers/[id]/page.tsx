import ComputerDetails from "@/features/computers/components/computer-details";

export default function ComputerDetailsPage({
    params,
}: {
    params: { id: string; role: string };
}) {
    return <ComputerDetails computerId={params.id} />;
}

