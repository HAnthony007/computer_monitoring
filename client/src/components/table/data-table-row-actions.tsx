import { useUsers } from "@/features/users/context/users-context";
import { User } from "@/features/users/data/schema";
import { Row } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Icons } from "../icon/icons";
import { Button } from "../ui/button";

interface DataTableRowActionsProps {
    row: Row<User>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
    const { setOpen, setCurrentRow } = useUsers()
    return (
        <>
            <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="data-[state=open]:bg-muted h-8 w-8 p-0"
                    >
                        <Icons.MoreH className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[160px]">
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(row.original)
                            setOpen("edit")
                        }}
                    >
                        Edit
                        <DropdownMenuShortcut>
                            <Icons.Edit size={16} />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => {
                            setCurrentRow(row.original)
                            setOpen("delete")
                        }}
                        className="text-red-500!"
                    >
                        Delete
                        <DropdownMenuShortcut>
                            <Icons.Trash size={16} />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}