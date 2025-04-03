CREATE TABLE disk (
    id_disk VARCHAR(50) PRIMARY KEY,
    id_computer VARCHAR(50) REFERENCES computers(id_computer) ON DELETE CASCADE,
    disk_name VARCHAR(255) NOT NULL,
    total_space BIGINT NOT NULL,
    used_space BIGINT NOT NULL,
    free_space BIGINT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);