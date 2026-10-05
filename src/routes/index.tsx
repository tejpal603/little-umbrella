import { createFileRoute, Link } from "@tanstack/react-router";
import { Star, Wifi, Plug, Sun, Coffee } from "lucide-react";
import { AnimatedUmbrella } from "@/components/ui/animated-icons";
import hero from "@/assets/hero.jpg";
import breakfast from "@/assets/breakfast.jpg";
import bakery from "@/assets/bakery.jpg";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Little Umbrella — Coffee & Breakfast on West 10th, Vancouver" },
      { name: "description", content: "A cozy cafe in West Point Grey: espresso, breakfast wraps, fresh croissants and a calm place to work. Order online or visit us." },
      { property: "og:title", content: "Little Umbrella — Cozy Cafe in Vancouver" },
      { property: "og:description", content: "Espresso, breakfast wraps and fresh bakes on West 10th Ave." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-14 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <div className="group inline-flex items-center gap-2.5 rounded-full border border-sun/40 bg-sun/15 px-4 py-1.5 shadow-xs transition-colors hover:bg-sun/25 cursor-default">
            <AnimatedUmbrella className="h-5 w-8 text-sun drop-shadow-xs" trigger="ambient" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">West Point Grey · Vancouver</span>
          </div>
          <h1 className="mt-5 text-5xl leading-[1.05] sm:text-7xl">
            A little shelter <em className="font-light text-accent">for slow mornings.</em>
          </h1>
          <p className="mt-6 max-w-md text-lg text-muted-foreground">
            Carefully made coffee, warm breakfast wraps and buttery bakes — served with a smile on West 10th Avenue.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/menu" className="rounded-full bg-primary px-7 py-3.5 text-primary-foreground transition-opacity hover:opacity-90">Order online</Link>
            <Link to="/visit" className="rounded-full border border-foreground/20 px-7 py-3.5 transition-colors hover:bg-secondary">Plan a visit</Link>
          </div>
          <div className="mt-10 flex items-center gap-3 text-sm">
            <div className="group flex text-sun cursor-pointer">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-current transition-all duration-300 hover:scale-135 hover:rotate-12 hover:text-amber-400 group-hover:anim-star"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
            <span><strong>4.7</strong> from 268 Google reviews</span>
          </div>
        </div>
        <div>
          <img
            src={hero}
            alt="Little Umbrella storefront on West 10th"
            width={1024}
            height={946}
            className="aspect-square w-full rounded-2xl object-cover shadow-2xl"
          />
        </div>
      </section>

      <section className="border-y border-border bg-secondary/60">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-6 py-6 text-sm sm:grid-cols-4">
          {[
            [Wifi, "Free Wi-Fi", "group-hover:anim-wifi"],
            [Plug, "Power outlets", "group-hover:anim-plug"],
            [Coffee, "Study & work friendly", "group-hover:anim-steam"],
            [Sun, "Indoor & patio seating", "group-hover:anim-sun"],
          ].map(([Icon, label, animClass]) => {
            const I = Icon as typeof Wifi;
            return (
              <div
                key={label as string}
                className="group flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 hover:bg-background/80 hover:shadow-xs cursor-default"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 transition-colors group-hover:bg-accent/20">
                  <I className={`h-5 w-5 text-accent transition-transform duration-300 group-hover:scale-110 ${animClass as string}`} />
                </div>
                <span className="font-medium text-foreground/90">{label as string}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-4xl sm:text-5xl">From the counter</h2>
          <Link to="/menu" className="text-sm underline underline-offset-4">See the full menu</Link>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {[
            { img: breakfast, title: "Breakfast & lunch", text: "Avocado toast on Livia sourdough, avocado frittata wrap, breakfast sandwich, and artisan melts." },
            { img: bakery, title: "Fresh bakes", text: "Flaky all-butter croissants, wild mushroom Danish, and dark chocolate chunk sea salt cookies." },
          ].map((c) => (
            <article key={c.title}>
              <img src={c.img} alt={c.title} loading="lazy" width={1024} height={1024} className="aspect-[4/3] w-full rounded-2xl object-cover" />
              <h3 className="mt-5 text-2xl">{c.title}</h3>
              <p className="mt-2 text-muted-foreground">{c.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Signature Varieties Showcase */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent">Fresh From Our Kitchen & Bar</span>
            <h2 className="text-3xl sm:text-4xl mt-1">Explore Signature Varieties</h2>
          </div>
          <Link to="/menu" className="text-sm underline underline-offset-4 text-accent font-medium">
            View all varieties on full menu &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Pain au Chocolat", category: "French Bakery", img: "/images/menu/chocolate-croissant.jpg", price: "$4.75" },
            { name: "Almond Croissant", category: "French Bakery", img: "/images/menu/almond-croissant.jpg", price: "$5.00" },
            { name: "Berry Blast", category: "Smoothies", img: "/images/menu/berry-blast.jpg", price: "$7.50" },
            { name: "Turmeric Sunshine", category: "Smoothies", img: "/images/menu/turmeric-sunshine.jpg", price: "$7.50" },
            { name: "Mocha Frappe", category: "Chilled Frappe", img: "/images/menu/mocha-frappe.jpg", price: "$5.50" },
            { name: "Hibiscus Iced Tea", category: "Steeped Cold", img: "/images/menu/hibiscus-berry-iced-tea.jpg", price: "$3.75" },
          ].map((v) => (
            <Link
              key={v.name}
              to="/menu"
              className="group block rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs hover:border-accent/40 hover:shadow-md transition-all"
            >
              <div className="aspect-square w-full overflow-hidden bg-muted">
                <img
                  src={v.img}
                  alt={v.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-medium">
                  {v.category}
                </span>
                <div className="font-medium text-xs sm:text-sm text-foreground truncate mt-0.5 group-hover:text-accent transition-colors">
                  {v.name}
                </div>
                <div className="text-xs font-bold text-foreground mt-1">
                  {v.price}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6">
        <div className="rounded-2xl bg-primary px-8 py-16 text-center text-primary-foreground sm:px-16">
          <h2 className="text-4xl sm:text-5xl">Come in out of the rain.</h2>
          <p className="mx-auto mt-4 max-w-lg opacity-75">{SITE.address}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/menu" className="rounded-full bg-sun px-7 py-3.5 text-primary font-semibold transition-opacity hover:opacity-90">Order online</Link>
            <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="rounded-full border border-primary-foreground/30 px-7 py-3.5">Get directions</a>
          </div>
        </div>
      </section>
    </>
  );
}
