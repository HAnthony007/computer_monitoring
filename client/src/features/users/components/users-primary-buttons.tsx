import { Icons } from "@/components/icon/icons";
import { Button } from "@/components/ui/button";

export function UsersPrimaryButtons() {
    return (
        <Button className="space-x-1">
            <span>Add User</span>
            <Icons.addUser />
        </Button>
    );
}
