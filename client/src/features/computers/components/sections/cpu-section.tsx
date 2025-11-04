"use client";

import { Icons } from "@/components/icon/icons";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { formatPercentage } from "@/lib/utils";
import { CpuMetric } from "@/types/Metrics";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface CpuSectionProps {
    cpu?: CpuMetric[];
    isLoading: boolean;
    error: Error | null;
}

export function CpuSection({ cpu, isLoading, error }: CpuSectionProps) {
    const latestCpu = cpu && cpu.length > 0 ? cpu[0] : null;

    // Prepare chart data - use perCoreUsage if available, otherwise use overall usage
    const chartData = React.useMemo(() => {
        if (!latestCpu) return [];

        if (latestCpu.perCoreUsage && latestCpu.perCoreUsage.length > 0) {
            return latestCpu.perCoreUsage.map((usage, index) => ({
                core: `Core ${index + 1}`,
                usage: usage || 0,
            }));
        }

        return [
            {
                core: "Overall",
                usage: latestCpu.usagePercent || 0,
            },
        ];
    }, [latestCpu]);

    const chartConfig: ChartConfig = {
        usage: {
            label: "Usage",
            color: "hsl(var(--chart-1))",
        },
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardDescription>CPU</CardDescription>
                    <CardTitle className="animate-pulse bg-muted h-8 w-24 rounded" />
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse bg-muted h-[200px] rounded" />
                </CardContent>
            </Card>
        );
    }

    if (error || !latestCpu) {
        return (
            <Card>
                <CardHeader>
                    <CardDescription>CPU</CardDescription>
                    <CardTitle>CPU Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                        <p>No CPU data available</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardDescription>CPU</CardDescription>
                        <CardTitle className="flex items-center gap-2">
                            {latestCpu.cpuName || "Processor"}
                            {latestCpu.modelName && (
                                <span className="text-sm font-normal text-muted-foreground">
                                    ({latestCpu.modelName})
                                </span>
                            )}
                        </CardTitle>
                    </div>
                    <Badge variant="outline" className="text-lg px-3 py-1">
                        {formatPercentage(latestCpu.usagePercent)}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Chart */}
                <ChartContainer
                    config={chartConfig}
                    className="h-[200px] w-full"
                >
                    <AreaChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="core" />
                        <YAxis domain={[0, 100]} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                            type="monotone"
                            dataKey="usage"
                            stroke="var(--color-usage)"
                            fill="var(--color-usage)"
                            fillOpacity={0.6}
                        />
                    </AreaChart>
                </ChartContainer>

                {/* CPU Details */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Cores</span>
                            <span className="font-medium">
                                {latestCpu.coreCount || "N/A"}
                            </span>
                        </div>
                        {typeof latestCpu.temperature === "number" && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-1">
                                    <Icons.activity className="size-3" />
                                    Temperature
                                </span>
                                <span className="font-medium">
                                    {latestCpu.temperature.toFixed(1)}°C
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                                Overall Usage
                            </span>
                            <span className="font-medium">
                                {formatPercentage(latestCpu.usagePercent)}
                            </span>
                        </div>
                        {latestCpu.perCoreUsage &&
                            latestCpu.perCoreUsage.length > 0 && (
                                <div className="text-xs text-muted-foreground">
                                    Per-core usage available
                                </div>
                            )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
