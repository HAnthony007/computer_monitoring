CREATE TABLE memory (
    id_memory VARCHAR(50) PRIMARY KEY,
    id_computer VARCHAR(50) REFERENCES computers(id_computer) ON DELETE CASCADE,
    total_memory BIGINT NOT NULL,
    used_memory BIGINT NOT NULL,
    free_memory BIGINT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)