import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Home, Facebook, Instagram } from "lucide-react";

export function Umbrella({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" className={`transition-transform duration-300 ${className}`} aria-hidden fill="currentColor">
      <path d="M20 1C10 1 2 8 1 17c2-2 5-2 6.5 0 1.5-2 5-2 6.5 0 1.5-2 4.5-2 6 0 1.5-2 4.5-2 6 0 1.5-2 5-2 6.5 0 1.5-2 4.5-2 6.5 0C38 8 30 1 20 1z" />
    </svg>
  );
}

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/menu", label: "Menu" },
  { to: "/visit", label: "Visit" },
  { to: "/about", label: "About" },
] as const;

export function Header() {
  const { itemCount, setIsCartOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="group flex items-center gap-2">
          <Umbrella className="h-6 w-9 text-sun group-hover:rotate-6 group-hover:scale-105 group-hover:anim-sway drop-shadow-xs" />
          <span className="font-display text-xl transition-colors group-hover:text-accent">Little Umbrella</span>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-6 text-sm">
          {nav.map((n) => {
            const Icon = "icon" in n ? n.icon : null;
            return (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="group hidden items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
                activeProps={{ className: "!text-foreground font-semibold" }}
              >
                {Icon && (
                  <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110 group-hover:anim-float" />
                )}
                <span>{n.label}</span>
              </Link>
            );
          })}
          <Link
            to="/menu"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all duration-200 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98]"
          >
            Order online
          </Link>
          {itemCount > 0 && (
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="group relative flex items-center justify-center p-2 rounded-full bg-sun text-primary hover:opacity-90 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer shadow-xs"
              aria-label={`View Cart (${itemCount} items)`}
            >
              <ShoppingBag className="w-5 h-5 transition-transform duration-200 group-hover:anim-cart" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary text-white text-[11px] font-bold flex items-center justify-center shadow-xs animate-bounce">
                {itemCount}
              </span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 sm:grid-cols-3">
        <div>
          <div className="group inline-flex items-center gap-2 cursor-pointer">
            <Umbrella className="h-6 w-9 text-sun transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:anim-sway" />
            <span className="font-display text-2xl transition-colors group-hover:text-sun">Little Umbrella</span>
          </div>
          <p className="mt-3 text-sm opacity-70">A cozy neighbourhood cafe on West 10th.</p>
        </div>
        <div className="text-sm opacity-80 space-y-2">
          <p>{SITE.address}</p>
          <a href={SITE.phoneHref} className="block hover:opacity-100">
            {SITE.phone}
          </a>
          <a href={SITE.emailHref} className="block hover:opacity-100">{SITE.email}</a>
          <div className="pt-2 flex items-center gap-3">
            <a
              href={SITE.facebookUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-all duration-200 hover:bg-sun hover:text-primary hover:scale-110"
            >
              <Facebook className="h-4.5 w-4.5" />
            </a>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram (@_littleumbrella)"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 text-primary-foreground transition-all duration-200 hover:bg-sun hover:text-primary hover:scale-110"
            >
              <Instagram className="h-4.5 w-4.5" />
            </a>
            <a
              href={SITE.instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-primary-foreground/75 hover:text-sun hover:opacity-100 transition-colors font-medium"
            >
              {SITE.instagramHandle}
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          {nav.map((n) => <Link key={n.to} to={n.to} className="opacity-80 hover:opacity-100">{n.label}</Link>)}
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-6 px-6 text-xs text-primary-foreground/60 flex flex-col sm:flex-row items-center justify-between max-w-6xl mx-auto gap-3">
        <p>© Little Umbrella Cafe, Vancouver</p>
      </div>
    </footer>
  );
}
