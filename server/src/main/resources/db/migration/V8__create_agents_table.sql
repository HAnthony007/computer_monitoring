CREATE TABLE agents (
    id_agent VARCHAR(50) PRIMARY KEY,
    id_computer VARCHAR(50) REFERENCES computers(id_computer) ON DELETE CASCADE,
    api_key_hash VARCHAR(255) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'UNKNOWN',
    version VARCHAR(64),
    last_seen TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX ux_agents_computer ON agents (id_computer);
