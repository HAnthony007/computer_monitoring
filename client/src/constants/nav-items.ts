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
        title: "Users",
        url: "/users",
        icon: "users",
        isActive: false,
        shortcut: ["u", "u"],
        items: [],
    },
    {
        title: "Events",
        url: "#",
        icon: "calendar",
        isActive: false,
        shortcut: ["c", "d"],
        items: [],
    },
    {
        title: "Calendar",
        url: "#",
        icon: "calendar",
        isActive: false,
        shortcut: ["c", "c"],
        items: [],
    },
];
