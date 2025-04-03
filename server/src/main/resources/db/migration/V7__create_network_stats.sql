CREATE TABLE network (
    id_network VARCHAR(50) PRIMARY KEY,
    id_computer VARCHAR(50) REFERENCES computers(id_computer) ON DELETE CASCADE,
    interface_name VARCHAR(255) NOT NULL,
    upload_speed FLOAT NOT NULL,
    download_speed FLOAT NOT NULL,
    total_upload BIGINT NOT NULL,
    total_download BIGINT NOT NULL,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    -- ip_address VARCHAR(255) NOT NULL,
    -- mac_address VARCHAR(255) NOT NULL,