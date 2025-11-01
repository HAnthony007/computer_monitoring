-- Performance indexes for time-series queries
CREATE INDEX IF NOT EXISTS idx_cpu_computer_recorded_at ON cpu (id_computer, recorded_at);
CREATE INDEX IF NOT EXISTS idx_memory_computer_recorded_at ON memory (id_computer, recorded_at);
CREATE INDEX IF NOT EXISTS idx_disk_computer_recorded_at ON disk (id_computer, recorded_at);
CREATE INDEX IF NOT EXISTS idx_network_computer_recorded_at ON network (id_computer, recorded_at);
