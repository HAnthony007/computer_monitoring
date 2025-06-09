import { Icons } from "@/components/icon/icons";
import { Button } from "@/components/ui/button";
import { useUsers } from "../context/users-context";

export function UsersAddButtons() {
    const { setOpen } = useUsers();
    return (
        <Button className="space-x-1"
            onClick={() => setOpen("add")}
        >
            <span>Add User</span>
            <Icons.addUser size={18} />
        </Button>
    );
}
