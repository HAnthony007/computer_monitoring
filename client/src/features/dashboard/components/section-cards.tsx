"use client";

import { useIsFetching } from "@tanstack/react-query";
import { Icons } from "@/components/icon/icons";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useDashboardStats } from "../hooks/use-dashboard-stats";
import { formatUptime, formatPercentage } from "@/lib/utils";

export function SectionCards() {
    const { data, isLoading, error } = useDashboardStats();
    const isRefreshing = useIsFetching({ queryKey: ["dashboard", "stats"] }) > 0;

    if (isLoading) {
        return (
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="@container/card">
                        <CardHeader>
                            <CardDescription className="animate-pulse bg-muted h-4 w-24 rounded" />
                            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                                <div className="animate-pulse bg-muted h-8 w-20 rounded" />
                            </CardTitle>
                            <CardAction>
                                <div className="animate-pulse bg-muted h-6 w-16 rounded" />
                            </CardAction>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[200px] px-4">
                <div className="flex flex-col items-center gap-2 text-center">
                    <Icons.alertCircle className="size-6 text-destructive" />
                    <p className="text-sm text-muted-foreground">
                        Failed to load dashboard statistics
                    </p>
                </div>
            </div>
        );
    }

    const stats = data || {
        totalComputers: 0,
        activeComputers: 0,
        inactiveComputers: 0,
        totalAgents: 0,
        activeAgents: 0,
        averageUptime: undefined,
        availabilityRate: undefined,
    };

    // Calculate percentage of active computers
    const activePercentage = stats.totalComputers > 0
        ? (stats.activeComputers / stats.totalComputers) * 100
        : 0;

    // Calculate percentage of active agents
    const agentsActivePercentage = stats.totalAgents > 0
        ? (stats.activeAgents / stats.totalAgents) * 100
        : 0;

    return (
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {/* Total Computers */}
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Total Computers</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats.totalComputers}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <Icons.server className="size-3" />
                            Systems
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {stats.activeComputers} online{" "}
                        {stats.activeComputers > 0 && (
                            <Icons.checkCircle2 className="size-4 text-green-500" />
                        )}
                    </div>
                    <div className="text-muted-foreground">
                        {stats.inactiveComputers} offline
                    </div>
                </CardFooter>
            </Card>

            {/* Active Computers */}
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Active Computers</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats.activeComputers}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                            <Icons.checkCircle2 className="size-3" />
                            {formatPercentage(activePercentage)}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Operational{" "}
                        <Icons.trendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        Currently monitoring
                    </div>
                </CardFooter>
            </Card>

            {/* Active Agents */}
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Active Agents</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {stats.activeAgents}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                            <Icons.activity className="size-3" />
                            {formatPercentage(agentsActivePercentage)}
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Running agents{" "}
                        <Icons.trendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        {stats.totalAgents} total agents
                    </div>
                </CardFooter>
            </Card>

            {/* Availability Rate */}
            <Card className="@container/card">
                <CardHeader>
                    <CardDescription>Availability Rate</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                        {formatPercentage(stats.availabilityRate)}
                    </CardTitle>
                    <CardAction>
                        <Badge variant="outline">
                            <Icons.activity className="size-3" />
                            Uptime
                        </Badge>
                    </CardAction>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        Average: {formatUptime(stats.averageUptime)}{" "}
                        <Icons.trendingUp className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                        System reliability metric
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
