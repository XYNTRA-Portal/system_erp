import { useMemo, useState } from "react";
import {
    ArrowDownRight,
    ArrowUpRight,
    Bell,
    Boxes,
    Building2,
    CalendarDays,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CircleHelp,
    Command,
    Download,
    LogOut,
    MoreHorizontal,
    Package,
    PackageSearch,
    Search,
    Settings2,
    TrendingUp,
    Users,
    X,
    Zap,
} from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { navigation, movements, categories, initialProducts, periods } from "../data/data";
import Panel from "../components/Panel";
import SectionHeading from "../components/SectionHeading";
import "boxicons/css/boxicons.min.css";
import { LoginBackground } from "../components/LoginBackground";

export default function HomePage() {
    const [activePage, setActivePage] = useState("Dashboard");
    const [period, setPeriod] = useState("Last 7 days");
    const [search, setSearch] = useState("");
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [showAllProducts, setShowAllProducts] = useState(false);
    const [showAllActivities, setShowAllActivities] = useState(false);
    const [exportMessage, setExportMessage] = useState("");

    const filteredProducts = useMemo(
        () =>
            initialProducts.filter((product) =>
                [
                    product.name,
                    product.id,
                    product.category,
                    product.warehouse,
                    product.status,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(search.toLowerCase()),
            ),
        [search],
    );

    const chartData = useMemo(() => {
        if (period === "Last 30 days") {
            return movements.map((item, index) => ({
                ...item,
                value: Math.round(item.value * (0.75 + (index % 4) * 0.18)),
            }));
        }

        if (period === "Last 90 days") {
            return movements.map((item, index) => ({
                ...item,
                value: Math.round(item.value * (1.3 + (index % 3) * 0.4)),
            }));
        }

        return movements;
    }, [period]);

    const stats = [
        {
            label: "Total products",
            value: "2,840",
            change: "+12.8%",
            positive: true,
            icon: Package,
            iconStyle: "bg-blue-500/10 text-blue-400",
            description: "vs. previous month",
        },
        {
            label: "Categories",
            value: "24",
            change: "+3.2%",
            positive: true,
            icon: Boxes,
            iconStyle: "bg-violet-500/10 text-violet-400",
            description: "vs. previous month",
        },
        {
            label: "Warehouses",
            value: "08",
            change: "0%",
            positive: true,
            icon: Building2,
            iconStyle: "bg-cyan-500/10 text-cyan-400",
            description: "no change this month",
        },
        {
            label: "Active users",
            value: "36",
            change: "+8.4%",
            positive: true,
            icon: Users,
            iconStyle: "bg-emerald-500/10 text-emerald-400",
            description: "vs. previous month",
        },
    ];

    const handleExport = () => {
        const headers = [
            "ID",
            "Product",
            "Category",
            "Warehouse",
            "Stock",
            "Status",
        ];

        const rows = filteredProducts.map((product) => [
            product.id,
            product.name,
            product.category,
            product.warehouse,
            product.stock,
            product.status,
        ]);

        const csv = [headers, ...rows]
            .map((row) =>
                row
                    .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
                    .join(","),
            )
            .join("\n");

        const url = URL.createObjectURL(
            new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" }),
        );
        const link = document.createElement("a");
        link.href = url;
        link.download = "erp-inventory.csv";
        link.click();
        URL.revokeObjectURL(url);
        setExportMessage("Inventory exported successfully");
        window.setTimeout(() => setExportMessage(""), 2500);
    };

    return (
        <div className="min-h-screen bg-[#090d14] text-slate-300 selection:bg-blue-500/30">
            <div className="flex min-h-screen">
                <aside
                    className={`relative hidden shrink-0 flex-col border-r border-white/[0.07] bg-[#0c111a] transition-all duration-300 lg:flex ${sidebarCollapsed ? "w-[76px]" : "w-[248px]"
                        }`}
                >
                    <div className="flex h-19 items-center gap-3 border-b border-white/[0.07] px-5">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                            <Zap size={21} fill="currentColor" />
                        </div>
                        {!sidebarCollapsed && (
                            <div className="min-w-0">
                                <p className="text-[17px] font-bold tracking-tight text-white">
                                    Test Client<span className="text-blue-400">.</span>
                                </p>
                                <p className="text-[10px] uppercase tracking-[0.19em] text-slate-500">
                                    Enterprise suite
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-white/[0.07] p-3">
                        <button
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                            className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs text-slate-500 transition hover:bg-white/[0.04] hover:text-white"
                        >
                            {sidebarCollapsed ? (
                                <i className="bx bx-menu text-2xl" />
                            ) : (
                                <>
                                    <i className="bx bx-chevrons-left text-2xl" />
                                </>
                            )}
                        </button>
                    </div>

                    <div className="flex-1 px-3 py-7">
                        {!sidebarCollapsed && (
                            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                                Workspace
                            </p>
                        )}

                        <nav className="space-y-1">
                            {navigation.map((item) => {
                                const Icon = item.icon;
                                const active = activePage === item.label;

                                return (
                                    <button
                                        key={item.label}
                                        title={sidebarCollapsed ? item.label : undefined}
                                        onClick={() => setActivePage(item.label)}
                                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-[13px] transition ${active
                                            ? "border border-blue-400/15 bg-blue-500/[0.12] font-medium text-blue-300"
                                            : "border border-transparent text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
                                            }`}
                                    >
                                        <Icon
                                            size={18}
                                            className={
                                                active
                                                    ? "shrink-0 text-blue-400"
                                                    : "shrink-0 group-hover:text-slate-200"
                                            }
                                        />
                                        {!sidebarCollapsed && <span>{item.label}</span>}
                                        {!sidebarCollapsed && active && (
                                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_#60a5fa]" />
                                        )}
                                    </button>
                                );
                            })}
                        </nav>

                        {!sidebarCollapsed && (
                            <>
                                <p className="mb-3 mt-9 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600">
                                    System
                                </p>
                                <button
                                    onClick={() => setExportMessage("Settings are a demo placeholder")}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-200"
                                >
                                    <Settings2 size={18} />
                                    Settings
                                </button>
                                <button
                                    onClick={() => setExportMessage("Help center is a demo placeholder")}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-slate-500 transition hover:bg-white/[0.04] hover:text-slate-200"
                                >
                                    <CircleHelp size={18} />
                                    Help center
                                </button>
                            </>
                        )}
                    </div>

                </aside>

                <main className="min-w-0 flex-1">
                    <LoginBackground />
                    <header className="sticky top-0 z-20 flex h-[76px] items-center justify-between gap-4 border-b border-white/[0.07] bg-[#090d14]/90 px-4 backdrop-blur-xl sm:px-7 xl:px-10">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-400 lg:hidden">
                                <Command size={18} />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 text-[11px] text-slate-600">
                                    <span>Workspace</span>
                                    <span>/</span>
                                    <span className="text-slate-400">{activePage}</span>
                                </div>
                                <p className="mt-1 truncate text-sm font-semibold text-white">
                                    {activePage === "Dashboard"
                                        ? "Overview"
                                        : `${activePage} preview`}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* <div className="relative hidden md:block">
                                <Search
                                    size={15}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                                />
                                <input
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search products..."
                                    className="h-9 w-48 rounded-lg border border-white/[0.08] bg-white/[0.025] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/40 focus:bg-white/[0.04] xl:w-64"
                                />
                                <kbd className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-white/10 px-1.5 py-0.5 text-[9px] text-slate-600 xl:block">
                                    /
                                </kbd>
                            </div> */}

                            <div className="relative">
                                <button
                                    aria-label="Notifications"
                                    onClick={() => {
                                        setShowNotifications(!showNotifications);
                                        setShowProfile(false);
                                    }}
                                    className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                                >
                                    <Bell size={17} />
                                    <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-blue-400 ring-2 ring-[#090d14]" />
                                </button>
                                {showNotifications && (
                                    <div className="absolute right-0 top-12 z-30 w-72 rounded-xl border border-white/10 bg-[#141b27] p-4 shadow-2xl">
                                        <div className="mb-3 flex items-center justify-between">
                                            <p className="text-sm font-semibold text-white">
                                                Notifications
                                            </p>
                                            <button
                                                onClick={() => setShowNotifications(false)}
                                                aria-label="Close notifications"
                                            >
                                                <X size={15} />
                                            </button>
                                        </div>
                                        <p className="text-xs leading-5 text-slate-400">
                                            NVMe SSD 1TB has only 4 units remaining. Review the
                                            inventory alerts below.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="relative border-l border-white/8 pl-3 sm:pl-4">
                                <button
                                    onClick={() => {
                                        setShowProfile(!showProfile);
                                        setShowNotifications(false);
                                    }}
                                    className="flex items-center gap-2.5 rounded-lg text-left"
                                >
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 text-xs font-bold text-white">
                                        AM
                                    </div>
                                    <div className="hidden sm:block">
                                        <p className="text-xs font-semibold text-slate-200">
                                            Alex Morgan
                                        </p>
                                        <p className="mt-0.5 text-[10px] text-slate-500">
                                            Administrator
                                        </p>
                                    </div>
                                    <ChevronDown size={14} className="hidden text-slate-500 sm:block" />
                                </button>
                                {showProfile && (
                                    <div className="absolute right-0 top-12 z-30 w-48 rounded-xl border border-white/10 bg-[#141b27] p-2 shadow-2xl">
                                        <p className="px-3 py-2 text-xs text-slate-400">
                                            Signed in as Alex
                                        </p>
                                        <button
                                            onClick={() => {
                                                setShowProfile(false);
                                                setExportMessage("Connect your logout handler here");
                                            }}
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-slate-300 hover:bg-white/[0.05]"
                                        >
                                            <LogOut size={14} />
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </header>

                    <div className="mx-auto max-w-[1600px] p-4 sm:p-7 xl:p-10">
                        {exportMessage && (
                            <div
                                role="status"
                                className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-blue-400/20 bg-blue-500/[0.08] px-4 py-3 text-xs text-blue-200"
                            >
                                {exportMessage}
                                <button
                                    onClick={() => setExportMessage("")}
                                    aria-label="Dismiss message"
                                >
                                    <X size={15} />
                                </button>
                            </div>
                        )}

                        {activePage == "Dashboard" && (
                            <div>
                                <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                                    <div>
                                        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-400/15 bg-blue-500/[0.07] px-3 py-1.5">
                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                                            <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-blue-300">
                                                Dashboard overview
                                            </span>
                                        </div>
                                        <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                                            Welcome back, Alex
                                            <span className="ml-2 inline-block">✦</span>
                                        </h1>
                                        <p className="mt-2 text-xs leading-5 text-slate-500 sm:text-sm">
                                            Here&apos;s what&apos;s happening across your business today.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <div className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 text-xs text-slate-400">
                                            <CalendarDays size={14} />
                                            Oct 14, 2026
                                        </div>
                                        <button
                                            onClick={handleExport}
                                            className="flex h-9 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 text-xs font-medium text-slate-300 transition hover:border-blue-400/30 hover:bg-blue-500/[0.07] hover:text-white"
                                        >
                                            <Download size={14} />
                                            Export report
                                        </button>
                                    </div>
                                </div>

                                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                                    {stats.map((stat) => {
                                        const Icon = stat.icon;
                                        const ChangeIcon = stat.positive
                                            ? ArrowUpRight
                                            : ArrowDownRight;

                                        return (
                                            <Panel
                                                key={stat.label}
                                                className="group relative overflow-hidden p-5 transition duration-300 hover:-translate-y-0.5 hover:border-blue-400/20"
                                            >
                                                <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-500/[0.035] blur-2xl transition group-hover:bg-blue-500/[0.09]" />
                                                <div className="relative flex items-start justify-between">
                                                    <div>
                                                        <p className="text-xs font-medium text-slate-500">
                                                            {stat.label}
                                                        </p>
                                                        <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                                                            {stat.value}
                                                        </p>
                                                    </div>
                                                    <div className={`rounded-xl p-2.5 ${stat.iconStyle}`}>
                                                        <Icon size={19} />
                                                    </div>
                                                </div>
                                                <div className="relative mt-5 flex flex-wrap items-center gap-2">
                                                    <span className="inline-flex items-center gap-0.5 rounded-md bg-emerald-400/[0.08] px-1.5 py-1 text-[10px] font-medium text-emerald-400">
                                                        <ChangeIcon size={12} />
                                                        {stat.change}
                                                    </span>
                                                    <span className="text-[10px] text-slate-600">
                                                        {stat.description}
                                                    </span>
                                                </div>
                                            </Panel>
                                        );
                                    })}
                                </div>

                                <div className="mb-8 grid grid-cols-1 gap-5 xl:grid-cols-3">
                                    <Panel className="p-5 sm:p-6 xl:col-span-2">
                                        <SectionHeading
                                            title="Inventory movements"
                                            subtitle="Track your stock activity over time"
                                            action={
                                                <div className="relative">
                                                    <select
                                                        value={period}
                                                        onChange={(event) => setPeriod(event.target.value)}
                                                        className="h-8 appearance-none rounded-lg border border-white/[0.08] bg-[#151c29] py-0 pl-3 pr-8 text-[11px] text-slate-300 outline-none focus:border-blue-400/40"
                                                    >
                                                        {periods.map((item) => (
                                                            <option key={item}>{item}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown
                                                        size={12}
                                                        className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
                                                    />
                                                </div>
                                            }
                                        />

                                        <div className="mb-4 flex flex-wrap items-center gap-4">
                                            <div>
                                                <p className="text-2xl font-semibold text-white">1,284</p>
                                                <p className="mt-1 text-[10px] text-slate-500">
                                                    Total movements
                                                </p>
                                            </div>
                                            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-400/[0.08] px-2 py-1 text-[10px] text-emerald-400">
                                                <TrendingUp size={12} />
                                                18.6%
                                            </span>
                                        </div>

                                        <div className="h-[230px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <AreaChart
                                                    data={chartData}
                                                    margin={{ top: 10, right: 4, left: -22, bottom: 0 }}
                                                >
                                                    <defs>
                                                        <linearGradient
                                                            id="movementGradient"
                                                            x1="0"
                                                            y1="0"
                                                            x2="0"
                                                            y2="1"
                                                        >
                                                            <stop
                                                                offset="0%"
                                                                stopColor="#4388ff"
                                                                stopOpacity={0.28}
                                                            />
                                                            <stop
                                                                offset="95%"
                                                                stopColor="#4388ff"
                                                                stopOpacity={0}
                                                            />
                                                        </linearGradient>
                                                    </defs>
                                                    <CartesianGrid
                                                        stroke="#ffffff"
                                                        strokeOpacity={0.055}
                                                        vertical={false}
                                                    />
                                                    <XAxis
                                                        dataKey="day"
                                                        tick={{ fill: "#64748b", fontSize: 10 }}
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tickMargin={12}
                                                    />
                                                    <YAxis
                                                        tick={{ fill: "#64748b", fontSize: 10 }}
                                                        axisLine={false}
                                                        tickLine={false}
                                                        tickMargin={8}
                                                    />
                                                    <Tooltip
                                                        contentStyle={{
                                                            background: "#151c29",
                                                            border: "1px solid #293548",
                                                            borderRadius: 10,
                                                            color: "#e2e8f0",
                                                            fontSize: 12,
                                                        }}
                                                        labelStyle={{ color: "#94a3b8", marginBottom: 4 }}
                                                        itemStyle={{ color: "#60a5fa" }}
                                                    />
                                                    <Area
                                                        type="monotone"
                                                        dataKey="value"
                                                        name="Movements"
                                                        stroke="#4388ff"
                                                        strokeWidth={2}
                                                        fill="url(#movementGradient)"
                                                        activeDot={{
                                                            r: 4,
                                                            fill: "#4388ff",
                                                            stroke: "#dbeafe",
                                                            strokeWidth: 2,
                                                        }}
                                                    />
                                                </AreaChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
                                            <span className="h-2 w-2 rounded-full bg-blue-400" />
                                            Stock movements
                                            <span className="ml-auto">Demo data</span>
                                        </div>
                                    </Panel>

                                    <Panel className="p-5 sm:p-6">
                                        <SectionHeading
                                            title="Stock by category"
                                            subtitle="Distribution across product groups"
                                            action={
                                                <button
                                                    onClick={() => setActivePage("Categories")}
                                                    aria-label="Open categories"
                                                    className="rounded-lg p-1.5 text-slate-500 hover:bg-white/[0.05] hover:text-white"
                                                >
                                                    <MoreHorizontal size={18} />
                                                </button>
                                            }
                                        />

                                        <div className="relative mx-auto h-[190px] max-w-[240px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={categories}
                                                        dataKey="value"
                                                        nameKey="name"
                                                        innerRadius={61}
                                                        outerRadius={83}
                                                        paddingAngle={4}
                                                        stroke="none"
                                                        cornerRadius={4}
                                                    >
                                                        {categories.map((category) => (
                                                            <circle
                                                                key={category.name}
                                                                fill={category.color}
                                                            />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip
                                                        contentStyle={{
                                                            background: "#151c29",
                                                            border: "1px solid #293548",
                                                            borderRadius: 10,
                                                            color: "#e2e8f0",
                                                            fontSize: 11,
                                                        }}
                                                        formatter={(value) => [`${value}%`, "Share"]}
                                                    />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-2xl font-semibold text-white">
                                                    2,840
                                                </span>
                                                <span className="mt-1 text-[10px] text-slate-500">
                                                    Products
                                                </span>
                                            </div>
                                        </div>

                                        <div className="mt-3 space-y-3">
                                            {categories.map((category) => (
                                                <div
                                                    key={category.name}
                                                    className="flex items-center gap-2"
                                                >
                                                    <span
                                                        className="h-2 w-2 rounded-full"
                                                        style={{ backgroundColor: category.color }}
                                                    />
                                                    <span className="flex-1 text-[11px] text-slate-400">
                                                        {category.name}
                                                    </span>
                                                    <span className="text-xs font-medium text-slate-200">
                                                        {category.value}%
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </Panel>
                                </div>
                            </div>
                        )}

                        {activePage !== "Dashboard" && (
                            <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-400/15 bg-blue-500/[0.06] p-4">
                                <PackageSearch
                                    size={20}
                                    className="mt-0.5 shrink-0 text-blue-400"
                                />
                                <div>
                                    <p className="text-sm font-medium text-white">
                                        {activePage} module
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-slate-400">
                                        This is a navigation prototype. Your existing routes and
                                        module pages have not been modified. Return to Dashboard
                                        to view the overview.
                                    </p>
                                    <button
                                        onClick={() => setActivePage("Dashboard")}
                                        className="mt-3 text-xs font-medium text-blue-400 hover:text-blue-300"
                                    >
                                        Back to dashboard →
                                    </button>
                                </div>
                            </div>
                        )}

                        <footer className="mt-8 flex flex-col gap-2 border-t border-white/[0.06] pt-5 text-[10px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                            <p>
                                © 2026 Test Client. All rights reserved.
                            </p>
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    Demo environment
                                </span>
                                <span>v0.1.0</span>
                            </div>
                        </footer>
                    </div>
                </main>
            </div>

            <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-[#151c29]/95 px-3 py-2 text-[10px] text-slate-400 shadow-xl backdrop-blur-lg">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                Prototype mode
            </div>
        </div>
    );
}
