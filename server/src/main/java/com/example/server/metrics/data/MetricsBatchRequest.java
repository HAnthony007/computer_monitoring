package com.example.server.metrics.data;

import java.time.Instant;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MetricsBatchRequest {
    private List<CpuItem> cpu;
    private List<MemoryItem> memory;
    private List<DiskItem> disks;
    private List<NetworkItem> network;

    @Data
    public static class CpuItem {
        @NotBlank @JsonAlias({"cpuName"}) private String cpu_name;
        @NotNull @JsonAlias({"usagePercent"}) private Double usage_percent;
        private Double temperature;
        @JsonAlias({"recordedAt"}) private Instant recorded_at; // optional
    }

    @Data
    public static class MemoryItem {
        @NotNull @JsonAlias({"totalMemory","totalMb"}) private Long total_memory;
        @NotNull @JsonAlias({"usedMemory","usedMb"}) private Long used_memory;
        @JsonAlias({"freeMemory","freeMb"}) private Long free_memory;
        @JsonAlias({"recordedAt"}) private Instant recorded_at;
    }

    @Data
    public static class DiskItem {
        @NotBlank @JsonAlias({"diskName","mountPoint"}) private String disk_name;
        @NotNull @JsonAlias({"totalSpace","totalGb"}) private Long total_space;
        @NotNull @JsonAlias({"usedSpace","usedGb"}) private Long used_space;
        @JsonAlias({"freeSpace","freeGb"}) private Long free_space;
        @JsonAlias({"recordedAt"}) private Instant recorded_at;
    }

    @Data
    public static class NetworkItem {
        @NotBlank @JsonAlias({"interface","interfaceName"}) private String interface_name;
        @NotNull @JsonAlias({"uploadSpeed","uploadBps","uploadBytesPerSec"}) private Double upload_speed;
        @NotNull @JsonAlias({"downloadSpeed","downloadBps","downloadBytesPerSec"}) private Double download_speed;
        @NotNull @JsonAlias({"totalUpload","txBytes"}) private Long total_upload;
        @NotNull @JsonAlias({"totalDownload","rxBytes"}) private Long total_download;
        @JsonAlias({"recordedAt"}) private Instant recorded_at;
    }
}
