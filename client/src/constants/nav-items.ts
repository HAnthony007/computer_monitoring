import { NavItem } from "@/types/sidebar";

export const navItems: NavItem[] = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: "dashboard",
        isActive: false,
        shortcut: ["d", "d"],
        items: [],
    },
    {
        title: "Computers",
        url: "/computers",
        icon: "server",
        isActive: false,
        shortcut: ["c", "c"],
        items: [],
    },
    {
        title: "Agents",
        url: "/agents",
        icon: "activity",
        isActive: false,
        shortcut: ["a", "a"],
        items: [],
    },
    {
        title: "Users",
        url: "/users",
        icon: "users",
        isActive: false,
        shortcut: ["u", "u"],
        items: [],
    },
];
