import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useCart } from "@/lib/cart-context";
import { SITE } from "@/lib/site";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Phone,
  Sparkles,
  XCircle,
  AlertTriangle,
  Lock,
  Timer,
  Ban,
  ShieldAlert,
  User,
  Utensils,
} from "lucide-react";
import { toast } from "sonner";
import type { OrderType } from "@/lib/admin-store";

export function OrderDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    tax,
    total,
    removeFromCart,
    updateQuantity,
    isCartOpen,
    setIsCartOpen,
    orderConfirmation,
    setOrderConfirmation,
    placeOrder,
    cancelCurrentOrder,
  } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState<OrderType>("takeaway");
  const [pickupTime, setPickupTime] = useState("In 15 mins (ASAP)");
  const [orderNotes, setOrderNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cancellation state
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(0);
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  // Calculate live countdown timer for 2 minutes (120 seconds)
  useEffect(() => {
    if (!orderConfirmation || orderConfirmation.status === "cancelled") {
      setTimeLeftSeconds(0);
      return;
    }

    const calculateRemaining = () => {
      const createdMs = orderConfirmation.createdAtIso
        ? new Date(orderConfirmation.createdAtIso).getTime()
        : Date.now();
      const elapsed = Math.floor((Date.now() - createdMs) / 1000);
      const remaining = Math.max(0, 120 - elapsed);
      setTimeLeftSeconds(remaining);
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [orderConfirmation]);

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      toast.error("Please enter your name for the order pickup");
      return;
    }
    if (!phone.trim()) {
      toast.error("Please enter a phone number for order updates");
      return;
    }

    setIsSubmitting(true);
    try {
      placeOrder({
        customerName: customerName.trim(),
        phone: phone.trim(),
        pickupTime,
        orderType,
        notes: orderNotes.trim(),
      });
      setIsConfirmingCancel(false);
      toast.success("Order placed successfully! We're crafting your drinks.");
    } catch (err) {
      console.error("Order submission error:", err);
      toast.error("Could not place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetOrder = () => {
    setOrderConfirmation(null);
    setCustomerName("");
    setPhone("");
    setOrderType("takeaway");
    setOrderNotes("");
    setIsConfirmingCancel(false);
    setIsCartOpen(false);
  };

  const handleExecuteCancel = () => {
    if (timeLeftSeconds <= 0) {
      toast.error("2-minute cancellation window has passed. You cannot cancel this order online.");
      setIsConfirmingCancel(false);
      return;
    }

    setIsCancelling(true);
    const reasonText = cancelReason.trim() || "Customer requested cancellation within 2-min window";
    const result = cancelCurrentOrder(reasonText);
    setIsCancelling(false);
    setIsConfirmingCancel(false);

    if (result.success) {
      toast.success("Order cancelled successfully.");
    } else {
      toast.error(result.message);
    }
  };

  const isOrderCancelled = orderConfirmation?.status === "cancelled";

  // Formatted countdown timer string mm:ss
  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col h-full bg-background border-l border-border shadow-2xl">
        {/* Header */}
        <div
          className={`px-6 py-5 text-primary-foreground border-b border-primary-foreground/10 transition-colors ${
            isOrderCancelled ? "bg-destructive text-destructive-foreground" : "bg-primary"
          }`}
        >
          <SheetHeader className="text-left space-y-1">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl sm:text-2xl font-display text-white flex items-center gap-2">
                {isOrderCancelled ? (
                  <>
                    <Ban className="w-5 h-5 text-white" />
                    Order Cancelled
                  </>
                ) : orderConfirmation ? (
                  <>
                    <ShoppingBag className="w-5 h-5 text-sun" />
                    Order Confirmed!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 text-sun" />
                    Your Order
                  </>
                )}
              </SheetTitle>
              {!orderConfirmation && (
                <span className="text-xs bg-sun/20 text-sun border border-sun/30 px-2.5 py-1 rounded-full font-medium">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </span>
              )}
              {isOrderCancelled && (
                <span className="text-xs bg-white/20 text-white border border-white/30 px-2.5 py-1 rounded-full font-semibold">
                  {orderConfirmation.cancelledBy === "user" ? "Cancelled by You" : "Cancelled by Admin"}
                </span>
              )}
            </div>
            <SheetDescription className="text-primary-foreground/80 text-xs">
              {isOrderCancelled
                ? "This order has been cancelled and will not be prepared."
                : orderConfirmation
                ? "Show this confirmation at the pickup counter on West 10th."
                : "Handcrafted fresh for pickup at Little Umbrella Cafe, Vancouver."}
            </SheetDescription>
          </SheetHeader>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {orderConfirmation ? (
            /* Order Confirmation / Tracking View */
            <div className="space-y-6 text-center py-2">
              {/* Icon Indicator */}
              {isOrderCancelled ? (
                <div className="w-16 h-16 rounded-full bg-destructive/15 text-destructive flex items-center justify-center mx-auto border-2 border-destructive/30 animate-in fade-in">
                  <XCircle className="w-10 h-10" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center mx-auto border border-green-500/20">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
              )}

              <div>
                <span className="inline-block px-3 py-1 bg-secondary text-foreground font-mono text-xs font-bold rounded-full mb-2 border border-border">
                  Order ID: {orderConfirmation.orderId}
                </span>
                <h3 className="text-2xl font-display font-bold text-foreground">
                  {isOrderCancelled ? "Order Cancelled" : `Thank You, ${orderConfirmation.customerName}!`}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {isOrderCancelled
                    ? "This order has been officially cancelled."
                    : "We have received your order and our baristas are preparing it now."}
                </p>
              </div>

              {/* ========================================================
                  CANCELLATION STATUS BANNER (WHO CANCELLED & TIME)
                 ======================================================== */}
              {isOrderCancelled && (
                <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-left space-y-2.5 animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-destructive">
                    {orderConfirmation.cancelledBy === "user" ? (
                      <>
                        <User className="w-4 h-4" />
                        <span>Order Cancelled by Customer (You)</span>
                      </>
                    ) : (
                      <>
                        <ShieldAlert className="w-4 h-4" />
                        <span>Order Cancelled by Cafe Management (Admin)</span>
                      </>
                    )}
                  </div>

                  <div className="text-xs text-foreground/80 space-y-1">
                    <p className="font-medium">
                      {orderConfirmation.cancelledBy === "user" ? (
                        <>You cancelled this order within the 2-minute cancellation window.</>
                      ) : (
                        <>This order was cancelled by cafe management.</>
                      )}
                    </p>
                    {orderConfirmation.cancelledTimeFormatted && (
                      <p className="text-muted-foreground">
                        Time: <strong>{orderConfirmation.cancelledTimeFormatted}</strong>
                      </p>
                    )}
                    {orderConfirmation.cancelReason && (
                      <p className="text-muted-foreground italic bg-background/60 p-2 rounded-lg border border-border/50">
                        Reason: "{orderConfirmation.cancelReason}"
                      </p>
                    )}
                  </div>

                  {orderConfirmation.cancelledBy === "admin" && (
                    <div className="pt-2 border-t border-destructive/20 text-xs text-muted-foreground flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-accent" />
                      <span>Questions? Contact us directly: <strong>{SITE.phone}</strong></span>
                    </div>
                  )}
                </div>
              )}

              {/* ========================================================
                  2-MINUTE CANCELLATION BOX (WHILE ORDER IS ACTIVE)
                 ======================================================== */}
              {!isOrderCancelled && (
                <div className="rounded-2xl border border-border bg-card p-4 text-left shadow-xs space-y-3">
                  {timeLeftSeconds > 0 ? (
                    <>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                          <Timer className="w-4 h-4 animate-spin text-amber-500" />
                          <span>Cancellation Window Active</span>
                        </div>
                        <span className="font-mono text-sm font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                          {formatTimer(timeLeftSeconds)} left
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-amber-500 h-1.5 transition-all duration-1000"
                          style={{ width: `${(timeLeftSeconds / 120) * 100}%` }}
                        />
                      </div>

                      <p className="text-xs text-muted-foreground leading-relaxed">
                        You can cancel your order within <strong>2 minutes</strong> of placing it. After 2 minutes, barista preparation begins and cancellation is locked.
                      </p>

                      {/* Inline Confirm Dialog or Cancel Button */}
                      {!isConfirmingCancel ? (
                        <button
                          type="button"
                          onClick={() => setIsConfirmingCancel(true)}
                          className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 hover:bg-destructive/20 text-destructive text-xs font-semibold py-2.5 transition cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel Order ({formatTimer(timeLeftSeconds)})</span>
                        </button>
                      ) : (
                        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-3.5 space-y-3 animate-in fade-in">
                          <div className="text-xs font-bold text-destructive flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>Confirm Cancellation: Order #{orderConfirmation.orderId}?</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground">
                            Are you sure you want to cancel this order?
                          </p>
                          <input
                            type="text"
                            placeholder="Reason (optional, e.g. Changed mind)"
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="w-full text-xs rounded-lg border border-input bg-background px-3 py-1.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                          />
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              type="button"
                              disabled={isCancelling}
                              onClick={handleExecuteCancel}
                              className="flex-1 rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-bold py-2 transition cursor-pointer disabled:opacity-50"
                            >
                              {isCancelling ? "Cancelling..." : "Yes, Cancel My Order"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsConfirmingCancel(false)}
                              className="px-3 rounded-lg border border-border bg-card hover:bg-secondary text-foreground text-xs font-medium py-2 transition cursor-pointer"
                            >
                              Keep Order
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    /* 2-Minute Window Closed */
                    <div className="flex items-start gap-3 text-xs">
                      <div className="w-8 h-8 rounded-lg bg-secondary text-muted-foreground flex items-center justify-center shrink-0 mt-0.5">
                        <Lock className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-semibold text-foreground flex items-center gap-1.5">
                          <span>Cancellation Window Closed</span>
                          <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground font-mono">
                            Locked
                          </span>
                        </div>
                        <p className="text-muted-foreground text-[11px] leading-relaxed">
                          More than 2 minutes have passed. Your order is actively being handcrafted by our barista team and cannot be cancelled online.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Pickup Badge */}
              <div className="rounded-xl border border-border bg-secondary/40 p-4 text-left space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
                    <MapPin className="w-4 h-4" /> {orderConfirmation.orderType === "dine-in" ? "Dine In Location" : "Pickup Location"}
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-primary text-primary-foreground shadow-xs">
                    {orderConfirmation.orderType === "dine-in" ? (
                      <>
                        <Utensils className="w-3.5 h-3.5" />
                        <span>Dine In</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Take Away</span>
                      </>
                    )}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground">{SITE.address}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/60">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Estimated Timing: <strong className="text-foreground">{orderConfirmation.pickupTime}</strong>
                  </span>
                  <span className="text-[11px] font-medium text-foreground/80">
                    {orderConfirmation.orderType === "dine-in" ? "Table Service" : "Counter To-Go"}
                  </span>
                </div>
              </div>

              {/* Order Receipt */}
              <div className="rounded-xl border border-border bg-card p-4 text-left">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Receipt Summary
                  </h4>
                  {isOrderCancelled && (
                    <span className="text-[11px] font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded">
                      CANCELLED
                    </span>
                  )}
                </div>
                <div className="space-y-2.5 divide-y divide-border/60 text-sm">
                  {orderConfirmation.items.map((item, idx) => {
                    const itemImg = item.selectedVariety?.image || item.menuItem.image;
                    return (
                      <div key={idx} className={`pt-2.5 first:pt-0 flex justify-between items-start gap-3 ${isOrderCancelled ? "opacity-60" : ""}`}>
                        <div className="flex items-start gap-2.5 min-w-0">
                          {itemImg && (
                            <img
                              src={itemImg}
                              alt={item.selectedVariety?.name || item.menuItem.name}
                              className="w-10 h-10 rounded-md object-cover shrink-0 border border-border/60 mt-0.5"
                            />
                          )}
                          <div>
                            <div className="font-medium text-foreground">
                              {item.quantity}x {item.menuItem.name}
                            </div>
                            {item.selectedVariety && (
                              <div className="text-xs text-accent font-medium">
                                Variety: {item.selectedVariety.name}
                              </div>
                            )}
                            {item.selectedSize && (
                              <div className="text-xs text-muted-foreground">
                                Size: {item.selectedSize.label}
                              </div>
                            )}
                            {item.selectedAddOns.length > 0 && (
                              <div className="text-xs text-accent">
                                + {item.selectedAddOns.map((a) => a.name).join(", ")}
                              </div>
                            )}
                          </div>
                        </div>
                        <span className="font-semibold text-foreground shrink-0">
                          ${item.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-3 border-t border-border flex justify-between text-sm font-bold text-foreground">
                  <span>Total {isOrderCancelled ? "(Cancelled)" : "Paid (incl. GST)"}</span>
                  <span className={isOrderCancelled ? "line-through text-muted-foreground" : "text-foreground"}>
                    ${orderConfirmation.total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-2">
                {!isOrderCancelled && (
                  <a
                    href={SITE.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
                  >
                    <MapPin className="w-4 h-4" /> Get Directions to Cafe
                  </a>
                )}
                <a
                  href={SITE.phoneHref}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary"
                >
                  <Phone className="w-4 h-4" /> Call Little Umbrella ({SITE.phone})
                </a>
                <button
                  type="button"
                  onClick={handleResetOrder}
                  className="w-full text-xs text-muted-foreground hover:text-foreground py-2 underline underline-offset-4 cursor-pointer"
                >
                  {isOrderCancelled ? "Back to Menu / New Order" : "Close & Start Another Order"}
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            /* Empty Cart View */
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto text-muted-foreground">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-display text-foreground">Your order is empty</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  Select any variety of coffee, specialty warmers, smoothies, or breakfast from the chalkboard menu to start ordering!
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 cursor-pointer"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            /* Cart Items & Checkout Form */
            <>
              {/* Item List */}
              <div className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Selected Items
                </h3>
                <div className="divide-y divide-border rounded-xl border border-border bg-card overflow-hidden">
                  {items.map((item) => {
                    const itemImg = item.selectedVariety?.image || item.menuItem.image;
                    return (
                      <div key={item.id} className="p-4 flex gap-3.5 items-start">
                        {itemImg && (
                          <img
                            src={itemImg}
                            alt={item.selectedVariety?.name || item.menuItem.name}
                            className="w-14 h-14 rounded-lg object-cover shrink-0 border border-border/80 shadow-xs"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-semibold text-foreground truncate">
                              {item.menuItem.name}
                            </h4>
                            <span className="text-sm font-bold text-foreground">
                              ${item.totalPrice.toFixed(2)}
                            </span>
                          </div>

                        {/* Modifiers line */}
                        <div className="text-xs text-muted-foreground mt-0.5 space-y-0.5">
                          {item.selectedVariety && (
                            <div>
                              Variety: <strong className="text-foreground/90">{item.selectedVariety.name}</strong>
                            </div>
                          )}
                          {item.selectedSize && (
                            <div>
                              Size: {item.selectedSize.label} (${item.selectedSize.price.toFixed(2)})
                            </div>
                          )}
                          {item.temperature && (
                            <div>Served: {item.temperature === "iced" ? "Iced ❄️" : "Hot 🔥"}</div>
                          )}
                          {item.selectedAddOns.length > 0 && (
                            <div className="text-accent font-medium">
                              Add-ons: {item.selectedAddOns.map((a) => `${a.name} (+$${a.price.toFixed(2)})`).join(", ")}
                            </div>
                          )}
                          {item.instructions && (
                            <div className="italic text-[11px] text-muted-foreground/80">
                              Note: "{item.instructions}"
                            </div>
                          )}
                        </div>

                        {/* Quantity and Remove */}
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center border border-border rounded-full p-0.5 bg-background">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, -1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-foreground hover:bg-secondary cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-7 text-center font-bold text-xs">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, 1)}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-foreground hover:bg-secondary cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id)}
                            className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
              </div>

              {/* Pickup & Customer Details Form */}
              <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-4 pt-2">
                <div className="border-t border-border pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Pickup Details
                    </h3>
                    <span className="text-[11px] text-accent font-medium">Choose Dining Option</span>
                  </div>

                  {/* Dine In \ Take Away Selector */}
                  <div className="space-y-1.5 mb-3.5">
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setOrderType("takeaway")}
                        className={`group relative flex items-center justify-center gap-2.5 px-3 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          orderType === "takeaway"
                            ? "bg-primary text-primary-foreground border-primary shadow-sm ring-2 ring-primary/20"
                            : "bg-card text-foreground border-border hover:bg-secondary/70 hover:border-primary/40"
                        }`}
                        aria-pressed={orderType === "takeaway"}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          orderType === "takeaway" ? "bg-white/20 text-white" : "bg-secondary text-accent"
                        }`}>
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="leading-tight">Take Away</div>
                          <div className={`text-[10px] font-normal leading-tight mt-0.5 ${
                            orderType === "takeaway" ? "text-primary-foreground/80" : "text-muted-foreground"
                          }`}>
                            To-Go / Pickup
                          </div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setOrderType("dine-in")}
                        className={`group relative flex items-center justify-center gap-2.5 px-3 py-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          orderType === "dine-in"
                            ? "bg-primary text-primary-foreground border-primary shadow-sm ring-2 ring-primary/20"
                            : "bg-card text-foreground border-border hover:bg-secondary/70 hover:border-primary/40"
                        }`}
                        aria-pressed={orderType === "dine-in"}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                          orderType === "dine-in" ? "bg-white/20 text-white" : "bg-secondary text-accent"
                        }`}>
                          <Utensils className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="leading-tight">Dine In</div>
                          <div className={`text-[10px] font-normal leading-tight mt-0.5 ${
                            orderType === "dine-in" ? "text-primary-foreground/80" : "text-muted-foreground"
                          }`}>
                            Enjoy at Table
                          </div>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-secondary/30 p-3 mb-3 text-xs space-y-1">
                    <div className="flex items-center justify-between font-medium text-foreground">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-accent" />
                        {SITE.address}
                      </div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-background border border-border/80 text-foreground">
                        {orderType === "dine-in" ? "Dine In" : "Take Away"}
                      </span>
                    </div>
                    <div className="text-muted-foreground pl-5">
                      {orderType === "dine-in"
                        ? "West Point Grey, Vancouver · Table service & counter pickup"
                        : "West Point Grey, Vancouver · Packaged fresh for counter pickup"}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Your Full Name <span className="text-accent">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Maya Chen"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full rounded-xl border border-input bg-card px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Mobile Phone Number <span className="text-accent">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. (604) 555-0199"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full rounded-xl border border-input bg-card px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Pickup Timing
                      </label>
                      <select
                        value={pickupTime}
                        onChange={(e) => setPickupTime(e.target.value)}
                        className="w-full rounded-xl border border-input bg-card px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer"
                      >
                        <option value="In 10-15 mins (ASAP)">In 10–15 mins (ASAP)</option>
                        <option value="In 30 mins">In 30 mins</option>
                        <option value="In 45 mins">In 45 mins</option>
                        <option value="In 1 hour">In 1 hour</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-foreground mb-1">
                        Order Notes (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Need cup sleeve, oat milk separate..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        className="w-full rounded-xl border border-input bg-card px-3.5 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Footer with totals & Submit button */}
        {!orderConfirmation && items.length > 0 && (
          <div className="border-t border-border bg-card p-5 sm:p-6 space-y-4">
            {/* Rates breakdown */}
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-medium text-foreground">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>BC GST (5%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-foreground pt-2 border-t border-border">
                <span>Total Due at Pickup</span>
                <span className="font-display text-xl text-accent">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md hover:opacity-95 transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Transmitting order...</span>
                ) : (
                  <>
                    <span>
                      {orderType === "dine-in" ? "Place Dine In Order" : "Place Takeaway Order"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <a
                  href={SITE.orderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition underline underline-offset-4"
                >
                  <ExternalLink className="w-3 h-3" /> Or order through Google Maps / Little Umbrella Profile
                </a>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
