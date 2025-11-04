"use client";

import { Icons } from "@/components/icon/icons";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useComputerDetails } from "../hooks/use-computer-details";
import { useComputerMetrics } from "../hooks/use-computer-metrics";
import { CpuSection } from "./sections/cpu-section";
import { DiskSection } from "./sections/disk-section";
import { MemorySection } from "./sections/memory-section";
import { NetworkSection } from "./sections/network-section";
import { ProcessesSection } from "./sections/processes-section";

interface ComputerDetailsProps {
    computerId: string;
}

export default function ComputerDetails({ computerId }: ComputerDetailsProps) {
    const router = useRouter();
    const {
        data: computer,
        isLoading: isLoadingComputer,
        error: computerError,
    } = useComputerDetails(computerId);
    const {
        data: metrics,
        isLoading: isLoadingMetrics,
        error: metricsError,
        isFetching: isFetchingMetrics,
    } = useComputerMetrics(computerId);

    if (isLoadingComputer) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Icons.spinner className="size-8 animate-spin text-primary" />
                    <p className="text-muted-foreground">
                        Loading computer details...
                    </p>
                </div>
            </div>
        );
    }

    if (computerError || !computer) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4 text-center">
                    <Icons.alertCircle className="size-8 text-destructive" />
                    <div>
                        <h3 className="text-lg font-semibold">
                            Computer not found
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            The computer you&apos;re looking for doesn&apos;t
                            exist or has been removed.
                        </p>
                    </div>
                    <Button onClick={() => router.back()} variant="outline">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    const getStatusConfig = (status?: string) => {
        switch (status) {
            case "ONLINE":
                return {
                    icon: Icons.checkCircle2,
                    label: "Online",
                    className:
                        "bg-green-500/10 text-green-600 border-green-500/20",
                };
            case "OFFLINE":
                return {
                    icon: Icons.xCircle,
                    label: "Offline",
                    className: "bg-red-500/10 text-red-600 border-red-500/20",
                };
            default:
                return {
                    icon: Icons.alertCircle,
                    label: "Unknown",
                    className:
                        "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
                };
        }
    };

    const statusConfig = getStatusConfig(computer.status);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                        className="shrink-0"
                    >
                        <Icons.ArrowLeft className="size-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {computer.hostname}
                        </h1>
                        <p className="text-muted-foreground mt-1 flex items-center gap-2">
                            <Icons.wifi className="size-3.5" />
                            {computer.ipAddress} • {computer.os}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className={statusConfig.className}>
                        <statusConfig.icon className="size-3" />
                        {statusConfig.label}
                    </Badge>
                    {isFetchingMetrics && (
                        <Badge
                            variant="outline"
                            className="bg-blue-500/10 text-blue-600 border-blue-500/20"
                        >
                            <Icons.activity className="size-3 animate-pulse" />
                            Live
                        </Badge>
                    )}
                </div>
            </div>

            {/* Metrics Sections */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* CPU Section */}
                <div className="lg:col-span-2">
                    <CpuSection
                        cpu={metrics?.cpu}
                        isLoading={isLoadingMetrics}
                        error={metricsError}
                    />
                </div>

                {/* Memory Section */}
                <MemorySection
                    memory={metrics?.memory}
                    isLoading={isLoadingMetrics}
                    error={metricsError}
                />

                {/* Disk Section */}
                <DiskSection
                    disks={metrics?.disks}
                    isLoading={isLoadingMetrics}
                    error={metricsError}
                />

                {/* Network Section */}
                <div className="lg:col-span-2">
                    <NetworkSection
                        network={metrics?.network}
                        isLoading={isLoadingMetrics}
                        error={metricsError}
                    />
                </div>

                {/* Processes Section */}
                <div className="lg:col-span-2">
                    <ProcessesSection
                        computerId={computerId}
                        processes={metrics?.processes}
                        isLoading={isLoadingMetrics}
                        error={metricsError}
                    />
                </div>
            </div>
        </div>
    );
}
