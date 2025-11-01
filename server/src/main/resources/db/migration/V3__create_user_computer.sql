CREATE TABLE user_computer (
    id_user VARCHAR(50) REFERENCES users(id_user) ON DELETE CASCADE,
    id_computer VARCHAR(50) REFERENCES computers(id_computer) ON DELETE CASCADE,
    PRIMARY KEY (id_user, id_computer)
);