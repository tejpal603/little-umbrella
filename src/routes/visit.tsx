import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { ChevronDown, MapPin, Phone, Clock, Mail, Instagram } from "lucide-react";
import cafeInterior from "@/assets/cafe-interior.jpg";
import { SITE, HOURS, getCafeStatus } from "@/lib/site";

export const Route = createFileRoute("/visit")({
  head: () => ({
    meta: [
      { title: "Visit — Little Umbrella, 4372 W 10th Ave, Vancouver" },
      { name: "description", content: "Find Little Umbrella cafe at 4372 W 10th Ave in West Point Grey. Free Wi-Fi, outlets, indoor and patio seating." },
      { property: "og:title", content: "Visit Little Umbrella Cafe" },
      { property: "og:description", content: "4372 W 10th Ave, Vancouver — directions, phone and amenities." },
    ],
  }),
  component: VisitPage,
});

function VisitPage() {
  const [isOpen, setIsOpen] = useState(false);
  const status = getCafeStatus();

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent">Visit us</p>
          <h1 className="mt-4 text-5xl sm:text-6xl">Look for the yellow umbrella.</h1>
          <dl className="mt-10 space-y-6">
            <div className="group">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent transition-transform group-hover:anim-pin" />
                Address
              </dt>
              <dd className="mt-1 text-lg">{SITE.address}</dd>
            </div>
            <div className="group">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-accent transition-transform group-hover:anim-phone" />
                Phone
              </dt>
              <dd className="mt-1 text-lg flex flex-wrap items-center gap-3">
                <a href={SITE.phoneHref} className="underline underline-offset-4 hover:text-accent transition-colors">
                  {SITE.phone}
                </a>
              </dd>
            </div>
            <div className="group">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 text-accent transition-transform group-hover:scale-110" />
                Email
              </dt>
              <dd className="mt-1 text-lg">
                <a href={SITE.emailHref} className="underline underline-offset-4 hover:text-accent transition-colors">
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div className="group">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                <Instagram className="h-4 w-4 text-accent transition-transform group-hover:scale-110" />
                Instagram
              </dt>
              <dd className="mt-1 text-lg">
                <a
                  href={SITE.instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4 hover:text-accent transition-colors"
                >
                  {SITE.instagramHandle}
                </a>
              </dd>
            </div>
            <div className="group">
              <dt className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-accent transition-transform group-hover:anim-clock" />
                Hours
              </dt>
              <dd className="mt-2">
                <div className="w-full max-w-sm">
                  {/* Open & Close trigger button with icon */}
                  <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-expanded={isOpen}
                    className="group flex w-full items-center justify-between rounded-xl border border-border/80 bg-secondary/40 px-3.5 py-2.5 text-left transition-colors hover:border-foreground/30 hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`inline-block h-2.5 w-2.5 rounded-full ${
                          status.isOpen
                            ? "bg-emerald-500 ring-4 ring-emerald-500/20"
                            : "bg-amber-500 ring-4 ring-amber-500/20"
                        }`}
                      />
                      <span className="text-base font-medium">
                        <span
                          className={
                            status.isOpen
                              ? "font-semibold text-emerald-600 dark:text-emerald-400"
                              : "font-semibold text-amber-600 dark:text-amber-400"
                          }
                        >
                          {status.statusLabel}
                        </span>
                        <span className="text-muted-foreground"> · </span>
                        <span className="text-foreground/90">{status.statusDetail}</span>
                      </span>
                    </span>

                    {/* Open / Close button indicator with rotating icon */}
                    <span className="flex items-center gap-1.5 rounded-md bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground/80 shadow-xs transition-colors group-hover:bg-background group-hover:text-foreground">
                      <span>{isOpen ? "Close" : "Open"}</span>
                      <ChevronDown
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </span>
                  </button>

                  {/* Expandable Timetable */}
                  {isOpen && (
                    <div className="mt-2.5 rounded-xl border border-border/70 bg-card/60 p-4 transition-all">
                      <div className="grid grid-cols-[110px_1fr] gap-y-2 text-sm sm:text-base">
                        {HOURS.map(({ day, hours }) => {
                          const isToday = day === status.todayDayName;
                          return (
                            <Fragment key={day}>
                              <span
                                className={
                                  isToday
                                    ? "flex items-center gap-1.5 font-bold text-foreground"
                                    : "text-foreground/80"
                                }
                              >
                                {day}
                                {isToday && (
                                  <span className="rounded bg-accent/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent">
                                    Today
                                  </span>
                                )}
                              </span>
                              <span
                                className={
                                  isToday
                                    ? "font-bold text-foreground"
                                    : "font-medium text-foreground/90"
                                }
                              >
                                {hours}
                              </span>
                            </Fragment>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </dd>
            </div>
            <div><dt className="text-sm text-muted-foreground">Good to know</dt><dd className="mt-1 text-lg">Free Wi-Fi · Power outlets · Indoor seating · Outdoor tables</dd></div>
          </dl>
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={SITE.mapsUrl} target="_blank" rel="noreferrer" className="rounded-full bg-primary px-7 py-3.5 text-primary-foreground">Get directions</a>
            <a href={SITE.phoneHref} className="rounded-full border border-foreground/20 px-7 py-3.5">Call us</a>
          </div>
        </div>
        <img src={cafeInterior} alt="Little Umbrella cafe interior" className="w-full rounded-2xl object-cover shadow-xl" />
      </div>
      <iframe title="Map to Little Umbrella" src={SITE.mapEmbed} loading="lazy" className="mt-16 h-96 w-full rounded-2xl border border-border" />
    </section>
  );
}
