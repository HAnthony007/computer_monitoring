export type User = {
    registrationNumber: string;
    username: string;
    email: string;
    role: UserRole;
};

export type UserRole = "ADMIN" | "EMPLOYE" | "USER";
