import { useMemo, useState } from "react";
import {
    ArrowDownRight,
    ArrowUpRight,
    Boxes,
    Building2,
    CalendarDays,
    ChevronDown,
    Download,
    MoreHorizontal,
    Package,
    TrendingUp,
    Users,
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
import { movements, categories, initialProducts, periods } from "../data/data";
import Panel from "../components/Panel";
import SectionHeading from "../components/SectionHeading";
import "boxicons/css/boxicons.min.css";

const DashboardPage = () => {
    const [activePage, setActivePage] = useState("Dashboard");
    const [period, setPeriod] = useState("Last 7 days");
    const [search, setSearch] = useState("");
    // const [showAllProducts, setShowAllProducts] = useState(false);
    // const [showAllActivities, setShowAllActivities] = useState(false);
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
    )
}

export default DashboardPage;