import { Bell, ChevronDown, CircleHelp, Command, LogOut, Settings2, X, Zap, Boxes, LayoutDashboard, Package, ShieldCheck, Warehouse, type LucideIcon, Users } from "lucide-react";
import { useState } from "react";
import "boxicons/css/boxicons.min.css";
import { LoginBackground } from "../components/LoginBackground";
import DashboardPage from "../pages/DashboardPage";
import CategoriesPage from "../pages/CategoriesPage";
import InventoriesPage from "../pages/InventoriesPage";
import RolesPage from "../pages/RolesPage";
import UsersPage from "../pages/UsersPage";
import WarehousesPage from "../pages/WarehousesPage";

export default function HomePage() {

    const pages = {
        Dashboard: <DashboardPage />,
        Inventory: <InventoriesPage />,
        Categories: <CategoriesPage />,
        Warehouses: <WarehousesPage />,
        Users: <UsersPage />,
        Roles: <RolesPage />
    };

    type PageKey = keyof typeof pages;

    const navigation = [
        { label: "Dashboard", icon: LayoutDashboard },
        { label: "Inventory", icon: Package },
        { label: "Categories", icon: Boxes },
        { label: "Warehouses", icon: Warehouse },
        { label: "Users", icon: Users },
        { label: "Roles", icon: ShieldCheck },
    ] satisfies { label: PageKey; icon: LucideIcon }[];

    const [activePage, setActivePage] = useState<PageKey>("Dashboard");
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [exportMessage, setExportMessage] = useState("");

    return (
        <div className="min-h-screen bg-[#090d14] text-slate-300 selection:bg-blue-500/30">
            <div className="flex min-h-screen">
                <aside
                    className={`relative hidden shrink-0 flex-col border-r border-white/[0.07] bg-[#0c111a] transition-all duration-300 lg:flex ${sidebarCollapsed ? "w-19" : "w-62"
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
                            className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-xs text-slate-500 transition hover:bg-white/4 hover:text-white"
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
                                            ? "border border-blue-400/15 bg-blue-500/12 font-medium text-blue-300"
                                            : "border border-transparent text-slate-500 hover:bg-white/4 hover:text-slate-200"
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
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-slate-500 transition hover:bg-white/4 hover:text-slate-200"
                                >
                                    <Settings2 size={18} />
                                    Settings
                                </button>
                                <button
                                    onClick={() => setExportMessage("Help center is a demo placeholder")}
                                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-[13px] text-slate-500 transition hover:bg-white/4 hover:text-slate-200"
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
                    <header className="sticky top-0 z-20 flex h-19 items-center justify-between gap-4 border-b border-white/[0.07] bg-[#090d14]/90 px-4 backdrop-blur-xl sm:px-7 xl:px-10">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/3 text-slate-400 lg:hidden">
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
                                    className="h-9 w-48 rounded-lg border border-white/8 bg-white/[0.025] pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/40 focus:bg-white/4 xl:w-64"
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
                                    className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 text-slate-400 transition hover:bg-white/5 hover:text-white"
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
                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-blue-400 to-indigo-600 text-xs font-bold text-white">
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
                                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-xs text-slate-300 hover:bg-white/5"
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
                                className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-blue-400/20 bg-blue-500/8 px-4 py-3 text-xs text-blue-200"
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

                        {pages[activePage]}

                        <footer className="mt-8 flex flex-col gap-2 border-t border-white/6 pt-5 text-[10px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
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