"use client"
import { ColumnDef } from "@tanstack/react-table";
import { User } from "../data/schema";

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "registrationNumber",
        header: "Registration Number",
    },
    {
        accessorKey: "username",
        header: "Username",
    },
    {
        accessorKey: "email",
        header: "Email",
    },
    {
        accessorKey: "role",
        header: "Role",
    },
]