export type User = {
    registrationNumber: string;
    username: string;
    email: string;
    role: TypeUserRole;
};

export const UserRole = ["ADMIN", "EMPLOYE", "USER", "MANAGER"] as const;

export type TypeUserRole = (typeof UserRole)[number];
