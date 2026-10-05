import { Link } from "@tanstack/react-router";
import { SITE } from "@/lib/site";
import { useCart } from "@/lib/cart-context";
import { ShoppingBag, Home, Facebook, Instagram, Lock } from "lucide-react";

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

export function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.411z" />
    </svg>
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
          <a
            href={SITE.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:opacity-100 hover:text-sun transition-all font-medium text-primary-foreground group"
            title="Chat with Little Umbrella on WhatsApp"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xs group-hover:scale-110 transition-transform shrink-0">
              <WhatsAppIcon className="h-3.5 w-3.5 fill-current" />
            </span>
            <span>+1 778-452-5831</span>
          </a>
          <a href={SITE.emailHref} className="block hover:opacity-100">{SITE.email}</a>
          <div className="pt-2 flex items-center gap-3">
            <a
              href={SITE.whatsappHref}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp (+1 778-452-5831)"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white transition-all duration-200 hover:scale-110 shadow-xs"
              title="Chat with us on WhatsApp"
            >
              <WhatsAppIcon className="h-4.5 w-4.5" />
            </a>
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
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 opacity-60 hover:opacity-100 hover:text-sun transition-all duration-200"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>Staff / Admin Portal</span>
        </Link>
      </div>
    </footer>
  );
}
