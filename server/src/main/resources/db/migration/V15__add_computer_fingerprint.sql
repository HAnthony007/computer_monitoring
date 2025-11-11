-- Add fingerprint column to uniquely identify computers across networks
ALTER TABLE computers ADD COLUMN IF NOT EXISTS fingerprint VARCHAR(255);
-- Ensure uniqueness to avoid collisions
CREATE UNIQUE INDEX IF NOT EXISTS ux_computers_fingerprint ON computers (fingerprint);
