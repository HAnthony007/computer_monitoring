CREATE TABLE users (
    id_user VARCHAR(50) PRIMARY KEY,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'EMPLOYE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO users (id_user, registration_number, username, email, password, role)
VALUES ('admin_generate_auto007', '000', 'Admin', 'admin@gmail.com', '$2a$10$vCJUswxtGMC56Er0tPh9QuzhgnD0Wc8q0OpEAp1vRN7TbtmRwjT9m', 'ADMIN');