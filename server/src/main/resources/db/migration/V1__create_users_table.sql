CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'EMPLOYE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id, registration_number, username, email, password, role)
VALUES ('admin_generate_auto007', '000', 'Admin', 'admin@gmail.com', 'admin@123', 'ADMIN');