-- Seed a demo computer and a linked agent

-- Insert a demo computer (adjust IP/hostname as needed)
INSERT INTO computers (id_computer, hostname, ip_adress, os)
VALUES ('seed_computer_0001', 'seed-host', '10.0.0.10', 'Linux (x86_64)')
ON CONFLICT (ip_adress) DO NOTHING;

-- Insert a demo agent linked to the demo computer
-- api_key_hash below corresponds to the bcrypt hash used in user seed (e.g., for 'Admin@123')
-- Replace with your own generated hash before production use
INSERT INTO agents (id_agent, id_computer, api_key_hash, status, version, last_seen)
VALUES ('agent_seed_0001', 'seed_computer_0001', '$2a$10$vCJUswxtGMC56Er0tPh9QuzhgnD0Wc8q0OpEAp1vRN7TbtmRwjT9m', 'ONLINE', '0.1.0', CURRENT_TIMESTAMP)
ON CONFLICT DO NOTHING;
