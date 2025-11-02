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
import { Progress } from "@/components/ui/progress";
import { formatPercentage } from "@/lib/utils";
import { DiskMetric } from "@/types/Metrics";

interface DiskSectionProps {
    disks?: DiskMetric[];
    isLoading: boolean;
    error: Error | null;
}

export function DiskSection({ disks, isLoading, error }: DiskSectionProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardDescription>Disks</CardDescription>
                    <CardTitle className="animate-pulse bg-muted h-8 w-24 rounded" />
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse bg-muted h-[200px] rounded" />
                </CardContent>
            </Card>
        );
    }

    if (error || !disks || disks.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardDescription>Disks</CardDescription>
                    <CardTitle>Disk Storage</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                        <p>No disk data available</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardDescription>Disks</CardDescription>
                <CardTitle className="flex items-center gap-2">
                    <Icons.server className="size-4" />
                    Disk Storage
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {disks.map((disk, index) => {
                    const usagePercent = disk.usagePercent || 
                        (disk.totalGb > 0 ? (disk.usedGb / disk.totalGb) * 100 : 0);
                    const freeGb = disk.freeGb || (disk.totalGb - disk.usedGb);
                    const isHighUsage = usagePercent > 80;
                    const isMediumUsage = usagePercent > 60;

                    return (
                        <div key={index} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{disk.mountPoint}</span>
                                    {disk.diskName && (
                                        <Badge variant="outline" className="text-xs">
                                            {disk.diskName}
                                        </Badge>
                                    )}
                                </div>
                                <div className={`text-sm font-semibold ${
                                    isHighUsage ? 'text-red-500' : 
                                    isMediumUsage ? 'text-yellow-500' : 
                                    'text-green-500'
                                }`}>
                                    {formatPercentage(usagePercent)}
                                </div>
                            </div>
                            <Progress 
                                value={usagePercent} 
                                className={`h-2 ${
                                    isHighUsage ? '[&>div]:bg-red-500' : 
                                    isMediumUsage ? '[&>div]:bg-yellow-500' : 
                                    '[&>div]:bg-green-500'
                                }`}
                            />
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                                <span>
                                    {disk.usedGb.toFixed(2)} GB / {disk.totalGb.toFixed(2)} GB
                                </span>
                                <span>
                                    {freeGb.toFixed(2)} GB free
                                </span>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}

