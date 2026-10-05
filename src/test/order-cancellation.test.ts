import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  saveAdminOrder,
  cancelOrder,
  getAdminOrders,
  clearAdminOrders,
  updateOrderStatus,
} from "../lib/admin-store";

describe("Order Cancellation & 2-Minute Grace Period", () => {
  beforeEach(() => {
    localStorage.clear();
    clearAdminOrders();
    vi.restoreAllMocks();
  });

  it("allows user to cancel within 2 minutes of placing order", () => {
    const order = saveAdminOrder({
      orderId: "LU-1001",
      customerName: "Amanpreet Kaur",
      phone: "604-555-0111",
      pickupTime: "In 15 mins",
      items: [],
      subtotal: 10,
      tax: 0.5,
      total: 10.5,
    });

    expect(order.status).toBe("received");

    // Cancel 30 seconds after placing
    const result = cancelOrder("LU-1001", "user", "Customer changed mind");

    expect(result.success).toBe(true);
    expect(result.order?.status).toBe("cancelled");
    expect(result.order?.cancelledBy).toBe("user");
    expect(result.order?.cancelReason).toBe("Customer changed mind");
    expect(result.order?.cancelledTimeFormatted).toBeDefined();

    const storedOrders = getAdminOrders();
    const target = storedOrders.find((o) => o.id === "LU-1001");
    expect(target?.status).toBe("cancelled");
    expect(target?.cancelledBy).toBe("user");
  });

  it("blocks user from cancelling after 2 minutes", () => {
    const order = saveAdminOrder({
      orderId: "LU-1002",
      customerName: "Rajinder Singh",
      phone: "604-555-0222",
      pickupTime: "In 15 mins",
      items: [],
      subtotal: 15,
      tax: 0.75,
      total: 15.75,
    });

    // Mock time moving forward by 2 minutes and 30 seconds (150s)
    const now = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(now + 150 * 1000);

    const result = cancelOrder("LU-1002", "user");

    expect(result.success).toBe(false);
    expect(result.message).toContain("2-minute");
    expect(result.order?.status).toBe("received"); // Still active!
  });

  it("allows admin to cancel at any time with admin attribution", () => {
    saveAdminOrder({
      orderId: "LU-1003",
      customerName: "Harman Singh",
      phone: "604-555-0333",
      pickupTime: "In 30 mins",
      items: [],
      subtotal: 20,
      tax: 1.0,
      total: 21.0,
    });

    // 10 minutes elapsed
    const now = Date.now();
    vi.spyOn(Date, "now").mockReturnValue(now + 600 * 1000);

    const result = cancelOrder("LU-1003", "admin", "Item out of stock");

    expect(result.success).toBe(true);
    expect(result.order?.status).toBe("cancelled");
    expect(result.order?.cancelledBy).toBe("admin");
    expect(result.order?.cancelReason).toBe("Item out of stock");
  });

  it("updates order status to cancelled with admin attribution via updateOrderStatus", () => {
    saveAdminOrder({
      orderId: "LU-1004",
      customerName: "Simran Kaur",
      phone: "604-555-0444",
      pickupTime: "In 20 mins",
      items: [],
      subtotal: 12,
      tax: 0.6,
      total: 12.6,
    });

    updateOrderStatus("LU-1004", "cancelled", {
      cancelledBy: "admin",
      cancelReason: "Cafe kitchen emergency",
    });

    const orders = getAdminOrders();
    const target = orders.find((o) => o.id === "LU-1004");
    expect(target?.status).toBe("cancelled");
    expect(target?.cancelledBy).toBe("admin");
    expect(target?.cancelReason).toBe("Cafe kitchen emergency");
  });

  it("correctly saves and persists orderType as dine-in and takeaway", () => {
    const dineInOrder = saveAdminOrder({
      orderId: "LU-2001",
      customerName: "Aarav Patel",
      phone: "604-555-9876",
      pickupTime: "In 10 mins",
      orderType: "dine-in",
      items: [],
      subtotal: 8.5,
      tax: 0.43,
      total: 8.93,
    });

    const takeawayOrder = saveAdminOrder({
      orderId: "LU-2002",
      customerName: "Kavita Rao",
      phone: "604-555-5432",
      pickupTime: "In 20 mins",
      orderType: "takeaway",
      items: [],
      subtotal: 12.0,
      tax: 0.6,
      total: 12.6,
    });

    const defaultOrder = saveAdminOrder({
      orderId: "LU-2003",
      customerName: "Pooja Sharma",
      phone: "604-555-1122",
      pickupTime: "In 15 mins",
      items: [],
      subtotal: 5.0,
      tax: 0.25,
      total: 5.25,
    });

    expect(dineInOrder.orderType).toBe("dine-in");
    expect(takeawayOrder.orderType).toBe("takeaway");
    expect(defaultOrder.orderType).toBe("takeaway"); // Defaults to takeaway

    const storedOrders = getAdminOrders();
    expect(storedOrders.find((o) => o.id === "LU-2001")?.orderType).toBe("dine-in");
    expect(storedOrders.find((o) => o.id === "LU-2002")?.orderType).toBe("takeaway");
    expect(storedOrders.find((o) => o.id === "LU-2003")?.orderType).toBe("takeaway");
  });
});
