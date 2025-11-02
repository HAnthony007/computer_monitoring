export type CpuMetric = {
    usagePercent: number;
    cpuName?: string;
    modelName?: string;
    coreCount?: number;
    perCoreUsage?: number[];
    temperature?: number;
    recordedAt?: string;
};

export type MemoryMetric = {
    totalMb: number;
    usedMb: number;
    freeMb?: number;
    usagePercent?: number;
    recordedAt?: string;
};

export type DiskMetric = {
    mountPoint: string;
    diskName?: string;
    totalGb: number;
    usedGb: number;
    freeGb?: number;
    usagePercent?: number;
    recordedAt?: string;
};

export type NetworkMetric = {
    interface: string;
    interfaceName?: string;
    uploadSpeed?: number;
    downloadSpeed?: number;
    uploadBps?: number;
    downloadBps?: number;
    totalUpload?: number;
    totalDownload?: number;
    rxBytes?: number;
    txBytes?: number;
    recordedAt?: string;
};

export type ProcessMetric = {
    pid: number;
    program: string;
    command?: string;
    threads?: number;
    user?: string;
    username?: string;
    memoryBytes?: number;
    cpuPercent?: number;
    recordedAt?: string;
};

export type MetricsBatch = {
    computerId: string;
    recordedAt: string;
    cpu?: CpuMetric[];
    memory?: MemoryMetric;
    disks?: DiskMetric[];
    network?: NetworkMetric[];
    processes?: ProcessMetric[];
};

export type LatestMetrics = MetricsBatch;

export type MetricsHistory = {
    computerId: string;
    metrics: MetricsBatch[];
    pagination?: {
        total: number;
        limit: number;
        offset: number;
    };
};
