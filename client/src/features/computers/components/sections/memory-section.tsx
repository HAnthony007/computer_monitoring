"use client";

import { Icons } from "@/components/icon/icons";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatPercentage } from "@/lib/utils";
import { MemoryMetric } from "@/types/Metrics";

interface MemorySectionProps {
    memory?: MemoryMetric;
    isLoading: boolean;
    error: Error | null;
}

export function MemorySection({ memory, isLoading, error }: MemorySectionProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardDescription>Memory</CardDescription>
                    <CardTitle className="animate-pulse bg-muted h-8 w-24 rounded" />
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse bg-muted h-[150px] rounded" />
                </CardContent>
            </Card>
        );
    }

    if (error || !memory) {
        return (
            <Card>
                <CardHeader>
                    <CardDescription>Memory</CardDescription>
                    <CardTitle>Memory Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[150px] text-muted-foreground">
                        <p>No memory data available</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const usagePercent = memory.usagePercent || 
        (memory.totalMb > 0 ? (memory.usedMb / memory.totalMb) * 100 : 0);
    const freeMb = memory.freeMb || (memory.totalMb - memory.usedMb);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardDescription>Memory</CardDescription>
                        <CardTitle className="flex items-center gap-2">
                            <Icons.activity className="size-4" />
                            RAM Usage
                        </CardTitle>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold">
                            {formatPercentage(usagePercent)}
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <Progress value={usagePercent} className="h-2" />
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Total</div>
                        <div className="text-lg font-semibold">
                            {(memory.totalMb / 1024).toFixed(2)} GB
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Used</div>
                        <div className="text-lg font-semibold text-orange-500">
                            {(memory.usedMb / 1024).toFixed(2)} GB
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Free</div>
                        <div className="text-lg font-semibold text-green-500">
                            {(freeMb / 1024).toFixed(2)} GB
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Available</div>
                        <div className="text-lg font-semibold">
                            {((freeMb / memory.totalMb) * 100).toFixed(1)}%
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

