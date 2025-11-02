package com.example.server.metrics.data;

import java.time.Instant;
import java.util.List;

import com.example.server.utils.Client;

import lombok.Data;

public class MetricsReadModels {

    @Data @Client
    public static class CpuMetric {
        private Double usagePercent;
        private String cpuName;
        private String modelName;
        private Integer coreCount;
        private List<Double> perCoreUsage;
        private Double temperature;
        private Instant recordedAt;
    }

    @Data @Client
    public static class MemoryMetric {
        private Long totalMb;
        private Long usedMb;
        private Long freeMb;
        private Double usagePercent;
        private Instant recordedAt;
    }

    @Data @Client
    public static class DiskMetric {
        private String mountPoint; // maps from disk_name
        private String diskName;
        private Long totalGb;
        private Long usedGb;
        private Long freeGb;
        private Double usagePercent;
        private Instant recordedAt;
    }

    @Data @Client
    public static class NetworkMetric {
        private String iface; // not used by client, but keep alias
        private String _interface; // workaround name; will map via getters
        private String interfaceName;
        private Double uploadSpeed;
        private Double downloadSpeed;
        private Double uploadBps;
        private Double downloadBps;
        private Long totalUpload;
        private Long totalDownload;
        private Long rxBytes;
        private Long txBytes;
        private Instant recordedAt;

        public String getInterface() { return interfaceName != null ? interfaceName : _interface; }
        public void setInterface(String v) { this._interface = v; }
    }

    @Data @Client
    public static class ProcessMetric {
        private Long pid;
        private String program;
        private String command;
        private Integer threads;
        private String user;
        private String username;
        private Long memoryBytes;
        private Double cpuPercent;
        private Instant recordedAt;
    }

    @Data @Client
    public static class LatestMetricsResponse {
        private String computerId;
        private Instant recordedAt;
        private java.util.List<CpuMetric> cpu;
        private MemoryMetric memory;
        private java.util.List<DiskMetric> disks;
        private java.util.List<NetworkMetric> network;
        private java.util.List<ProcessMetric> processes;
    }

    @Data @Client
    public static class MetricsHistoryResponse {
        private String computerId;
        private java.util.List<LatestMetricsResponse> metrics;
        private Pagination pagination;
    }

    @Data @Client
    public static class Pagination {
        private long total;
        private int limit;
        private int offset;
    }
}
