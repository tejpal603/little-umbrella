export const SITE = {
  name: "Little Umbrella",
  address: "4372 W 10th Ave, Vancouver, BC V6R 2H7",
  phone: "+1 778-452-5831",
  phoneHref: "tel:+17784525831",
  email: "hello@yourlittleumbrella.com",
  emailHref: "mailto:hello@yourlittleumbrella.com",
  facebookUrl: "https://www.facebook.com",
  instagramUrl: "https://www.instagram.com/_littleumbrella/?__pwa=1",
  instagramHandle: "@_littleumbrella",
  // TODO: replace with the exact Google ordering link
  orderUrl: "https://www.google.com/maps/search/?api=1&query=Little+Umbrella+4372+W+10th+Ave+Vancouver",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Little+Umbrella+4372+W+10th+Ave+Vancouver",
  mapEmbed: "https://www.google.com/maps?q=Little+Umbrella,+4372+W+10th+Ave,+Vancouver,+BC&output=embed",
};

export const HOURS = [
  { day: "Monday", hours: "7 AM–5:30 PM" },
  { day: "Tuesday", hours: "7 AM–5:30 PM" },
  { day: "Wednesday", hours: "7 AM–5:30 PM" },
  { day: "Thursday", hours: "7 AM–5:30 PM" },
  { day: "Friday", hours: "7 AM–5:30 PM" },
  { day: "Saturday", hours: "7:30 AM–5 PM" },
  { day: "Sunday", hours: "7:30 AM–4 PM" },
];

export function getCafeStatus() {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Vancouver",
      weekday: "long",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    });
    const parts = formatter.formatToParts(new Date());
    const weekday = parts.find((p) => p.type === "weekday")?.value || "Friday";
    const hour = parseInt(parts.find((p) => p.type === "hour")?.value || "0", 10);
    const minute = parseInt(parts.find((p) => p.type === "minute")?.value || "0", 10);
    const currentMins = hour * 60 + minute;

    // Schedule:
    // Mon-Fri: 7:00 AM (420) - 5:30 PM (1050)
    // Sat: 7:30 AM (450) - 5:00 PM (1020)
    // Sun: 7:30 AM (450) - 4:00 PM (960)
    let openMins = 420;
    let closeMins = 1050;
    let openLabel = "7 AM";
    let closeLabel = "5:30 PM";

    if (weekday === "Saturday") {
      openMins = 450;
      closeMins = 1020;
      openLabel = "7:30 AM";
      closeLabel = "5 PM";
    } else if (weekday === "Sunday") {
      openMins = 450;
      closeMins = 960;
      openLabel = "7:30 AM";
      closeLabel = "4 PM";
    }

    const isOpen = currentMins >= openMins && currentMins < closeMins;
    let nextInfo = "";
    if (isOpen) {
      nextInfo = `Closes ${closeLabel}`;
    } else if (currentMins < openMins) {
      nextInfo = `Opens ${openLabel}`;
    } else {
      const nextOpen = weekday === "Friday" ? "7:30 AM Sat" : weekday === "Saturday" ? "7:30 AM Sun" : weekday === "Sunday" ? "7 AM Mon" : "7 AM";
      nextInfo = `Opens ${nextOpen}`;
    }

    return {
      isOpen,
      todayDayName: weekday,
      statusLabel: isOpen ? "Open" : "Closed",
      statusDetail: nextInfo,
    };
  } catch {
    return {
      isOpen: false,
      todayDayName: "Friday",
      statusLabel: "Closed",
      statusDetail: "Opens 7 AM",
    };
  }
}

