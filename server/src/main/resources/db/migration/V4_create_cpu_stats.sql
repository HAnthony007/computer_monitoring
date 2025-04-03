CREATE TABLE cpu (
    id_cpu VARCHAR(50) PRIMARY KEY,
    id_computer VARCHAR(50) REFERENCES computers(id_computer) ON DELETE CASCADE,
    cpu_name VARCHAR(255) NOT NULL,
    usage_percent FLOAT NOT NULL,
    temperature FLOAT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);