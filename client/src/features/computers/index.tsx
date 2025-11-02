"use client";

import { Icons } from "@/components/icon/icons";
import { Badge } from "@/components/ui/badge";
import { ComputerCard } from "./components/computer-card";
import { useComputers } from "./hooks/use-computers";

export default function Computers() {
    const { data, isLoading, error } = useComputers();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Icons.spinner className="size-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">
                        Loading computers...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4 text-center">
                    <div className="rounded-full bg-destructive/10 p-4">
                        <Icons.alertCircle className="size-8 text-destructive" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">
                            Failed to load computers
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {error instanceof Error
                                ? error.message
                                : "An error occurred while loading computers"}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const computers = data || [];
    const onlineCount = computers.filter((c) => c.status === "ONLINE").length;
    const offlineCount = computers.filter((c) => c.status === "OFFLINE").length;
    const unknownCount = computers.filter(
        (c) => c.status === "UNKNOWN" || !c.status
    ).length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">
                        Computers
                    </h2>
                    <p className="text-muted-foreground">
                        Monitor and manage all computers in your network
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge
                        variant="outline"
                        className="bg-green-500/10 text-green-600 border-green-500/20"
                    >
                        <Icons.checkCircle2 className="size-3" />
                        {onlineCount} Online
                    </Badge>
                    <Badge
                        variant="outline"
                        className="bg-red-500/10 text-red-600 border-red-500/20"
                    >
                        <Icons.xCircle className="size-3" />
                        {offlineCount} Offline
                    </Badge>
                    <Badge
                        variant="outline"
                        className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
                    >
                        <Icons.alertCircle className="size-3" />
                        {unknownCount} Unknown
                    </Badge>
                </div>
            </div>

            {/* Computers Grid */}
            {computers.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {computers.map((computer) => (
                        <ComputerCard
                            key={computer.idComputer}
                            computer={computer}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center min-h-[400px] border border-dashed rounded-lg bg-muted/50">
                    <div className="flex flex-col items-center gap-4 text-center max-w-md px-4">
                        <div className="rounded-full bg-muted p-4">
                            <Icons.server className="size-8 text-muted-foreground" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">
                                No computers found
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                No computers are currently registered in your
                                system. Add a computer to start monitoring.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
