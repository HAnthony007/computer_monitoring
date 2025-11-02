"use client";

import { Icons } from "@/components/icon/icons";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
// formatNetworkSpeed not used, removed import
import { NetworkMetric } from "@/types/Metrics";

interface NetworkSectionProps {
    network?: NetworkMetric[];
    isLoading: boolean;
    error: Error | null;
}

function formatBytes(bytes?: number): string {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export function NetworkSection({ network, isLoading, error }: NetworkSectionProps) {
    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardDescription>Network</CardDescription>
                    <CardTitle className="animate-pulse bg-muted h-8 w-24 rounded" />
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse bg-muted h-[200px] rounded" />
                </CardContent>
            </Card>
        );
    }

    if (error || !network || network.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardDescription>Network</CardDescription>
                    <CardTitle>Network Interfaces</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                        <p>No network data available</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardDescription>Network</CardDescription>
                <CardTitle className="flex items-center gap-2">
                    <Icons.wifi className="size-4" />
                    Network Interfaces
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {network.map((iface, index) => (
                        <div key={index} className="border rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Icons.wifi className="size-4 text-primary" />
                                    <span className="font-medium">
                                        {iface.interface || iface.interfaceName || `Interface ${index + 1}`}
                                    </span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">Download</div>
                                    <div className="text-lg font-semibold text-blue-500">
                                        {iface.downloadSpeed !== undefined
                                            ? `${iface.downloadSpeed.toFixed(2)} Mbps`
                                            : iface.downloadBps !== undefined
                                            ? formatBytes(iface.downloadBps) + "/s"
                                            : "N/A"}
                                    </div>
                                    {iface.totalDownload !== undefined && (
                                        <div className="text-xs text-muted-foreground">
                                            Total: {formatBytes(iface.totalDownload)}
                                        </div>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">Upload</div>
                                    <div className="text-lg font-semibold text-green-500">
                                        {iface.uploadSpeed !== undefined
                                            ? `${iface.uploadSpeed.toFixed(2)} Mbps`
                                            : iface.uploadBps !== undefined
                                            ? formatBytes(iface.uploadBps) + "/s"
                                            : "N/A"}
                                    </div>
                                    {iface.totalUpload !== undefined && (
                                        <div className="text-xs text-muted-foreground">
                                            Total: {formatBytes(iface.totalUpload)}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {(iface.rxBytes !== undefined || iface.txBytes !== undefined) && (
                                <div className="grid grid-cols-2 gap-4 pt-2 border-t text-xs">
                                    <div>
                                        <span className="text-muted-foreground">RX: </span>
                                        <span className="font-medium">{formatBytes(iface.rxBytes)}</span>
                                    </div>
                                    <div>
                                        <span className="text-muted-foreground">TX: </span>
                                        <span className="font-medium">{formatBytes(iface.txBytes)}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

