"use client";

import * as React from "react";
import { Icons } from "@/components/icon/icons";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatPercentage } from "@/lib/utils";
import { ProcessMetric } from "@/types/Metrics";
import { useKillProcess } from "../../hooks/use-kill-process";

interface ProcessesSectionProps {
    computerId: string;
    processes?: ProcessMetric[];
    isLoading: boolean;
    error: Error | null;
}

function formatBytes(bytes?: number): string {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export function ProcessesSection({ computerId, processes, isLoading, error }: ProcessesSectionProps) {
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sortBy, setSortBy] = React.useState<"cpu" | "memory" | "pid">("cpu");
    const [processToKill, setProcessToKill] = React.useState<ProcessMetric | null>(null);
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);
    const killProcessMutation = useKillProcess(computerId);

    const handleKillClick = (process: ProcessMetric) => {
        setProcessToKill(process);
        setIsDialogOpen(true);
    };

    const handleConfirmKill = () => {
        if (processToKill?.pid) {
            killProcessMutation.mutate(processToKill.pid, {
                onSuccess: () => {
                    setIsDialogOpen(false);
                    setProcessToKill(null);
                },
            });
        }
    };

    const filteredAndSorted = React.useMemo(() => {
        if (!processes) return [];
        
        let filtered = processes.filter((proc) =>
            proc.program?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            proc.command?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            proc.user?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        filtered.sort((a, b) => {
            switch (sortBy) {
                case "cpu":
                    return (b.cpuPercent || 0) - (a.cpuPercent || 0);
                case "memory":
                    return (b.memoryBytes || 0) - (a.memoryBytes || 0);
                case "pid":
                    return (a.pid || 0) - (b.pid || 0);
                default:
                    return 0;
            }
        });

        return filtered.slice(0, 50); // Limit to top 50
    }, [processes, searchTerm, sortBy]);

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardDescription>Processes</CardDescription>
                    <CardTitle className="animate-pulse bg-muted h-8 w-24 rounded" />
                </CardHeader>
                <CardContent>
                    <div className="animate-pulse bg-muted h-[300px] rounded" />
                </CardContent>
            </Card>
        );
    }

    if (error || !processes || processes.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardDescription>Processes</CardDescription>
                    <CardTitle>Running Processes</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        <p>No process data available</p>
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
                        <CardDescription>Processes</CardDescription>
                        <CardTitle className="flex items-center gap-2">
                            <Icons.activity className="size-4" />
                            Running Processes ({processes.length})
                        </CardTitle>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search processes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                    />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as "cpu" | "memory" | "pid")}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                        <option value="cpu">Sort by CPU</option>
                        <option value="memory">Sort by Memory</option>
                        <option value="pid">Sort by PID</option>
                    </select>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>PID</TableHead>
                                <TableHead>Program</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">CPU %</TableHead>
                                <TableHead className="text-right">Memory</TableHead>
                                <TableHead className="text-right">Threads</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAndSorted.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                                        No processes found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAndSorted.map((proc, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="font-mono text-sm">
                                            {proc.pid}
                                        </TableCell>
                                        <TableCell>
                                            <div className="space-y-1">
                                                <div className="font-medium">{proc.program}</div>
                                                {proc.command && (
                                                    <div className="text-xs text-muted-foreground truncate max-w-[300px]">
                                                        {proc.command}
                                                    </div>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm">
                                            {proc.user || proc.username || "N/A"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <span className={`font-medium ${
                                                (proc.cpuPercent || 0) > 50 ? 'text-red-500' :
                                                (proc.cpuPercent || 0) > 20 ? 'text-yellow-500' :
                                                'text-green-500'
                                            }`}>
                                                {formatPercentage(proc.cpuPercent)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            {formatBytes(proc.memoryBytes)}
                                        </TableCell>
                                        <TableCell className="text-right text-sm text-muted-foreground">
                                            {proc.threads || "N/A"}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleKillClick(proc)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                disabled={killProcessMutation.isPending}
                                            >
                                                <Icons.Trash className="size-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            {/* Kill Process Confirmation Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-destructive">
                            <Icons.AlertTriangle className="size-5" />
                            Kill Process
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to kill this process? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {processToKill && (
                        <div className="space-y-2 py-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-muted-foreground">PID:</span>
                                    <span className="ml-2 font-mono font-medium">{processToKill.pid}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Program:</span>
                                    <span className="ml-2 font-medium">{processToKill.program}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">User:</span>
                                    <span className="ml-2">{processToKill.user || processToKill.username || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">CPU:</span>
                                    <span className="ml-2">{formatPercentage(processToKill.cpuPercent)}</span>
                                </div>
                            </div>
                            {processToKill.command && (
                                <div className="pt-2 border-t">
                                    <span className="text-muted-foreground text-sm">Command: </span>
                                    <span className="text-sm font-mono">{processToKill.command}</span>
                                </div>
                            )}
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsDialogOpen(false);
                                setProcessToKill(null);
                            }}
                            disabled={killProcessMutation.isPending}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleConfirmKill}
                            disabled={killProcessMutation.isPending}
                        >
                            {killProcessMutation.isPending ? (
                                <>
                                    <Icons.spinner className="size-4 mr-2 animate-spin" />
                                    Killing...
                                </>
                            ) : (
                                <>
                                    <Icons.Trash className="size-4 mr-2" />
                                    Kill Process
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}

