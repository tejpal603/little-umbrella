import React, { createContext, useContext, useEffect, useState } from "react";
import type { MenuItem, MenuItemSize, MenuVariety, CustomizationOption } from "./menu-data";
import {
  saveAdminOrder,
  cancelOrder,
  getAdminOrders,
  type OrderStatus,
  type CancelledBy,
  type OrderType,
} from "./admin-store";

export type CartItem = {
  id: string;
  menuItem: MenuItem;
  selectedVariety?: MenuVariety | undefined;
  selectedSize?: MenuItemSize | undefined;
  selectedAddOns: CustomizationOption[];
  temperature?: ("hot" | "iced") | undefined;
  instructions?: string | undefined;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type OrderConfirmation = {
  orderId: string;
  customerName: string;
  phone: string;
  pickupTime: string;
  orderType: OrderType;
  notes?: string | undefined;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
  createdAtIso: string;
  status: OrderStatus;
  cancelledBy?: CancelledBy | undefined;
  cancelledAt?: string | undefined;
  cancelledTimeFormatted?: string | undefined;
  cancelReason?: string | undefined;
};

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  addToCart: (item: Omit<CartItem, "id" | "totalPrice">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  activeOrderingItem: MenuItem | null;
  setActiveOrderingItem: (item: MenuItem | null) => void;
  orderConfirmation: OrderConfirmation | null;
  setOrderConfirmation: (conf: OrderConfirmation | null) => void;
  placeOrder: (details: {
    customerName: string;
    phone: string;
    pickupTime: string;
    orderType?: OrderType;
    notes?: string;
  }) => OrderConfirmation;
  cancelCurrentOrder: (reason?: string) => { success: boolean; message: string };
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "little_umbrella_cart_v1";
const LATEST_ORDER_KEY = "little_umbrella_latest_order_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeOrderingItem, setActiveOrderingItem] = useState<MenuItem | null>(null);
  const [orderConfirmation, setOrderConfirmation] = useState<OrderConfirmation | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Safe SSR hydration
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
      const storedOrder = localStorage.getItem(LATEST_ORDER_KEY);
      if (storedOrder) {
        const parsed = JSON.parse(storedOrder) as OrderConfirmation;
        // Verify with latest admin store
        const allOrders = getAdminOrders();
        const current = allOrders.find((o) => o.id === parsed.orderId);
        if (current) {
          setOrderConfirmation({
            ...parsed,
            status: current.status,
            cancelledBy: current.cancelledBy,
            cancelledAt: current.cancelledAt,
            cancelledTimeFormatted: current.cancelledTimeFormatted,
            cancelReason: current.cancelReason,
          });
        } else {
          setOrderConfirmation(parsed);
        }
      }
    } catch (e) {
      console.warn("Could not load cart from storage:", e);
    }
    setHydrated(true);
  }, []);

  // Listen for admin changes to live-sync current order
  useEffect(() => {
    const handleSync = () => {
      if (!orderConfirmation?.orderId) return;
      const allOrders = getAdminOrders();
      const current = allOrders.find((o) => o.id === orderConfirmation.orderId);
      if (current && (
        current.status !== orderConfirmation.status ||
        current.cancelledBy !== orderConfirmation.cancelledBy
      )) {
        setOrderConfirmation((prev) => {
          if (!prev) return null;
          const updated: OrderConfirmation = {
            ...prev,
            status: current.status,
            cancelledBy: current.cancelledBy,
            cancelledAt: current.cancelledAt,
            cancelledTimeFormatted: current.cancelledTimeFormatted,
            cancelReason: current.cancelReason,
          };
          try {
            localStorage.setItem(LATEST_ORDER_KEY, JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }
    };

    window.addEventListener("umbrella_orders_updated", handleSync);
    window.addEventListener("storage", handleSync);
    return () => {
      window.removeEventListener("umbrella_orders_updated", handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [orderConfirmation]);

  // Save changes
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.warn("Could not save cart to storage:", e);
    }
  }, [items, hydrated]);

  const addToCart = (newItem: Omit<CartItem, "id" | "totalPrice">) => {
    const id = `item_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const lineTotal = +(newItem.unitPrice * newItem.quantity).toFixed(2);
    const itemWithId: CartItem = {
      ...newItem,
      id,
      totalPrice: lineTotal,
    };

    setItems((prev) => [...prev, itemWithId]);
  };

  const removeFromCart = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.quantity + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              quantity: nextQty,
              totalPrice: +(item.unitPrice * nextQty).toFixed(2),
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = +items.reduce((sum, item) => sum + item.totalPrice, 0).toFixed(2);
  const tax = +(subtotal * 0.05).toFixed(2); // 5% GST in Vancouver BC
  const total = +(subtotal + tax).toFixed(2);

  const placeOrder = ({
    customerName,
    phone,
    pickupTime,
    orderType,
    notes,
  }: {
    customerName: string;
    phone: string;
    pickupTime: string;
    orderType?: OrderType;
    notes?: string;
  }): OrderConfirmation => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `LU-${randomNum}`;
    const now = new Date();
    const createdIso = now.toISOString();
    const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const confirmation: OrderConfirmation = {
      orderId,
      customerName,
      phone,
      pickupTime,
      orderType: orderType || "takeaway",
      notes,
      items: [...items],
      subtotal,
      tax,
      total,
      createdAt: formattedTime,
      createdAtIso: createdIso,
      status: "received",
    };

    setOrderConfirmation(confirmation);
    try {
      localStorage.setItem(LATEST_ORDER_KEY, JSON.stringify(confirmation));
      saveAdminOrder({
        orderId,
        customerName,
        phone,
        pickupTime,
        orderType: orderType || "takeaway",
        notes,
        items: [...items],
        subtotal,
        tax,
        total,
      });
    } catch (e) {
      console.warn("Failed to save order to admin store:", e);
    }
    clearCart();
    return confirmation;
  };

  const cancelCurrentOrder = (reason?: string): { success: boolean; message: string } => {
    if (!orderConfirmation) {
      return { success: false, message: "No active order to cancel." };
    }
    const result = cancelOrder(orderConfirmation.orderId, "user", reason);
    if (result.success && result.order) {
      const updatedConf: OrderConfirmation = {
        ...orderConfirmation,
        status: "cancelled",
        cancelledBy: "user",
        cancelledAt: result.order.cancelledAt,
        cancelledTimeFormatted: result.order.cancelledTimeFormatted,
        cancelReason: result.order.cancelReason,
      };
      setOrderConfirmation(updatedConf);
      try {
        localStorage.setItem(LATEST_ORDER_KEY, JSON.stringify(updatedConf));
      } catch (e) {
        console.warn("Failed to store updated order:", e);
      }
    }
    return result;
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        tax,
        total,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        activeOrderingItem,
        setActiveOrderingItem,
        orderConfirmation,
        setOrderConfirmation: (conf) => {
          setOrderConfirmation(conf);
          try {
            if (conf) {
              localStorage.setItem(LATEST_ORDER_KEY, JSON.stringify(conf));
            } else {
              localStorage.removeItem(LATEST_ORDER_KEY);
            }
          } catch {}
        },
        placeOrder,
        cancelCurrentOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
