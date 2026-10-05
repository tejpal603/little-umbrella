import type { CartItem } from "./cart-context";

// ==========================================
// 1. CREDENTIALS & AUTH
// ==========================================
export const DEFAULT_ADMIN_USERNAME = "admin_umbrella";
export const DEFAULT_ADMIN_PASSWORD = "Umbrella#Secure@2026!";
export const SPECIAL_ACCESS_SECRET = "umbrella_master_key_2026";

const AUTH_TOKEN_KEY = "little_umbrella_admin_token_v1";
const CUSTOM_CREDENTIALS_KEY = "little_umbrella_admin_creds_v1";

export function getAdminCredentials() {
  if (typeof window === "undefined") {
    return { username: DEFAULT_ADMIN_USERNAME, password: DEFAULT_ADMIN_PASSWORD };
  }
  try {
    const stored = localStorage.getItem(CUSTOM_CREDENTIALS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn("Could not read custom admin credentials:", e);
  }
  return { username: DEFAULT_ADMIN_USERNAME, password: DEFAULT_ADMIN_PASSWORD };
}

export function updateAdminCredentials(newUsername: string, newPassword: string):boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(CUSTOM_CREDENTIALS_KEY, JSON.stringify({
      username: newUsername.trim(),
      password: newPassword,
    }));
    return true;
  } catch (e) {
    console.warn("Failed to update admin credentials:", e);
    return false;
  }
}

export function verifyAdminLogin(username: string, password: string): boolean {
  const current = getAdminCredentials();
  if (username.trim() === current.username && password === current.password) {
    if (typeof window !== "undefined") {
      const token = `auth_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
    return true;
  }
  return false;
}

export function loginWithSpecialKey(key: string): boolean {
  if (key && key.trim() === SPECIAL_ACCESS_SECRET) {
    if (typeof window !== "undefined") {
      const token = `auth_special_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    }
    return true;
  }
  return false;
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return !!(sessionStorage.getItem(AUTH_TOKEN_KEY) || localStorage.getItem(AUTH_TOKEN_KEY));
  } catch {
    return false;
  }
}

export function adminLogout(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_TOKEN_KEY);
  } catch (e) {
    console.warn("Error during admin logout:", e);
  }
}

// ==========================================
// 2. ONLINE ORDERS STORE
// ==========================================
export type OrderStatus = "received" | "preparing" | "ready" | "completed" | "cancelled";

export type CancelledBy = "user" | "admin";
export type OrderType = "dine-in" | "takeaway";

export type AdminOrder = {
  id: string; // e.g. LU-4821
  customerName: string;
  phone: string;
  pickupTime: string;
  orderType?: OrderType | undefined;
  notes?: string | undefined;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO
  formattedTime: string; // e.g. 10:30 AM
  dateString: string; // YYYY-MM-DD
  cancelledBy?: CancelledBy | undefined;
  cancelledAt?: string | undefined;
  cancelledTimeFormatted?: string | undefined;
  cancelReason?: string | undefined;
};

const ORDERS_KEY = "little_umbrella_orders_v1";

export function getAdminOrders(): AdminOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Could not read orders:", e);
  }
  return [];
}

export function saveAdminOrder(newOrderData: {
  orderId: string;
  customerName: string;
  phone: string;
  pickupTime: string;
  orderType?: OrderType | undefined;
  notes?: string | undefined;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}): AdminOrder {
  const now = new Date();
  const newOrder: AdminOrder = {
    id: newOrderData.orderId,
    customerName: newOrderData.customerName,
    phone: newOrderData.phone,
    pickupTime: newOrderData.pickupTime,
    orderType: newOrderData.orderType || "takeaway",
    notes: newOrderData.notes,
    items: newOrderData.items,
    subtotal: newOrderData.subtotal,
    tax: newOrderData.tax,
    total: newOrderData.total,
    status: "received",
    createdAt: now.toISOString(),
    formattedTime: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    dateString: now.toISOString().split("T")[0] || "",
  };

  if (typeof window !== "undefined") {
    try {
      const existing = getAdminOrders();
      const updated = [newOrder, ...existing];
      localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
      // Dispatch storage event so live admin dashboard refreshes immediately
      window.dispatchEvent(new Event("umbrella_orders_updated"));
    } catch (e) {
      console.warn("Failed to persist order:", e);
    }
  }

  return newOrder;
}

export function cancelOrder(
  orderId: string,
  cancelledBy: CancelledBy,
  reason?: string
): { success: boolean; message: string; order?: AdminOrder } {
  if (typeof window === "undefined") {
    return { success: false, message: "Browser environment required." };
  }
  try {
    const existing = getAdminOrders();
    const index = existing.findIndex((o) => o.id === orderId);
    if (index === -1) {
      return { success: false, message: "Order not found." };
    }

    const order = existing[index];

    if (order.status === "cancelled") {
      return { success: false, message: "Order is already cancelled.", order };
    }

    if (order.status === "completed") {
      return { success: false, message: "Completed orders cannot be cancelled.", order };
    }

    // Strict 2-minute rule for customer/user
    if (cancelledBy === "user") {
      const createdMs = new Date(order.createdAt).getTime();
      const elapsedSec = (Date.now() - createdMs) / 1000;
      // 120 seconds = 2 minutes (allow 5 seconds buffer for execution/clock latency)
      if (elapsedSec > 125) {
        return {
          success: false,
          message: "2-minute cancellation window has passed. Order cannot be cancelled online.",
          order,
        };
      }
    }

    const now = new Date();
    const updatedOrder: AdminOrder = {
      ...order,
      status: "cancelled",
      cancelledBy,
      cancelledAt: now.toISOString(),
      cancelledTimeFormatted: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      cancelReason:
        reason ||
        (cancelledBy === "user"
          ? "Cancelled by customer within 2-minute window"
          : "Cancelled by cafe management"),
    };

    existing[index] = updatedOrder;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(existing));
    window.dispatchEvent(new Event("umbrella_orders_updated"));

    return {
      success: true,
      message:
        cancelledBy === "user"
          ? "Your order has been cancelled successfully."
          : "Order cancelled by administrator.",
      order: updatedOrder,
    };
  } catch (e) {
    console.warn("Failed to cancel order:", e);
    return { success: false, message: "An error occurred while cancelling the order." };
  }
}

export function updateOrderStatus(
  orderId: string,
  nextStatus: OrderStatus,
  options?: { cancelledBy?: CancelledBy; cancelReason?: string }
): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getAdminOrders();
    const now = new Date();
    const updated = existing.map((ord) => {
      if (ord.id !== orderId) return ord;
      if (nextStatus === "cancelled") {
        const cancelledBy = options?.cancelledBy || "admin";
        return {
          ...ord,
          status: "cancelled" as OrderStatus,
          cancelledBy,
          cancelledAt: now.toISOString(),
          cancelledTimeFormatted: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          cancelReason:
            options?.cancelReason ||
            (cancelledBy === "admin" ? "Cancelled by Cafe Management" : "Cancelled by Customer"),
        };
      }
      return { ...ord, status: nextStatus };
    });
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("umbrella_orders_updated"));
  } catch (e) {
    console.warn("Failed to update order status:", e);
  }
}

export function deleteAdminOrder(orderId: string): void {
  if (typeof window === "undefined") return;
  try {
    const existing = getAdminOrders();
    const updated = existing.filter((ord) => ord.id !== orderId);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("umbrella_orders_updated"));
  } catch (e) {
    console.warn("Failed to delete order:", e);
  }
}

export function seedSampleOrders(): void {
  if (typeof window === "undefined") return;
  const sampleOrders: AdminOrder[] = [
    {
      id: "LU-7281",
      customerName: "Sarah Jenkins",
      phone: "+1 604-555-0192",
      pickupTime: "In 15 minutes",
      orderType: "takeaway",
      notes: "Extra hot please, no lid",
      items: [
        {
          id: "item_s1",
          menuItem: {
            id: "latte",
            name: "Caffè Latte",
            category: "coffee",
            categoryLabel: "Espresso & Coffee",
            description: "Rich espresso poured over velvety steamed milk",
            basePrice: 4.25,
            image: "/images/menu/latte.jpg",
          },
          selectedSize: { name: "L", label: "Large", price: 4.75 },
          selectedAddOns: [
            { id: "syrup-vanilla", name: "Vanilla Syrup", price: 0.75, category: "syrup" },
          ],
          temperature: "hot",
          quantity: 1,
          unitPrice: 5.50,
          totalPrice: 5.50,
        },
        {
          id: "item_s2",
          menuItem: {
            id: "croissant",
            name: "Artisan French Croissant",
            category: "bakery",
            categoryLabel: "Bakery & Morning Bakes",
            description: "Golden flaky pastry",
            basePrice: 4.25,
            image: "/images/menu/butter-croissant.jpg",
          },
          selectedVariety: {
            id: "almond",
            name: "Twice-Baked Almond Croissant",
            priceDelta: 0.75,
            image: "/images/menu/almond-croissant.jpg",
          },
          selectedAddOns: [],
          quantity: 1,
          unitPrice: 5.00,
          totalPrice: 5.00,
        },
      ],
      subtotal: 10.50,
      tax: 0.53,
      total: 11.03,
      status: "received",
      createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
      formattedTime: "10:18 AM",
      dateString: new Date().toISOString().split("T")[0] || "",
    },
    {
      id: "LU-3942",
      customerName: "David Miller",
      phone: "+1 778-555-9481",
      pickupTime: "In 25 minutes",
      orderType: "dine-in",
      notes: "Cut wrap in halves",
      items: [
        {
          id: "item_s3",
          menuItem: {
            id: "avocado-breakfast-wrap",
            name: "Avocado Breakfast Wrap",
            category: "breakfast",
            categoryLabel: "Breakfast & Morning",
            description: "Pressed wrap with egg frittata, avocado and swiss cheese",
            basePrice: 10.00,
            image: "/images/menu/avocado-breakfast-wrap.jpg",
          },
          selectedAddOns: [
            { id: "add-avocado", name: "Add Fresh Smashed Avocado", price: 1.50, category: "addon" },
          ],
          quantity: 1,
          unitPrice: 11.50,
          totalPrice: 11.50,
        },
        {
          id: "item_s4",
          menuItem: {
            id: "smoothie",
            name: "Fresh Blended Smoothie",
            category: "cold",
            categoryLabel: "Cold Brew & Chilled",
            description: "100% whole fruits",
            basePrice: 7.50,
            image: "/images/menu/berry-blast.jpg",
          },
          selectedVariety: {
            id: "berry-blast",
            name: "Berry Blast",
            image: "/images/menu/berry-blast.jpg",
          },
          selectedAddOns: [],
          quantity: 1,
          unitPrice: 7.50,
          totalPrice: 7.50,
        },
      ],
      subtotal: 19.00,
      tax: 0.95,
      total: 19.95,
      status: "preparing",
      createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      formattedTime: "09:55 AM",
      dateString: new Date().toISOString().split("T")[0] || "",
    },
    {
      id: "LU-5190",
      customerName: "Gurpreet Singh",
      phone: "+1 604-555-0814",
      pickupTime: "In 10-15 mins (ASAP)",
      orderType: "takeaway",
      notes: "Oat milk latte",
      items: [
        {
          id: "item_s5",
          menuItem: {
            id: "latte",
            name: "Caffè Latte",
            category: "coffee",
            categoryLabel: "Espresso & Coffee",
            description: "Rich espresso with velvety milk",
            basePrice: 4.25,
            image: "/images/menu/latte.jpg",
          },
          selectedSize: { name: "R", label: "Regular", price: 4.25 },
          selectedAddOns: [
            { id: "milk-oat", name: "Oat Milk", price: 0.85, category: "milk" },
          ],
          temperature: "hot",
          quantity: 1,
          unitPrice: 5.10,
          totalPrice: 5.10,
        },
      ],
      subtotal: 5.10,
      tax: 0.26,
      total: 5.36,
      status: "cancelled",
      cancelledBy: "user",
      createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      formattedTime: "09:40 AM",
      cancelledAt: new Date(Date.now() - 44 * 60 * 1000).toISOString(),
      cancelledTimeFormatted: "09:41 AM",
      cancelReason: "Cancelled by customer within 2-minute window (changed mind)",
      dateString: new Date().toISOString().split("T")[0] || "",
    },
    {
      id: "LU-8832",
      customerName: "Liam O'Connor",
      phone: "+1 778-555-3211",
      pickupTime: "In 45 mins",
      orderType: "dine-in",
      notes: "Please call when ready",
      items: [
        {
          id: "item_s6",
          menuItem: {
            id: "croissant",
            name: "Artisan French Croissant",
            category: "bakery",
            categoryLabel: "Bakery & Morning Bakes",
            description: "Golden flaky pastry",
            basePrice: 4.25,
            image: "/images/menu/butter-croissant.jpg",
          },
          selectedVariety: {
            id: "almond",
            name: "Twice-Baked Almond Croissant",
            priceDelta: 0.75,
            image: "/images/menu/almond-croissant.jpg",
          },
          selectedAddOns: [],
          quantity: 2,
          unitPrice: 5.00,
          totalPrice: 10.00,
        },
      ],
      subtotal: 10.00,
      tax: 0.50,
      total: 10.50,
      status: "cancelled",
      cancelledBy: "admin",
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      formattedTime: "09:20 AM",
      cancelledAt: new Date(Date.now() - 50 * 60 * 1000).toISOString(),
      cancelledTimeFormatted: "09:30 AM",
      cancelReason: "Out of almond croissants (Cancelled by Store Management)",
      dateString: new Date().toISOString().split("T")[0] || "",
    },
  ];

  localStorage.setItem(ORDERS_KEY, JSON.stringify(sampleOrders));
  window.dispatchEvent(new Event("umbrella_orders_updated"));
}

// ==========================================
// 3. VISITOR ANALYTICS STORE
// ==========================================
export type VisitorLogEntry = {
  id: string;
  path: string;
  pageTitle: string;
  timestamp: string;
  formattedTime: string;
  device: "Mobile" | "Desktop" | "Tablet";
};

export type AnalyticsData = {
  totalViews: number;
  uniqueVisitorIds: string[];
  todayViewsCount: number;
  todayDate: string;
  pathCounts: Record<string, number>;
  recentLogs: VisitorLogEntry[];
};

const ANALYTICS_KEY = "little_umbrella_analytics_v1";
const VISITOR_ID_KEY = "little_umbrella_visitor_uuid";

export function getVisitorAnalytics(): AnalyticsData {
  const todayStr = new Date().toISOString().split("T")[0] || "";
  const defaultData: AnalyticsData = {
    totalViews: 0,
    uniqueVisitorIds: [],
    todayViewsCount: 0,
    todayDate: todayStr,
    pathCounts: {},
    recentLogs: [],
  };

  if (typeof window === "undefined") return defaultData;

  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    if (raw) {
      const parsed: AnalyticsData = JSON.parse(raw);
      // Reset today count if new day
      if (parsed.todayDate !== todayStr) {
        parsed.todayDate = todayStr;
        parsed.todayViewsCount = 0;
      }
      return parsed;
    }
  } catch (e) {
    console.warn("Could not read analytics data:", e);
  }

  return defaultData;
}

export function clearAdminOrders(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ORDERS_KEY);
    localStorage.setItem(ORDERS_KEY, JSON.stringify([]));
    window.dispatchEvent(new Event("umbrella_orders_updated"));
  } catch (e) {
    console.warn("Failed to clear orders:", e);
  }
}

export function clearVisitorAnalytics(): void {
  if (typeof window === "undefined") return;
  try {
    const todayStr = new Date().toISOString().split("T")[0] || "";
    const cleanAnalytics: AnalyticsData = {
      totalViews: 0,
      uniqueVisitorIds: [],
      todayViewsCount: 0,
      todayDate: todayStr,
      pathCounts: {},
      recentLogs: [],
    };
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(cleanAnalytics));
    window.dispatchEvent(new Event("umbrella_analytics_updated"));
  } catch (e) {
    console.warn("Failed to clear analytics:", e);
  }
}

export function clearAllAdminData(): void {
  clearAdminOrders();
  clearVisitorAnalytics();
}

export function trackPageView(path: string, pageTitle: string): void {
  if (typeof window === "undefined") return;

  // Don't track admin page views in public visitor count
  if (path.startsWith("/admin")) return;

  try {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
      visitorId = `vis_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
    }

    const current = getVisitorAnalytics();
    const todayStr = new Date().toISOString().split("T")[0] || "";

    // Device detection
    const userAgent = navigator.userAgent;
    let device: "Mobile" | "Desktop" | "Tablet" = "Desktop";
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
      device = "Tablet";
    } else if (
      /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
        userAgent
      )
    ) {
      device = "Mobile";
    }

    const now = new Date();
    const logEntry: VisitorLogEntry = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      path,
      pageTitle,
      timestamp: now.toISOString(),
      formattedTime: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      device,
    };

    const uniqueSet = new Set(current.uniqueVisitorIds);
    uniqueSet.add(visitorId);

    const nextPathCounts = { ...current.pathCounts };
    nextPathCounts[path] = (nextPathCounts[path] || 0) + 1;

    const nextAnalytics: AnalyticsData = {
      totalViews: current.totalViews + 1,
      uniqueVisitorIds: Array.from(uniqueSet),
      todayViewsCount: (current.todayDate === todayStr ? current.todayViewsCount : 0) + 1,
      todayDate: todayStr,
      pathCounts: nextPathCounts,
      recentLogs: [logEntry, ...(current.recentLogs || [])].slice(0, 50),
    };

    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(nextAnalytics));
    window.dispatchEvent(new Event("umbrella_analytics_updated"));
  } catch (e) {
    console.warn("Analytics tracking error:", e);
  }
}
