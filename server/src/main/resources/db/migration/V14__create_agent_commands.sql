-- Create table for agent commands to support remote actions like killing a process
CREATE TABLE IF NOT EXISTS agent_commands (
    id_command VARCHAR(64) PRIMARY KEY,
    id_computer VARCHAR(64) NOT NULL,
    command_type VARCHAR(64) NOT NULL,
    pid BIGINT,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_agent_commands_computer_status ON agent_commands (id_computer, status);
