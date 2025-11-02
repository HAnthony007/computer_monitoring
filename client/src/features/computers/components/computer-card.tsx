"use client";

import Link from "next/link";
import { Icons } from "@/components/icon/icons";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn, formatRelativeTime } from "@/lib/utils";
import { Computer } from "../schemas/computer-schema";
import { usePathname } from "next/navigation";

interface ComputerCardProps {
    computer: Computer;
}

const getStatusConfig = (status?: string) => {
    switch (status) {
        case "ONLINE":
            return {
                icon: Icons.checkCircle2,
                label: "Online",
                className: "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400",
                dotClassName: "bg-green-500",
            };
        case "OFFLINE":
            return {
                icon: Icons.xCircle,
                label: "Offline",
                className: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
                dotClassName: "bg-red-500",
            };
        default:
            return {
                icon: Icons.alertCircle,
                label: "Unknown",
                className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 dark:text-yellow-400",
                dotClassName: "bg-yellow-500",
            };
    }
};

export function ComputerCard({ computer }: ComputerCardProps) {
    const statusConfig = getStatusConfig(computer.status);
    const StatusIcon = statusConfig.icon;
    const pathname = usePathname();
    const role = pathname.split('/')[1]; // Extract role from pathname like /admin/computers

    return (
        <Link href={`/${role}/computers/${computer.idComputer}`} className="block">
            <Card className="group hover:shadow-lg transition-all duration-200 border hover:border-primary/20 cursor-pointer">
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-purple-500/20 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-200 rounded-xl" />
                            <div className="relative bg-gradient-to-br from-primary/10 to-purple-500/10 rounded-lg p-3">
                                <Icons.monitor className="size-6 text-primary" />
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-semibold truncate">
                                {computer.hostname}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1.5 mt-1">
                                <Icons.wifi className="size-3.5" />
                                <span className="truncate">{computer.ipAddress}</span>
                            </CardDescription>
                        </div>
                    </div>
                    <Badge
                        variant="outline"
                        className={cn(statusConfig.className, "flex items-center gap-1.5")}
                    >
                        <div
                            className={cn(
                                "size-1.5 rounded-full animate-pulse",
                                statusConfig.dotClassName
                            )}
                        />
                        {statusConfig.label}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-2">
                            <Icons.server className="size-4" />
                            Operating System
                        </span>
                        <span className="font-medium truncate max-w-[200px]" title={computer.os}>
                            {computer.os}
                        </span>
                    </div>
                    {computer.agents && computer.agents.length > 0 && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Icons.activity className="size-4" />
                                Agents
                            </span>
                            <Badge variant="secondary" className="font-medium">
                                {computer.agents.length} active
                            </Badge>
                        </div>
                    )}
                </div>
            </CardContent>
            <CardFooter className="border-t pt-4 mt-2">
                <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                        <Icons.calendar className="size-3.5" />
                        Last seen
                    </span>
                    <span className="font-medium">
                        {formatRelativeTime(computer.lastSeen)}
                    </span>
                </div>
            </CardFooter>
        </Card>
        </Link>
    );
}

