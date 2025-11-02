CREATE TABLE process (
    id_process VARCHAR(50) PRIMARY KEY,
    id_computer VARCHAR(50) REFERENCES computers(id_computer) ON DELETE CASCADE,
    pid BIGINT NOT NULL,
    program VARCHAR(255),
    command TEXT,
    threads INT,
    username VARCHAR(255),
    memory_bytes BIGINT,
    cpu_percent FLOAT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_process_computer_recorded_at ON process (id_computer, recorded_at);
