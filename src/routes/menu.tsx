import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  MENU_ITEMS,
  CATEGORIES,
  type MenuItem,
} from "@/lib/menu-data";
import { useCart } from "@/lib/cart-context";
import { ItemOrderModal } from "@/components/ItemOrderModal";
import {
  Coffee,
  Search,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Plus,
  Flame,
  LayoutGrid,
  ScrollText,
} from "lucide-react";
import { getCafeStatus, SITE } from "@/lib/site";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu & Order Online — Little Umbrella Cafe" },
      {
        name: "description",
        content:
          "Artisan menu on West 10th Ave: Livia sourdough avocado toast, seasonal pumpkin spice latte, fresh smoothies, espresso & bakes. Order online for counter pickup.",
      },
      { property: "og:title", content: "Little Umbrella Cafe — Artisan Menu" },
      { property: "og:description", content: "Chalkboard coffee, breakfast & lunch on West 10th Ave, Vancouver." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const { setActiveOrderingItem, setIsCartOpen, itemCount, total } = useCart();
  const [viewMode, setViewMode] = useState<"editorial" | "interactive">("editorial");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const cafeStatus = getCafeStatus();

  // Filter items for interactive search/category view
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesDesc = item.description.toLowerCase().includes(query);
        const matchesIng = item.ingredients?.toLowerCase().includes(query);
        const matchesVarieties = item.varieties?.some((v) =>
          v.name.toLowerCase().includes(query) || v.description?.toLowerCase().includes(query)
        );
        return matchesName || matchesDesc || matchesIng || !!matchesVarieties;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  // Grouped sections for the Luxury Editorial view
  const sections = useMemo(() => {
    return [
      {
        id: "seasonal",
        title: "Seasonal Features",
        eyebrow: "Autumn Chalkboard Specials",
        items: MENU_ITEMS.filter((i) => i.category === "seasonal"),
      },
      {
        id: "breakfast",
        title: "Breakfast & Morning",
        eyebrow: "Served on Artisan Livia Sourdough",
        items: MENU_ITEMS.filter((i) => i.category === "breakfast"),
      },
      {
        id: "lunch",
        title: "Lunch & Artisan Sandwiches",
        eyebrow: "Fresh Ciabatta, Potato Buns & Bowls",
        items: MENU_ITEMS.filter((i) => i.category === "lunch"),
      },
      {
        id: "coffee",
        title: "Espresso & Classic Coffee",
        eyebrow: "Locally Roasted & Microfoamed",
        items: MENU_ITEMS.filter((i) => i.category === "coffee"),
      },
      {
        id: "lattes",
        title: "Specialty Warmers & Botanicals",
        eyebrow: "House Turmeric, Chai & Ceremonial Matcha",
        items: MENU_ITEMS.filter((i) => i.category === "lattes"),
      },
      {
        id: "cold",
        title: "Chilled, Cold Brew & Smoothies",
        eyebrow: "18-Hour Slow Steep & Whole Blended Fruits",
        items: MENU_ITEMS.filter((i) => i.category === "cold"),
      },
      {
        id: "bakery",
        title: "Fresh Bakery",
        eyebrow: "Baked Fresh Daily with Normandy Butter",
        items: MENU_ITEMS.filter((i) => i.category === "bakery"),
      },
    ];
  }, []);

  return (
    <>
      <div className="min-h-screen pb-32 bg-background">
        {/* Luxury Editorial Header */}
        <header className="border-b border-border bg-gradient-to-b from-secondary/40 via-background to-background pt-16 pb-12">
          <div className="mx-auto max-w-5xl px-6 text-center">
            {/* Top Eyebrow */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-8 bg-accent/40" />
              <span className="text-xs uppercase tracking-[0.3em] text-accent font-semibold">
                Little Umbrella Cafe · West Point Grey
              </span>
              <span className="h-px w-8 bg-accent/40" />
            </div>

            {/* Main Title */}
            <h1 className="text-4xl sm:text-6xl font-display font-light tracking-tight text-foreground leading-[1.08]">
              The Counter Menu
            </h1>

            <p className="mt-4 max-w-xl mx-auto text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
              Crafted fresh every morning on West 10th Avenue. Select any variety below to preview photos, customize your order, and pick up fresh at our counter.
            </p>

            {/* Status & Actions bar */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3.5 py-1 text-xs text-foreground/80 border border-border/60">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {cafeStatus.statusLabel} ({cafeStatus.statusDetail})
              </span>

              {itemCount > 0 && (
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-sm hover:opacity-95 transition cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-sun" />
                  <span>Cart ({itemCount}) • ${total.toFixed(2)}</span>
                </button>
              )}
            </div>

            {/* View Mode Switcher */}
            <div className="mt-10 inline-flex items-center rounded-full border border-border/80 bg-secondary/40 p-1 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("editorial")}
                className={`flex items-center gap-1.5 rounded-full px-5 py-2 font-medium transition cursor-pointer ${
                  viewMode === "editorial"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <ScrollText className="w-3.5 h-3.5" />
                <span>Editorial Menu View</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode("interactive")}
                className={`flex items-center gap-1.5 rounded-full px-5 py-2 font-medium transition cursor-pointer ${
                  viewMode === "interactive"
                    ? "bg-primary text-primary-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Interactive Catalog View</span>
              </button>
            </div>
          </div>
        </header>

        {/* Chalkboard Add-on Footnote Ribbon */}
        <aside aria-label="Customization options" className="border-b border-border bg-secondary/30 py-3.5 px-6">
          <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-center text-xs text-muted-foreground">
            <span className="font-semibold text-accent uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> In-Store Customizations:
            </span>
            <span>Plant Milk (Oat/Almond/Soy) <strong>+75¢</strong></span>
            <span>•</span>
            <span>Extra Shot <strong>+$1.00</strong></span>
            <span>•</span>
            <span>Misto <strong>+50¢</strong></span>
            <span>•</span>
            <span>Syrups <strong>+75¢</strong></span>
            <span>•</span>
            <span>Sauce <strong>+$1.00</strong></span>
            <span>•</span>
            <span>Turmeric <strong>+$1.50</strong></span>
            <span>•</span>
            <span>Add Smashed Avocado <strong>+$1.50</strong></span>
          </div>
        </aside>

        {/* ========================================================
            VIEW 1: LUXURY EDITORIAL MENU (Bistro style with photos)
           ======================================================== */}
        {viewMode === "editorial" && (
          <main className="mx-auto max-w-5xl px-6 pt-10 space-y-16">
            {sections.map((section) => (
              <section key={section.id} className="relative">
                {/* Section Header */}
                <div className="mb-8 pb-3 border-b border-foreground/15 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-display font-medium text-foreground tracking-tight">
                      {section.title}
                    </h2>
                    <p className="text-xs uppercase tracking-widest text-accent font-medium mt-0.5">
                      {section.eyebrow}
                    </p>
                  </div>
                  <span className="text-[11px] text-muted-foreground italic">
                    Tap any item to customize variety & order
                  </span>
                </div>

                {/* Items in Editorial Grid with Imagery */}
                <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setActiveOrderingItem(item)}
                      className="group cursor-pointer rounded-2xl p-4 -mx-4 transition-all hover:bg-secondary/40 flex gap-4 items-start border border-transparent hover:border-border/60"
                    >
                      {/* Photo Thumbnail */}
                      {item.image && (
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 border border-border/80 shadow-xs bg-muted">
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        {/* Name & Rate line */}
                        <div className="flex items-baseline justify-between gap-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <h3 className="text-base font-display font-medium text-foreground group-hover:text-accent transition-colors truncate">
                              {item.name}
                            </h3>
                            {item.tag && (
                              <span className="hidden sm:inline-block text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-sun/20 text-foreground border border-sun/30 shrink-0">
                                {item.tag}
                              </span>
                            )}
                          </div>

                          {/* Price Display */}
                          <div className="text-sm font-semibold font-display text-foreground shrink-0 group-hover:text-accent transition-colors">
                            {item.sizes && item.sizes.length > 1 && item.sizes[0] && item.sizes[item.sizes.length - 1] ? (
                              <span>
                                M ${item.sizes[0].price.toFixed(2)} · L ${item.sizes[item.sizes.length - 1]!.price.toFixed(2)}
                              </span>
                            ) : (
                              <span>${item.basePrice.toFixed(2)}</span>
                            )}
                          </div>
                        </div>

                        {/* Ingredients / Description */}
                        <p className="mt-1 text-xs text-muted-foreground/90 font-sans italic leading-relaxed line-clamp-2">
                          {item.ingredients || item.description}
                        </p>

                        {/* Varieties preview if available */}
                        {item.varieties && item.varieties.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1.5 text-[11px] text-foreground/80">
                            {item.varieties.map((v) => (
                              <span
                                key={v.id}
                                className="inline-flex items-center gap-1 rounded-md bg-secondary/80 border border-border/60 px-1.5 py-0.5 text-[10px]"
                              >
                                {v.image && (
                                  <img src={v.image} alt={v.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                                )}
                                <span>{v.name}</span>
                              </span>
                            ))}
                          </div>
                        )}

                        {/* Order CTA */}
                        <div className="mt-2.5 flex items-center justify-between text-xs text-muted-foreground opacity-60 group-hover:opacity-100 transition-opacity">
                          <span className="text-[11px]">Select variety & customize</span>
                          <span className="inline-flex items-center gap-1 font-semibold text-accent text-xs">
                            <span>Order</span>
                            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {/* In-Store Counter Note */}
            <div className="rounded-2xl border border-border/80 bg-secondary/50 p-8 text-center mt-16">
              <h3 className="text-xl font-display text-foreground">
                Visiting Little Umbrella on West 10th?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                Orders placed online are transmitted directly to our espresso bar for counter pickup. Or stop by in person: <strong>{SITE.address}</strong>.
              </p>
              <div className="mt-5 flex justify-center gap-3">
                <a
                  href={SITE.phoneHref}
                  className="rounded-full bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90"
                >
                  Call Cafe: {SITE.phone}
                </a>
                <a
                  href={SITE.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-border bg-card px-5 py-2.5 text-xs font-semibold text-foreground hover:bg-secondary"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </main>
        )}

        {/* ========================================================
            VIEW 2: INTERACTIVE FILTERABLE CATALOG VIEW
           ======================================================== */}
        {viewMode === "interactive" && (
          <main className="mx-auto max-w-6xl px-6 pt-8 space-y-8">
            {/* Search & Category Pills Bar */}
            <div className="space-y-4">
              <div className="relative max-w-lg mx-auto">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search coffee, avocado toast, smoothie varieties, sandwiches..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-input bg-card pl-10 pr-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition shadow-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar justify-start sm:justify-center py-1">
                {CATEGORIES.map((cat) => {
                  const count =
                    cat.id === "all"
                      ? MENU_ITEMS.length
                      : MENU_ITEMS.filter((i) => i.category === cat.id).length;
                  const isSelected = selectedCategory === cat.id;

                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-xs sm:text-sm font-medium transition cursor-pointer shrink-0 ${
                        isSelected
                          ? "bg-accent text-accent-foreground shadow-xs font-semibold ring-2 ring-accent/30"
                          : "border border-border/80 bg-card text-foreground hover:bg-secondary/70"
                      }`}
                    >
                      <span>{cat.label}</span>
                      <span className="text-[10px] opacity-75">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grid of Cards with Photo Banners */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:border-accent/40 hover:shadow-lg transition-all duration-200"
                >
                  {/* Photo Header */}
                  {item.image && (
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                      <img
                        src={item.image}
                        alt={item.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-white bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20">
                          {item.categoryLabel}
                        </span>
                      </div>

                      {item.tag && (
                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] px-2.5 py-1 rounded-full bg-sun text-primary font-bold shadow-xs">
                            {item.tag}
                          </span>
                        </div>
                      )}

                      <div className="absolute bottom-3 right-3">
                        <div className="text-base font-bold font-display text-white drop-shadow-sm bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-lg border border-white/20">
                          {item.sizes && item.sizes.length > 1 && item.sizes[0] && item.sizes[item.sizes.length - 1] ? (
                            <span>${item.sizes[0].price.toFixed(2)}–${item.sizes[item.sizes.length - 1]!.price.toFixed(2)}</span>
                          ) : (
                            <span>${item.basePrice.toFixed(2)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-display font-medium text-foreground group-hover:text-accent transition-colors">
                        {item.name}
                      </h3>

                      <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {item.description}
                      </p>

                      {item.ingredients && (
                        <p className="mt-2 text-[11px] italic text-muted-foreground/80 font-sans border-t border-border/50 pt-1.5">
                          {item.ingredients}
                        </p>
                      )}

                      {/* Variety thumbnails inside card */}
                      {item.varieties && item.varieties.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {item.varieties.map((v) => (
                            <span
                              key={v.id}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-secondary/80 border border-border/50 pl-1 pr-2 py-0.5 text-[10px] text-foreground/85"
                            >
                              {v.image && (
                                <img
                                  src={v.image}
                                  alt={v.name}
                                  className="w-4 h-4 rounded-full object-cover shrink-0"
                                />
                              )}
                              <span>{v.name}</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-5 pt-3.5 border-t border-border/60 flex items-center justify-between">
                      <span className="text-[11px] text-muted-foreground">Select variety</span>
                      <button
                        type="button"
                        onClick={() => setActiveOrderingItem(item)}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition active:scale-95 cursor-pointer shadow-xs"
                      >
                        <span>Order</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        )}
      </div>

      {/* Floating Cart Pill (Fixed at bottom on desktop & mobile) */}
      {itemCount > 0 && (
        <aside aria-label="Order summary" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center justify-between rounded-full bg-primary text-primary-foreground p-2 pl-5 pr-2.5 shadow-2xl border border-primary-foreground/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-sun text-primary flex items-center justify-center font-bold text-xs">
                {itemCount}
              </div>
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider text-sun font-medium">Your Order</div>
                <div className="text-sm font-bold font-display">${total.toFixed(2)} (incl. GST)</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full bg-sun px-5 py-2.5 text-xs sm:text-sm font-bold text-primary hover:opacity-95 shadow-xs transition cursor-pointer"
            >
              <span>View Order</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </aside>
      )}

      {/* Item Order & Variety Modal */}
      <ItemOrderModal />
    </>
  );
}
