export type DashboardStats = {
    totalComputers: number;
    activeComputers: number;
    inactiveComputers: number;
    totalAgents: number;
    activeAgents: number;
    averageUptime?: number;
    availabilityRate?: number;
};

export type ComputerSummary = {
    idComputer: string;
    hostname: string;
    ipAddress: string;
    status: "ONLINE" | "OFFLINE" | "UNKNOWN";
    lastSeen: string;
    latestCpuUsage?: number;
    latestMemoryUsage?: number;
};
