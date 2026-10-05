import React, { useState, useEffect, useId, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useCart } from "@/lib/cart-context";
import {
  CHALKBOARD_CUSTOMIZATIONS,
  MENU_ITEMS,
  type MenuItem,
  type MenuItemSize,
  type MenuVariety,
  type CustomizationOption,
} from "@/lib/menu-data";
import { Coffee, Plus, Minus, Check, Flame, Snowflake, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export function ItemOrderModal() {
  const { activeOrderingItem, setActiveOrderingItem, addToCart, setIsCartOpen } = useCart();
  const descId = useId();

  const [selectedSize, setSelectedSize] = useState<MenuItemSize | undefined>(undefined);
  const [selectedVariety, setSelectedVariety] = useState<MenuVariety | undefined>(undefined);
  const [selectedAddOns, setSelectedAddOns] = useState<CustomizationOption[]>([]);
  const [temperature, setTemperature] = useState<"hot" | "iced">("hot");
  const [instructions, setInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  // Slide between menu items
  const currentIndex = activeOrderingItem
    ? MENU_ITEMS.findIndex((item) => item.id === activeOrderingItem.id)
    : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < MENU_ITEMS.length - 1;

  const handlePrevItem = useCallback(() => {
    if (hasPrev && currentIndex > 0) {
      setActiveOrderingItem(MENU_ITEMS[currentIndex - 1]);
    }
  }, [hasPrev, currentIndex, setActiveOrderingItem]);

  const handleNextItem = useCallback(() => {
    if (hasNext && currentIndex >= 0 && currentIndex < MENU_ITEMS.length - 1) {
      setActiveOrderingItem(MENU_ITEMS[currentIndex + 1]);
    }
  }, [hasNext, currentIndex, setActiveOrderingItem]);

  // Reset states whenever activeOrderingItem changes
  useEffect(() => {
    if (activeOrderingItem) {
      if (activeOrderingItem.sizes && activeOrderingItem.sizes.length > 0) {
        setSelectedSize(activeOrderingItem.sizes[0]);
      } else {
        setSelectedSize(undefined);
      }

      if (activeOrderingItem.varieties && activeOrderingItem.varieties.length > 0) {
        setSelectedVariety(activeOrderingItem.varieties[0]);
      } else {
        setSelectedVariety(undefined);
      }

      setSelectedAddOns([]);
      setTemperature(activeOrderingItem.category === "cold" ? "iced" : "hot");
      setInstructions("");
      setQuantity(1);
    }
  }, [activeOrderingItem]);

  // Keyboard navigation for sliding
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeOrderingItem) return;
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") {
        return;
      }
      if (e.key === "ArrowLeft" && hasPrev) {
        handlePrevItem();
      } else if (e.key === "ArrowRight" && hasNext) {
        handleNextItem();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeOrderingItem, hasPrev, hasNext, handlePrevItem, handleNextItem]);

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    // Trigger horizontal slide when swipe is mostly horizontal
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
      if (diffX > 0 && hasPrev) {
        handlePrevItem();
      } else if (diffX < 0 && hasNext) {
        handleNextItem();
      }
    }
    setTouchStartX(null);
    setTouchStartY(null);
  };

  if (!activeOrderingItem) return null;

  // Calculate live dynamic rate
  const sizePrice = selectedSize ? selectedSize.price : activeOrderingItem.basePrice;
  const varietyDelta = selectedVariety?.priceDelta || 0;
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const unitRate = +(sizePrice + varietyDelta + addOnsTotal).toFixed(2);
  const totalRate = +(unitRate * quantity).toFixed(2);

  // Filter allowed customizations for this item
  const allowedAddOns = CHALKBOARD_CUSTOMIZATIONS.filter((c) =>
    activeOrderingItem.allowedCustomizations?.some((allowed) => {
      const prefix = allowed.split("-")[0];
      return prefix ? c.id.startsWith(prefix) : false;
    })
  );

  const toggleAddOn = (addon: CustomizationOption) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((p) => p.id === addon.id);
      if (exists) {
        return prev.filter((p) => p.id !== addon.id);
      } else {
        return [...prev, addon];
      }
    });
  };

  const handleAddToCart = () => {
    addToCart({
      menuItem: activeOrderingItem,
      selectedVariety,
      selectedSize,
      selectedAddOns,
      temperature: ["coffee", "lattes"].includes(activeOrderingItem.category) ? temperature : undefined,
      instructions: instructions.trim() || undefined,
      quantity,
      unitPrice: unitRate,
    });

    toast.success(`Added ${quantity}x ${activeOrderingItem.name} to order`, {
      description: selectedVariety ? `Variety: ${selectedVariety.name}` : undefined,
      action: {
        label: "View Cart",
        onClick: () => setIsCartOpen(true),
      },
    });

    setActiveOrderingItem(null);
  };

  const isBeverage = ["coffee", "lattes", "cold"].includes(activeOrderingItem.category);
  const currentImage = selectedVariety?.image || activeOrderingItem.image;

  return (
    <Dialog open={!!activeOrderingItem} onOpenChange={(open) => !open && setActiveOrderingItem(null)}>
      <DialogContent
        className="flex flex-col max-h-[85vh] sm:max-h-[88vh] w-[95vw] sm:max-w-xl p-0 gap-0 rounded-3xl bg-card border-border/80 shadow-2xl overflow-hidden focus:outline-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header styling with dynamic variety photo & Slide Controls */}
        <div className="relative shrink-0 min-h-[170px] sm:min-h-[200px] bg-primary text-primary-foreground overflow-hidden select-none">
          {currentImage ? (
            <>
              <img
                src={currentImage}
                alt={selectedVariety?.name || activeOrderingItem.name}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500 scale-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/75 to-primary/30" />
            </>
          ) : (
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-10 pointer-events-none">
              <Coffee className="w-40 h-40" />
            </div>
          )}

          {/* Slide Navigation Arrows (Prev / Next Item) */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-between px-3 z-20 pointer-events-none">
            {hasPrev ? (
              <button
                type="button"
                onClick={handlePrevItem}
                className="pointer-events-auto w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-xs flex items-center justify-center transition hover:scale-110 active:scale-90 shadow-lg cursor-pointer border border-white/20"
                title="Slide to Previous Item (←)"
                aria-label="Previous Item"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-9" />
            )}

            {hasNext ? (
              <button
                type="button"
                onClick={handleNextItem}
                className="pointer-events-auto w-9 h-9 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-xs flex items-center justify-center transition hover:scale-110 active:scale-90 shadow-lg cursor-pointer border border-white/20"
                title="Slide to Next Item (→)"
                aria-label="Next Item"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <div className="w-9" />
            )}
          </div>

          <div className="relative p-6 sm:p-7 z-10 flex flex-col justify-end min-h-[170px] sm:min-h-[200px]">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="text-xs uppercase tracking-widest text-sun font-medium bg-black/50 px-2.5 py-0.5 rounded-full backdrop-blur-xs">
                {activeOrderingItem.categoryLabel}
              </span>
              {selectedVariety ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-sun text-primary px-2.5 py-0.5 text-[11px] font-bold shadow-xs">
                  <Sparkles className="w-3 h-3 anim-sparkle" />
                  {selectedVariety.name}
                </span>
              ) : activeOrderingItem.tag ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-sun/30 backdrop-blur-xs px-2.5 py-0.5 text-[11px] font-medium text-white border border-sun/40">
                  <Sparkles className="w-3 h-3 anim-sparkle" />
                  {activeOrderingItem.tag}
                </span>
              ) : null}

              {/* Item index counter */}
              {currentIndex >= 0 && (
                <span className="text-[10px] text-white/80 bg-black/50 px-2.5 py-0.5 rounded-full backdrop-blur-xs ml-auto">
                  {currentIndex + 1} / {MENU_ITEMS.length}
                </span>
              )}
            </div>

            <DialogTitle className="text-2xl sm:text-3xl font-display text-white drop-shadow-sm">
              {activeOrderingItem.name}
            </DialogTitle>

            <DialogDescription id={descId} className="mt-1 text-white/90 text-xs sm:text-sm leading-relaxed max-w-lg drop-shadow-xs line-clamp-2">
              {selectedVariety?.description || activeOrderingItem.description}
            </DialogDescription>
          </div>
        </div>

        {/* Scrollable Content Body (Full smooth vertical sliding/scrolling) */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-5 sm:p-6 space-y-6 focus:outline-none">
          {/* Variety selection with visual thumbnails */}
          {activeOrderingItem.varieties && activeOrderingItem.varieties.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-xs font-semibold tracking-wider uppercase text-foreground/80">
                  Select Variety / Flavor <span className="text-accent">*</span>
                </label>
                <span className="text-xs text-muted-foreground">Tap a variety to preview</span>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2">
                {activeOrderingItem.varieties.map((variety) => {
                  const isSelected = selectedVariety?.id === variety.id;
                  return (
                    <button
                      key={variety.id}
                      type="button"
                      onClick={() => setSelectedVariety(variety)}
                      className={`relative flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-accent bg-accent/10 ring-2 ring-accent/30 shadow-xs"
                          : "border-border hover:border-foreground/30 bg-background"
                      }`}
                    >
                      {variety.image && (
                        <img
                          src={variety.image}
                          alt={variety.name}
                          className={`w-14 h-14 rounded-lg object-cover shrink-0 border transition-transform duration-200 ${
                            isSelected ? "border-accent ring-1 ring-accent scale-105" : "border-border/60"
                          }`}
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between w-full">
                          <span className={`text-sm font-medium truncate ${isSelected ? "text-accent font-semibold" : "text-foreground"}`}>
                            {variety.name}
                          </span>
                          {variety.priceDelta ? (
                            <span className="text-xs font-semibold text-accent shrink-0 ml-1">
                              +${variety.priceDelta.toFixed(2)}
                            </span>
                          ) : null}
                        </div>
                        {variety.description && (
                          <p className="mt-0.5 text-xs text-muted-foreground leading-tight line-clamp-2">
                            {variety.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size selection */}
          {activeOrderingItem.sizes && activeOrderingItem.sizes.length > 1 && (
            <div>
              <label className="text-xs font-semibold tracking-wider uppercase text-foreground/80 block mb-2.5">
                Select Size <span className="text-accent">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3">
                {activeOrderingItem.sizes.map((size) => {
                  const isSelected = selectedSize?.name === size.name;
                  return (
                    <button
                      key={size.name}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                          : "border-border hover:border-foreground/30 bg-background"
                      }`}
                    >
                      <div className="text-left">
                        <div className={`text-sm font-semibold ${isSelected ? "text-accent" : "text-foreground"}`}>
                          {size.name === "M" ? "Medium (M)" : size.name === "L" ? "Large (L)" : size.label}
                        </div>
                        <div className="text-xs text-muted-foreground">{size.label}</div>
                      </div>
                      <span className="text-sm font-bold text-foreground">
                        ${size.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Temperature for hot/iced coffees & lattes */}
          {isBeverage && activeOrderingItem.category !== "cold" && (
            <div>
              <label className="text-xs font-semibold tracking-wider uppercase text-foreground/80 block mb-2">
                Temperature
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setTemperature("hot")}
                  className={`group flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition cursor-pointer ${
                    temperature === "hot"
                      ? "border-accent bg-accent/10 text-accent font-semibold ring-1 ring-accent"
                      : "border-border text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <Flame className={`w-4 h-4 text-orange-500 transition-transform ${temperature === "hot" ? "anim-flame" : "group-hover:scale-110"}`} /> Hot
                </button>
                <button
                  type="button"
                  onClick={() => setTemperature("iced")}
                  className={`group flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border text-sm font-medium transition cursor-pointer ${
                    temperature === "iced"
                      ? "border-accent bg-accent/10 text-accent font-semibold ring-1 ring-accent"
                      : "border-border text-foreground hover:bg-secondary/60"
                  }`}
                >
                  <Snowflake className={`w-4 h-4 text-cyan-500 transition-transform ${temperature === "iced" ? "anim-snowflake" : "group-hover:scale-110"}`} /> Over Ice
                </button>
              </div>
            </div>
          )}

          {/* Add-ons & Customizations from chalkboard */}
          {allowedAddOns.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold tracking-wider uppercase text-foreground/80">
                  Chalkboard Add-ons & Modifiers
                </label>
                <span className="text-xs text-muted-foreground">Optional</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {allowedAddOns.map((addon) => {
                  const isChecked = selectedAddOns.some((a) => a.id === addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddOn(addon)}
                      className={`flex items-center justify-between p-3 rounded-xl border text-left transition cursor-pointer ${
                        isChecked
                          ? "border-accent bg-accent/5 ring-1 ring-accent text-foreground"
                          : "border-border hover:border-foreground/30 bg-background text-foreground/90"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center transition ${
                            isChecked ? "bg-accent border-accent text-white" : "border-muted-foreground/40"
                          }`}
                        >
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-xs font-medium">{addon.name}</span>
                      </div>
                      <span className="text-xs font-bold text-accent">
                        +${addon.price.toFixed(2)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Instructions */}
          <div>
            <label className="text-xs font-semibold tracking-wider uppercase text-foreground/80 block mb-1.5">
              Special Instructions
            </label>
            <input
              type="text"
              placeholder="e.g. Extra hot, light ice, less sweet..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full rounded-xl border border-input bg-background px-3.5 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Sticky Footer with Rate breakdown and Order button (ALWAYS VISIBLE, NEVER CUT OFF) */}
        <div className="shrink-0 border-t border-border bg-card/95 backdrop-blur-md p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg sticky bottom-0 z-20">
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            {/* Quantity stepper */}
            <div className="flex items-center border border-border bg-background rounded-full p-1 shadow-xs">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-secondary disabled:opacity-30 cursor-pointer transition-transform active:scale-75 hover:scale-110"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-9 text-center font-bold text-sm select-none">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-foreground hover:bg-secondary cursor-pointer transition-transform active:scale-125 hover:scale-110"
                aria-label="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Dynamic Rate display */}
            <div className="text-right sm:text-left">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">
                Unit Rate: ${unitRate.toFixed(2)}
              </div>
              <div className="text-xl font-bold font-display text-foreground">
                ${totalRate.toFixed(2)}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:opacity-95 hover:shadow-lg active:scale-[0.98] cursor-pointer"
          >
            <span>Add to Order</span>
            <span className="w-1.5 h-1.5 rounded-full bg-sun" />
            <span>${totalRate.toFixed(2)}</span>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
