import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  SPECIAL_ACCESS_SECRET,
  getAdminCredentials,
  updateAdminCredentials,
  verifyAdminLogin,
  loginWithSpecialKey,
  isAdminAuthenticated,
  adminLogout,
  getAdminOrders,
  updateOrderStatus,
  deleteAdminOrder,
  seedSampleOrders,
  getVisitorAnalytics,
  clearAllAdminData,
  clearAdminOrders,
  clearVisitorAnalytics,
  type AdminOrder,
  type OrderStatus,
  type AnalyticsData,
} from "@/lib/admin-store";
import {
  Lock,
  Key,
  User,
  ShieldCheck,
  LogOut,
  ShoppingBag,
  Eye,
  EyeOff,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Phone,
  RefreshCw,
  Download,
  Search,
  DollarSign,
  Laptop,
  Smartphone,
  Tablet,
  FileText,
  Calendar,
  Sparkles,
  Coffee,
  Utensils,
  Check,
  Filter,
  Copy,
  ExternalLink,
  Trash2,
  ShieldAlert,
  Ban,
} from "lucide-react";
import { toast } from "sonner";
import { Umbrella } from "@/components/SiteChrome";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — Little Umbrella Cafe" },
      { name: "description", content: "Little Umbrella Cafe online order management and visitor analytics." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"orders" | "analytics" | "settings">("orders");

  // Login form state
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Orders and analytics state
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData>(getVisitorAnalytics());
  const [orderFilter, setOrderFilter] = useState<"all" | OrderStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrderForTicket, setSelectedOrderForTicket] = useState<AdminOrder | null>(null);

  // Admin Cancel Modal State
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);
  const [adminCancelReason, setAdminCancelReason] = useState("");

  // Settings state (change password)
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Check auth & special access link on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const key = params.get("key") || params.get("access_token") || params.get("token") || params.get("special");
      if (key && loginWithSpecialKey(key)) {
        setIsAuthenticated(true);
        refreshData();
        toast.success("✨ Special 1-Click Link Verified! Welcome to Admin Portal.");
        window.history.replaceState({}, "", "/admin");
        return;
      }
    }

    const auth = isAdminAuthenticated();
    setIsAuthenticated(auth);
    if (auth) {
      refreshData();
    }
  }, []);

  // Listen to order and analytics update events
  useEffect(() => {
    const handleOrdersUpdate = () => {
      setOrders(getAdminOrders());
    };
    const handleAnalyticsUpdate = () => {
      setAnalytics(getVisitorAnalytics());
    };

    window.addEventListener("umbrella_orders_updated", handleOrdersUpdate);
    window.addEventListener("umbrella_analytics_updated", handleAnalyticsUpdate);

    return () => {
      window.removeEventListener("umbrella_orders_updated", handleOrdersUpdate);
      window.removeEventListener("umbrella_analytics_updated", handleAnalyticsUpdate);
    };
  }, []);

  const refreshData = () => {
    const currentOrders = getAdminOrders();
    setOrders(currentOrders);
    setAnalytics(getVisitorAnalytics());
  };

  const handleClearAllData = () => {
    if (
      window.confirm(
        "Are you sure you want to clear ALL orders and website visitor counts? This will reset all records to 0."
      )
    ) {
      clearAllAdminData();
      setOrders([]);
      setAnalytics({
        totalViews: 0,
        uniqueVisitorIds: [],
        todayViewsCount: 0,
        todayDate: new Date().toISOString().split("T")[0] || "",
        pathCounts: {},
        recentLogs: [],
      });
      toast.success("All data cleared successfully!");
    }
  };

  const handleClearOrdersOnly = () => {
    if (window.confirm("Are you sure you want to delete all online orders?")) {
      clearAdminOrders();
      setOrders([]);
      toast.success("All orders cleared!");
    }
  };

  const handleClearAnalyticsOnly = () => {
    if (window.confirm("Are you sure you want to reset visitor counts to 0?")) {
      clearVisitorAnalytics();
      setAnalytics({
        totalViews: 0,
        uniqueVisitorIds: [],
        todayViewsCount: 0,
        todayDate: new Date().toISOString().split("T")[0] || "",
        pathCounts: {},
        recentLogs: [],
      });
      toast.success("Visitor statistics reset to 0!");
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!usernameInput.trim() || !passwordInput) {
      setLoginError("Please enter both username and password.");
      return;
    }

    const success = verifyAdminLogin(usernameInput, passwordInput);
    if (success) {
      setIsAuthenticated(true);
      refreshData();
      toast.success("Welcome back to Admin Portal!");
    } else {
      setLoginError("Invalid username or password. Please check your credentials.");
      toast.error("Authentication failed");
    }
  };

  const handleLogout = () => {
    adminLogout();
    setIsAuthenticated(false);
    toast.info("Logged out successfully");
  };

  const handleStatusChange = (orderId: string, nextStatus: OrderStatus) => {
    if (nextStatus === "cancelled") {
      handleOpenCancelDialog(orderId);
      return;
    }
    updateOrderStatus(orderId, nextStatus);
    setOrders(getAdminOrders());
    toast.success(`Order ${orderId} updated to: ${nextStatus}`);
  };

  const handleOpenCancelDialog = (orderId: string) => {
    setCancellingOrderId(orderId);
    setAdminCancelReason("Item out of stock / Store management decision");
  };

  const handleConfirmAdminCancel = () => {
    if (!cancellingOrderId) return;
    updateOrderStatus(cancellingOrderId, "cancelled", {
      cancelledBy: "admin",
      cancelReason: adminCancelReason.trim() || "Cancelled by Store Management",
    });
    setOrders(getAdminOrders());
    toast.success(`Order ${cancellingOrderId} marked as Cancelled by Admin`);
    setCancellingOrderId(null);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      deleteAdminOrder(orderId);
      setOrders(getAdminOrders());
      toast.info(`Order ${orderId} removed`);
    }
  };

  const handleSeedOrders = () => {
    seedSampleOrders();
    setOrders(getAdminOrders());
    toast.success("Sample demo orders loaded!");
  };

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    const ok = updateAdminCredentials(newUsername, newPassword);
    if (ok) {
      toast.success("Admin credentials successfully updated!");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error("Failed to update credentials");
    }
  };

  const handleExportCSV = () => {
    if (orders.length === 0) {
      toast.error("No orders to export");
      return;
    }

    const headers = [
      "Order ID",
      "Order Type",
      "Date",
      "Time",
      "Customer Name",
      "Phone",
      "Pickup Time",
      "Items Count",
      "Subtotal",
      "Tax",
      "Total",
      "Status",
      "Cancelled By",
      "Cancelled Time",
      "Cancel Reason",
      "Notes",
    ];
    const rows = orders.map((o) => [
      o.id,
      `"${o.orderType === "dine-in" ? "Dine In" : "Take Away"}"`,
      o.dateString,
      o.formattedTime,
      `"${o.customerName.replace(/"/g, '""')}"`,
      `"${o.phone}"`,
      `"${o.pickupTime}"`,
      o.items.reduce((sum, i) => sum + i.quantity, 0),
      o.subtotal.toFixed(2),
      o.tax.toFixed(2),
      o.total.toFixed(2),
      o.status,
      `"${o.cancelledBy ? (o.cancelledBy === "user" ? "Customer (2-min window)" : "Admin / Store Staff") : ""}"`,
      `"${o.cancelledTimeFormatted || ""}"`,
      `"${(o.cancelReason || "").replace(/"/g, '""')}"`,
      `"${(o.notes || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `little_umbrella_orders_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Orders exported to CSV!");
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderFilter !== "all" && o.status !== orderFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesId = o.id.toLowerCase().includes(q);
        const matchesName = o.customerName.toLowerCase().includes(q);
        const matchesPhone = o.phone.toLowerCase().includes(q);
        const matchesItem = o.items.some((i) => i.menuItem.name.toLowerCase().includes(q));
        return matchesId || matchesName || matchesPhone || matchesItem;
      }
      return true;
    });
  }, [orders, orderFilter, searchQuery]);

  // Aggregate stats
  const totalRevenue = useMemo(() => {
    return orders
      .filter((o) => o.status !== "cancelled")
      .reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const statusCounts = useMemo(() => {
    return {
      all: orders.length,
      received: orders.filter((o) => o.status === "received").length,
      preparing: orders.filter((o) => o.status === "preparing").length,
      ready: orders.filter((o) => o.status === "ready").length,
      completed: orders.filter((o) => o.status === "completed").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  // ==========================================
  // VIEW: LOGIN SCREEN (When not authenticated)
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-gradient-to-b from-secondary/30 via-background to-background">
        <div className="w-full max-w-md rounded-3xl border border-border/80 bg-card p-8 sm:p-10 shadow-2xl">
          {/* Logo & Header */}
          <div className="text-center">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md mb-4">
              <Umbrella className="h-8 w-10 text-sun" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">
              Admin Portal
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Little Umbrella Cafe • Order Management & Visitor Analytics
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            {loginError && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter username"
                  required
                  autoComplete="username"
                  className="w-full rounded-xl border border-input bg-background pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Strong Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-input bg-background pl-10 pr-10 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition font-mono text-xs sm:text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-95 transition active:scale-[0.98] cursor-pointer"
            >
              <Key className="w-4 h-4 text-sun" />
              <span>Sign In to Admin Dashboard</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: AUTHENTICATED ADMIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Top Admin Bar */}
      <header className="border-b border-border bg-card/95 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-xs">
              <Umbrella className="h-6 w-8 text-sun" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-display font-bold text-foreground">
                  Little Umbrella Admin
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                4372 W 10th Ave, Vancouver • Manager Portal
              </p>
            </div>
          </div>

          {/* Navigation Tabs & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="inline-flex items-center rounded-full border border-border/80 bg-secondary/50 p-1 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium transition cursor-pointer ${
                  activeTab === "orders"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Orders ({statusCounts.all})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("analytics")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium transition cursor-pointer ${
                  activeTab === "analytics"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Viewers ({analytics.totalViews})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium transition cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Key className="w-3.5 h-3.5" />
                <span>Security</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-secondary transition cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-8 space-y-8">
        {/* ========================================================
            KPI / METRICS SUMMARY STAT CARDS (Always visible)
           ======================================================== */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Website Viewers */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Viewers</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-foreground">
                {analytics.totalViews}
              </span>
              <span className="text-xs text-muted-foreground">page views</span>
            </div>
            <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
              <span>{analytics.uniqueVisitorIds.length} unique visitors</span>
              <span>•</span>
              <span>{analytics.todayViewsCount} today</span>
            </div>
          </div>

          {/* 2. Total Orders */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Online Orders</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-foreground">
                {orders.length}
              </span>
              <span className="text-xs text-muted-foreground">total orders</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {statusCounts.received} new received • {statusCounts.preparing} preparing
            </div>
          </div>

          {/* 3. Total Sales Revenue */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-foreground">
                ${totalRevenue.toFixed(2)}
              </span>
              <span className="text-xs text-muted-foreground">CAD</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Avg ${(orders.length ? totalRevenue / orders.length : 0).toFixed(2)} per order
            </div>
          </div>

          {/* 4. Active Queue */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Queue</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-display font-bold text-foreground">
                {statusCounts.received + statusCounts.preparing}
              </span>
              <span className="text-xs text-muted-foreground">in progress</span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {statusCounts.ready} ready for pickup counter
            </div>
          </div>
        </section>

        {/* ========================================================
            TAB 1: LIVE ORDERS MANAGEMENT
           ======================================================== */}
        {activeTab === "orders" && (
          <section className="space-y-6">
            {/* Action Bar (Filters, Search, CSV Export, Seed) */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              {/* Status Filter Buttons */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {(
                  [
                    { id: "all", label: "All", count: statusCounts.all },
                    { id: "received", label: "Received", count: statusCounts.received },
                    { id: "preparing", label: "Preparing", count: statusCounts.preparing },
                    { id: "ready", label: "Ready", count: statusCounts.ready },
                    { id: "completed", label: "Completed", count: statusCounts.completed },
                    { id: "cancelled", label: "Cancelled", count: statusCounts.cancelled },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setOrderFilter(tab.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                      orderFilter === tab.id
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span className="text-[10px] opacity-75">({tab.count})</span>
                  </button>
                ))}
              </div>

              {/* Search & Actions */}
              <div className="flex items-center gap-2.5">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search customer, phone, ID..."
                    className="w-full rounded-xl border border-input bg-card pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      ×
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={refreshData}
                  className="p-2 rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-secondary transition cursor-pointer"
                  title="Refresh Data"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition cursor-pointer"
                  title="Export orders as CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Export CSV</span>
                </button>

                {orders.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearOrdersOnly}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 transition cursor-pointer"
                    title="Clear all orders"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Clear Orders</span>
                  </button>
                )}

                {orders.length === 0 && (
                  <button
                    type="button"
                    onClick={handleSeedOrders}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-sun text-primary px-3 py-1.5 text-xs font-bold shadow-xs hover:opacity-95 transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Load Demo Orders</span>
                  </button>
                )}
              </div>
            </div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card/60 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-base font-display font-medium text-foreground">
                  No orders found
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  {orders.length === 0
                    ? "When customers place orders online on the website, they will appear here in real-time."
                    : "No orders match the selected filter or search query."}
                </p>
                {orders.length === 0 && (
                  <button
                    type="button"
                    onClick={handleSeedOrders}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-95 cursor-pointer mt-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-sun" />
                    <span>Load Sample Orders for Testing</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredOrders.map((order) => {
                  const statusStyles: Record<OrderStatus, { bg: string; text: string; border: string; label: string }> = {
                    received: { bg: "bg-amber-500/10", text: "text-amber-700 dark:text-amber-400", border: "border-amber-500/30", label: "Received 🟡" },
                    preparing: { bg: "bg-blue-500/10", text: "text-blue-700 dark:text-blue-400", border: "border-blue-500/30", label: "Preparing 🔵" },
                    ready: { bg: "bg-emerald-500/10", text: "text-emerald-700 dark:text-emerald-400", border: "border-emerald-500/30", label: "Ready for Pickup 🟢" },
                    completed: { bg: "bg-secondary", text: "text-muted-foreground", border: "border-border", label: "Completed ✔️" },
                    cancelled: { bg: "bg-destructive/10", text: "text-destructive", border: "border-destructive/30", label: "Cancelled ❌" },
                  };
                  const currentStyle = statusStyles[order.status];

                  return (
                    <div
                      key={order.id}
                      className="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 shadow-xs hover:border-accent/40 transition-all duration-200"
                    >
                      <div>
                        {/* Header: ID, Time & Status */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold bg-secondary px-2.5 py-1 rounded-md border border-border text-foreground">
                              {order.id}
                            </span>
                            <span className="text-[11px] text-muted-foreground">
                              {order.formattedTime}
                            </span>
                          </div>

                          {order.status === "cancelled" ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border bg-destructive/10 text-destructive border-destructive/30">
                              {order.cancelledBy === "user" ? (
                                <>
                                  <User className="w-3 h-3 text-rose-500" />
                                  <span>Customer Cancelled ❌</span>
                                </>
                              ) : (
                                <>
                                  <ShieldAlert className="w-3 h-3 text-red-500" />
                                  <span>Admin Cancelled 🚫</span>
                                </>
                              )}
                            </span>
                          ) : (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${currentStyle.bg} ${currentStyle.text} ${currentStyle.border}`}>
                              {currentStyle.label}
                            </span>
                          )}
                        </div>

                        {/* Customer Details */}
                        <div className="mb-3.5 pb-3 border-b border-border/60">
                          <div className="flex items-start justify-between gap-2">
                            <div className="text-base font-display font-semibold text-foreground">
                              {order.customerName}
                            </div>
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-md bg-secondary text-foreground border border-border shrink-0">
                              {order.orderType === "dine-in" ? (
                                <>
                                  <Utensils className="w-3 h-3 text-accent" />
                                  <span>Dine In</span>
                                </>
                              ) : (
                                <>
                                  <ShoppingBag className="w-3 h-3 text-accent" />
                                  <span>Take Away</span>
                                </>
                              )}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1">
                            <a
                              href={`tel:${order.phone}`}
                              className="inline-flex items-center gap-1 hover:text-accent transition-colors"
                            >
                              <Phone className="w-3 h-3 text-accent" />
                              <span>{order.phone}</span>
                            </a>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-accent" />
                              <span>Pickup: <strong className="text-foreground">{order.pickupTime}</strong></span>
                            </span>
                          </div>
                          {order.notes && (
                            <div className="mt-2 rounded-lg bg-secondary/50 border border-border/50 p-2 text-[11px] text-muted-foreground italic">
                              Note: "{order.notes}"
                            </div>
                          )}

                          {/* Cancellation Attribution Banner */}
                          {order.status === "cancelled" && (
                            <div className="mt-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-2.5 text-xs space-y-1">
                              <div className="flex items-center justify-between font-bold text-destructive">
                                <span className="flex items-center gap-1.5">
                                  {order.cancelledBy === "user" ? (
                                    <>
                                      <User className="w-3.5 h-3.5 text-rose-500" />
                                      <span>Cancelled by Customer</span>
                                    </>
                                  ) : (
                                    <>
                                      <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                                      <span>Cancelled by Admin</span>
                                    </>
                                  )}
                                </span>
                                {order.cancelledTimeFormatted && (
                                  <span className="font-mono text-[10px] text-muted-foreground bg-background/60 px-1.5 py-0.5 rounded border border-border/40">
                                    {order.cancelledTimeFormatted}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                {order.cancelledBy === "user" ? (
                                  <span>Cancelled within 2-minute customer grace window</span>
                                ) : (
                                  <span>Cancelled by store management</span>
                                )}
                              </div>
                              {order.cancelReason && (
                                <p className="text-[11px] text-muted-foreground italic bg-background/60 p-1.5 rounded border border-border/40">
                                  Reason: "{order.cancelReason}"
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Items Breakdown */}
                        <div className="space-y-2 mb-4">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Items Ordered ({order.items.reduce((s, i) => s + i.quantity, 0)})
                          </span>
                          <div className="space-y-1.5">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-start justify-between gap-2 text-xs py-1 border-b border-border/30 last:border-0"
                              >
                                <div className="flex items-start gap-2 min-w-0">
                                  <span className="font-bold text-accent shrink-0">
                                    {item.quantity}x
                                  </span>
                                  <div className="truncate">
                                    <span className="font-medium text-foreground">
                                      {item.menuItem.name}
                                    </span>
                                    {item.selectedVariety && (
                                      <span className="text-[11px] text-accent block truncate">
                                        Variety: {item.selectedVariety.name}
                                      </span>
                                    )}
                                    {item.selectedSize && (
                                      <span className="text-[10px] text-muted-foreground block">
                                        Size: {item.selectedSize.label}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <span className="font-semibold text-foreground shrink-0">
                                  ${item.totalPrice.toFixed(2)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Footer: Total & Status Actions */}
                      <div className="pt-3 border-t border-border/60">
                        <div className="flex items-center justify-between mb-3 text-sm">
                          <span className="text-xs text-muted-foreground">
                            Subtotal ${order.subtotal.toFixed(2)} + GST ${order.tax.toFixed(2)}
                          </span>
                          <span className="text-base font-bold font-display text-foreground">
                            ${order.total.toFixed(2)}
                          </span>
                        </div>

                        {/* Quick Status Buttons */}
                        <div className="flex flex-wrap items-center gap-1.5 justify-between">
                          <div className="flex flex-wrap items-center gap-1">
                            {order.status === "received" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(order.id, "preparing")}
                                className="px-2.5 py-1 rounded-lg bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-[11px] font-semibold hover:bg-blue-500/25 transition cursor-pointer"
                              >
                                Start Preparing
                              </button>
                            )}
                            {order.status === "preparing" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(order.id, "ready")}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold hover:bg-emerald-500/25 transition cursor-pointer"
                              >
                                Mark Ready
                              </button>
                            )}
                            {order.status === "ready" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(order.id, "completed")}
                                className="px-2.5 py-1 rounded-lg bg-primary text-primary-foreground text-[11px] font-semibold hover:opacity-90 transition cursor-pointer"
                              >
                                Complete Order
                              </button>
                            )}
                            {order.status !== "cancelled" && order.status !== "completed" && (
                              <button
                                type="button"
                                onClick={() => handleOpenCancelDialog(order.id)}
                                className="px-2 py-1 rounded-lg text-muted-foreground hover:text-destructive text-[11px] transition cursor-pointer flex items-center gap-1"
                              >
                                <Ban className="w-3 h-3" />
                                <span>Cancel</span>
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => setSelectedOrderForTicket(order)}
                              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary text-xs transition cursor-pointer"
                              title="Print / View Ticket"
                            >
                              <FileText className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteOrder(order.id)}
                              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/10 text-xs transition cursor-pointer"
                              title="Delete Order Record"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* ========================================================
            TAB 2: VISITOR ANALYTICS & WEBSITE VIEWERS
           ======================================================== */}
        {activeTab === "analytics" && (
          <section className="space-y-8">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Page Views Breakdown */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-display font-semibold text-foreground flex items-center gap-2">
                    <Eye className="w-4 h-4 text-accent" /> Popular Pages Visited
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      Total {analytics.totalViews} hits
                    </span>
                    {analytics.totalViews > 0 && (
                      <button
                        type="button"
                        onClick={handleClearAnalyticsOnly}
                        className="inline-flex items-center gap-1 text-[11px] text-destructive hover:underline cursor-pointer"
                        title="Reset visitor counts to 0"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {Object.entries(analytics.pathCounts).map(([path, count]) => {
                    const percent = Math.round((count / (analytics.totalViews || 1)) * 100);
                    const pageNames: Record<string, string> = {
                      "/": "Home (Storefront)",
                      "/menu": "Artisan Menu & Online Ordering",
                      "/visit": "Visit & Cafe Hours",
                      "/about": "Our Story & West End Beans",
                    };
                    const label = pageNames[path] || path;

                    return (
                      <div key={path} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-foreground">{label}</span>
                          <span className="text-muted-foreground">
                            {count} views ({percent}%)
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                          <div
                            className="h-full rounded-full bg-accent transition-all duration-500"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Devices & Today Summary */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-5">
                <h3 className="text-base font-display font-semibold text-foreground flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-accent" /> Audience Insights
                </h3>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl border border-border/60 bg-secondary/30 p-3.5">
                    <Laptop className="w-5 h-5 mx-auto text-accent mb-1" />
                    <div className="text-lg font-bold font-display text-foreground">Desktop</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Laptops & PCs</div>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-secondary/30 p-3.5">
                    <Smartphone className="w-5 h-5 mx-auto text-accent mb-1" />
                    <div className="text-lg font-bold font-display text-foreground">Mobile</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">Smartphones</div>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-secondary/30 p-3.5">
                    <Tablet className="w-5 h-5 mx-auto text-accent mb-1" />
                    <div className="text-lg font-bold font-display text-foreground">Tablet</div>
                    <div className="text-[11px] text-muted-foreground mt-0.5">iPads & Tablets</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-secondary/40 p-4 space-y-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Privacy-Friendly Analytics
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Visitor counts are recorded locally in your cafe system without third-party tracking cookies or personal data harvesting.
                  </p>
                </div>
              </div>
            </div>

            {/* Real-time Visitor Activity Log */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-display font-semibold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-accent" /> Recent Activity Stream
                </h3>
                <span className="text-xs text-muted-foreground">
                  Last {analytics.recentLogs?.length || 0} visits
                </span>
              </div>

              {(!analytics.recentLogs || analytics.recentLogs.length === 0) ? (
                <p className="text-xs text-muted-foreground py-6 text-center">
                  Activity stream will populate as visitors browse the website.
                </p>
              ) : (
                <div className="divide-y divide-border/60 max-h-80 overflow-y-auto">
                  {analytics.recentLogs.map((log) => (
                    <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="p-1 rounded-md bg-secondary text-muted-foreground">
                          {log.device === "Mobile" ? (
                            <Smartphone className="w-3.5 h-3.5" />
                          ) : log.device === "Tablet" ? (
                            <Tablet className="w-3.5 h-3.5" />
                          ) : (
                            <Laptop className="w-3.5 h-3.5" />
                          )}
                        </span>
                        <div>
                          <span className="font-medium text-foreground">{log.path}</span>
                          <span className="text-[11px] text-muted-foreground ml-2">
                            ({log.pageTitle})
                          </span>
                        </div>
                      </div>
                      <span className="text-muted-foreground text-[11px] shrink-0">
                        {log.formattedTime}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* ========================================================
            TAB 3: SECURITY & PASSWORD SETTINGS
           ======================================================== */}
        {activeTab === "settings" && (
          <section className="max-w-xl mx-auto space-y-6">
            <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-sun" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-bold text-foreground">
                    Admin Security Credentials
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Update your master username and password for cafe access.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSaveCredentials} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    defaultValue={getAdminCredentials().username}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    New Strong Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    required
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    required
                    className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground font-mono focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-95 transition cursor-pointer"
                  >
                    <Check className="w-4 h-4 text-sun" />
                    <span>Save New Credentials</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Special Direct Magic Link */}
            <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6 space-y-3.5">
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-sun" />
                <span>Special 1-Click Direct Access Link</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Bookmark this special link in your browser to access the management portal directly without entering credentials:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={
                    typeof window !== "undefined"
                      ? `${window.location.origin}/admin?key=${SPECIAL_ACCESS_SECRET}`
                      : `http://localhost:8080/admin?key=${SPECIAL_ACCESS_SECRET}`
                  }
                  className="w-full rounded-xl border border-input bg-card px-3.5 py-2.5 text-xs font-mono text-foreground select-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    const url = typeof window !== "undefined"
                      ? `${window.location.origin}/admin?key=${SPECIAL_ACCESS_SECRET}`
                      : `http://localhost:8080/admin?key=${SPECIAL_ACCESS_SECRET}`;
                    navigator.clipboard.writeText(url);
                    toast.success("Special access link copied to clipboard!");
                  }}
                  className="shrink-0 inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-95 transition cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-sun" />
                  <span>Copy</span>
                </button>
              </div>
            </div>

            {/* Danger Zone: Clear Data */}
            <div className="rounded-3xl border border-destructive/30 bg-destructive/5 p-6 space-y-4">
              <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
                <Trash2 className="w-4 h-4" />
                <span>Reset & Clear Data</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                If you have finished testing and wish to clear orders or reset visitor analytics to 0, use the controls below:
              </p>
              <div className="flex flex-wrap gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleClearOrdersOnly}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/40 bg-card hover:bg-destructive/10 px-3.5 py-2 text-xs font-semibold text-destructive transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear Orders Only ({orders.length})</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearAnalyticsOnly}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-destructive/40 bg-card hover:bg-destructive/10 px-3.5 py-2 text-xs font-semibold text-destructive transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Visitor Counts ({analytics.totalViews})</span>
                </button>
                <button
                  type="button"
                  onClick={handleClearAllData}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-destructive text-destructive-foreground hover:opacity-90 px-4 py-2 text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Data</span>
                </button>
              </div>
            </div>

            {/* Current Access Summary */}
            <div className="rounded-2xl border border-border/60 bg-secondary/40 p-5 text-xs text-muted-foreground space-y-2">
              <span className="font-semibold text-foreground">💡 How to Access:</span>
              <p>
                Bookmark <code className="px-1.5 py-0.5 rounded bg-card border border-border text-foreground font-mono">/admin</code> in your browser for direct private access to this portal.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* ========================================================
          PRINT / TICKET MODAL FOR KITCHEN & ESPRESSO BAR
         ======================================================== */}
      {selectedOrderForTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl bg-card border border-border p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent">
                  Order Ticket
                </span>
                <h4 className="text-lg font-bold font-mono text-foreground">
                  {selectedOrderForTicket.id}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderForTicket(null)}
                className="text-muted-foreground hover:text-foreground p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-xs">
              <div className="flex items-center justify-between pb-1 mb-1 border-b border-border/50">
                <strong>Dining Option:</strong>
                <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-secondary text-foreground inline-flex items-center gap-1.5">
                  {selectedOrderForTicket.orderType === "dine-in" ? (
                    <>
                      <Utensils className="w-3 h-3 text-accent" />
                      <span>Dine In (Table)</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3 h-3 text-accent" />
                      <span>Take Away (To-Go)</span>
                    </>
                  )}
                </span>
              </div>
              <div><strong>Customer:</strong> {selectedOrderForTicket.customerName}</div>
              <div><strong>Phone:</strong> {selectedOrderForTicket.phone}</div>
              <div><strong>Pickup:</strong> {selectedOrderForTicket.pickupTime}</div>
              <div><strong>Ordered:</strong> {selectedOrderForTicket.formattedTime}</div>
              {selectedOrderForTicket.notes && (
                <div className="p-2 rounded bg-secondary text-foreground italic mt-2">
                  "{selectedOrderForTicket.notes}"
                </div>
              )}
            </div>

            {/* Cancelled Ticket Banner */}
            {selectedOrderForTicket.status === "cancelled" && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-2.5 text-center space-y-1">
                <div className="text-xs font-bold text-destructive uppercase tracking-wider">
                  *** CANCELLED ***
                </div>
                <div className="text-[11px] font-semibold text-destructive">
                  By: {selectedOrderForTicket.cancelledBy === "user" ? "Customer (2-min window)" : "Admin / Store Staff"}
                </div>
                {selectedOrderForTicket.cancelledTimeFormatted && (
                  <div className="text-[10px] text-muted-foreground">
                    Time: {selectedOrderForTicket.cancelledTimeFormatted}
                  </div>
                )}
                {selectedOrderForTicket.cancelReason && (
                  <div className="text-[10px] text-muted-foreground italic">
                    "{selectedOrderForTicket.cancelReason}"
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-b border-dashed border-border py-3 space-y-1.5 text-xs">
              {selectedOrderForTicket.items.map((i, idx) => (
                <div key={idx} className="flex justify-between">
                  <span>{i.quantity}x {i.menuItem.name} {i.selectedVariety ? `(${i.selectedVariety.name})` : ""}</span>
                  <span className="font-bold">${i.totalPrice.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-bold text-sm">
              <span>Total:</span>
              <span>${selectedOrderForTicket.total.toFixed(2)}</span>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 rounded-xl bg-primary py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 cursor-pointer"
              >
                Print Ticket
              </button>
              <button
                type="button"
                onClick={() => setSelectedOrderForTicket(null)}
                className="rounded-xl border border-border px-4 py-2 text-xs text-muted-foreground hover:bg-secondary cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          ADMIN CANCEL ORDER CONFIRMATION MODAL
         ======================================================== */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-3xl bg-card border border-border p-6 shadow-2xl text-left space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-destructive font-bold text-base font-display">
                <ShieldAlert className="w-5 h-5" />
                <span>Cancel Order #{cancellingOrderId}</span>
              </div>
              <button
                type="button"
                onClick={() => setCancellingOrderId(null)}
                className="text-muted-foreground hover:text-foreground text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-xs text-muted-foreground space-y-1 leading-relaxed">
              <p>
                You are cancelling this order as an administrator. This order will be marked as <strong>"Cancelled by Admin"</strong> on both the customer screen and admin dashboard.
              </p>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-semibold text-foreground">
                Cancellation Reason:
              </label>
              <input
                type="text"
                value={adminCancelReason}
                onChange={(e) => setAdminCancelReason(e.target.value)}
                placeholder="e.g. Out of stock / Store closing / Kitchen busy"
                className="w-full text-xs rounded-xl border border-input bg-background p-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  "Item out of stock",
                  "Customer called to cancel",
                  "Kitchen busy / Unforeseen delay",
                  "Ingredients unavailable",
                ].map((reason) => (
                  <button
                    key={reason}
                    type="button"
                    onClick={() => setAdminCancelReason(reason)}
                    className="text-[10px] bg-secondary hover:bg-secondary/80 text-foreground px-2 py-0.5 rounded-full border border-border cursor-pointer transition"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <button
                type="button"
                onClick={() => setCancellingOrderId(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-border text-foreground hover:bg-secondary cursor-pointer transition"
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={handleConfirmAdminCancel}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer shadow-xs transition"
              >
                Confirm Admin Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
