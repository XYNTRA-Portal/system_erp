import {
    Boxes,
    LayoutDashboard,
    Package,
    PackageCheck,
    ShieldCheck,
    Users,
    Warehouse,
} from "lucide-react";

export const navigation = [
    { label: "Dashboard", icon: LayoutDashboard },
    { label: "Inventory", icon: Package },
    { label: "Categories", icon: Boxes },
    { label: "Warehouses", icon: Warehouse },
    { label: "Users", icon: Users },
    { label: "Roles", icon: ShieldCheck },
];

export const movements = [
    { day: "Mon", value: 42 },
    { day: "Tue", value: 68 },
    { day: "Wed", value: 53 },
    { day: "Thu", value: 91 },
    { day: "Fri", value: 72 },
    { day: "Sat", value: 110 },
    { day: "Sun", value: 84 },
    { day: "Mon", value: 125 },
    { day: "Tue", value: 96 },
    { day: "Wed", value: 142 },
    { day: "Thu", value: 117 },
    { day: "Fri", value: 156 },
];

export const categories = [
    { name: "Electronics", value: 38, color: "#4388ff" },
    { name: "Accessories", value: 27, color: "#8b5cf6" },
    { name: "Components", value: 21, color: "#22d3ee" },
    { name: "Other", value: 14, color: "#475569" },
];

export const initialProducts = [
    {
        id: "PRD-1042",
        name: "Mechanical Keyboard",
        category: "Electronics",
        warehouse: "Central Warehouse",
        stock: 128,
        status: "In stock",
        initials: "MK",
        color: "blue",
    },
    {
        id: "PRD-1041",
        name: "USB-C Hub 7-in-1",
        category: "Accessories",
        warehouse: "North Warehouse",
        stock: 12,
        status: "Low stock",
        initials: "UH",
        color: "purple",
    },
    {
        id: "PRD-1040",
        name: "Wireless Mouse Pro",
        category: "Electronics",
        warehouse: "Central Warehouse",
        stock: 86,
        status: "In stock",
        initials: "WM",
        color: "cyan",
    },
    {
        id: "PRD-1039",
        name: "NVMe SSD 1TB",
        category: "Components",
        warehouse: "South Warehouse",
        stock: 4,
        status: "Critical",
        initials: "SD",
        color: "orange",
    },
    {
        id: "PRD-1038",
        name: "Monitor Stand",
        category: "Accessories",
        warehouse: "North Warehouse",
        stock: 32,
        status: "In stock",
        initials: "MS",
        color: "green",
    },
];

export const activities = [
    {
        title: "Stock replenished",
        description: "Mechanical Keyboard · +40 units",
        time: "10 min ago",
        icon: PackageCheck,
        color: "text-blue-400",
        bg: "bg-blue-500/10",
    },
    {
        title: "New user registered",
        description: "alex.morgan@company.com",
        time: "35 min ago",
        icon: Users,
        color: "text-violet-400",
        bg: "bg-violet-500/10",
    },
    {
        title: "Warehouse updated",
        description: "North Warehouse · Location changed",
        time: "1 hour ago",
        icon: Warehouse,
        color: "text-cyan-400",
        bg: "bg-cyan-500/10",
    },
];

export const periods = ["Last 7 days", "Last 30 days", "Last 90 days"];

export const colorClasses: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-400",
    purple: "bg-violet-500/10 text-violet-400",
    cyan: "bg-cyan-500/10 text-cyan-400",
    orange: "bg-orange-500/10 text-orange-400",
    green: "bg-emerald-500/10 text-emerald-400",
};