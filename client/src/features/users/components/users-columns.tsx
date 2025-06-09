"use client";
import { ColumnDef } from "@tanstack/react-table";
import { User } from "../data/schema";
import { cn } from "@/lib/utils";
import { DataTableColumnHeader } from "@/components/table/data-table-column.header";
import LongText from "@/components/ui/long-text";
import { userTypes } from "../data/data";
import { DataTableRowActions } from "@/components/table/data-table-row-actions";

export const columns: ColumnDef<User>[] = [
    {
        accessorKey: "registrationNumber",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Registration Number" />
        ),
        cell: ({ row }) => <div>{row.getValue("registrationNumber")}</div>,
        meta: {
            className: cn(
                "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none",
                "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
                "sticky left-6 md:table-cell",
            ),
        },
        enableSorting: true,
    },
    {
        accessorKey: "username",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Username" />
        ),
        cell: ({ row }) => (
            <LongText className="max-w-36">{row.getValue("username")}</LongText>
        ),
        meta: {
            className: cn(
                "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none",
                "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
                "sticky left-6 md:table-cell",
            ),
        },
        enableSorting: true,
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            <DataTableColumnHeader column={column} title="Email" />
        },
        cell: ({ row }) => (
            <div className="w-fit text-nowrap">{row.getValue("email")}</div>
        ),
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Role" />
        ),
        cell: ({ row }) => {
            const { role } = row.original;
            const userType = userTypes.find(({ value }) => value === role);
            if (!userType) {
                return null;
            }
            return (
                <div className="flex items-center gap-x-2">
                    {userType.icon && (
                        <userType.icon size={16} className="text-muted-foreground" />
                    )}
                    <span className="text-sm capitalize">{row.getValue("role")}</span>
                </div>
            )
        },
        filterFn: (row, id, value) => {
            return value.includes(row.getValue(id));
        },
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: 'actions',
        cell: DataTableRowActions
    }
];
