import { createFileRoute } from "@tanstack/react-router";
import sign from "@/assets/sign.jpg";
import beans from "@/assets/beans.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Little Umbrella Cafe, Vancouver" },
      { name: "description", content: "The story of Little Umbrella, a cozy neighbourhood cafe on West 10th Avenue in Vancouver." },
      { property: "og:title", content: "About Little Umbrella" },
      { property: "og:description", content: "A cozy neighbourhood cafe in West Point Grey." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <img src={sign} alt="Little Umbrella logo" className="aspect-[21/9] w-full rounded-2xl object-cover shadow-lg" />
      <div className="mt-16 grid gap-12 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Our story</p>
          <h1 className="mt-4 text-5xl">A small, warm place in a rainy city.</h1>
          <div className="mt-8 space-y-5 text-lg text-foreground/80">
            <p>Little Umbrella is a neighbourhood cafe on West 10th Avenue — somewhere to duck in from the weather, catch up with a friend, or settle in with a laptop and a latte.</p>
            <p>We keep things simple: good coffee, honest breakfast food, fresh bakes and friendly faces behind the counter.</p>
          </div>
        </div>
        <img src={beans} alt="Bag of West End Coffee Roasters beans" loading="lazy" className="aspect-square w-full rounded-2xl object-cover shadow-lg" />
      </div>
    </section>
  );
}
