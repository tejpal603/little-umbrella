import React, { useState } from "react";
import {
  Coffee,
  Sun,
  Wifi,
  Plug,
  ShoppingBag,
  Star,
  Flame,
  Snowflake,
  Sparkles,
  Heart,
  MapPin,
  Clock,
  Phone,
  Check,
  Plus,
  Minus,
  ArrowRight,
  ChevronDown,
  type LucideProps,
} from "lucide-react";

export type IconAnimationType =
  | "sway"
  | "steam"
  | "sun"
  | "wifi"
  | "plug"
  | "star"
  | "flame"
  | "snowflake"
  | "sparkle"
  | "cart"
  | "heart"
  | "pin"
  | "clock"
  | "phone"
  | "float";

export type AnimationTrigger = "ambient" | "hover" | "click" | "both";

interface AnimatedIconWrapperProps extends React.HTMLAttributes<HTMLSpanElement> {
  animation?: IconAnimationType;
  trigger?: AnimationTrigger;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedIconWrapper({
  animation = "float",
  trigger = "hover",
  children,
  className = "",
  onClick,
  ...props
}: AnimatedIconWrapperProps) {
  const [clicked, setClicked] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLSpanElement>) => {
    setClicked(true);
    setTimeout(() => setClicked(false), 450);
    if (onClick) onClick(e);
  };

  const getAnimationClass = () => {
    if (trigger === "ambient") return `anim-${animation}`;
    if (trigger === "hover") return `hover-anim-${animation} group-anim-${animation}`;
    if (trigger === "both") return `anim-${animation} hover-anim-${animation} group-anim-${animation}`;
    return "";
  };

  return (
    <span
      className={`inline-flex items-center justify-center transition-transform duration-200 select-none ${getAnimationClass()} ${
        clicked ? "scale-125 rotate-6" : ""
      } ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </span>
  );
}

/* Custom Little Umbrella SVG Icon */
export function UmbrellaIcon({ className = "", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 24" className={className} aria-hidden fill="currentColor" {...props}>
      <path d="M20 1C10 1 2 8 1 17c2-2 5-2 6.5 0 1.5-2 5-2 6.5 0 1.5-2 4.5-2 6 0 1.5-2 4.5-2 6 0 1.5-2 5-2 6.5 0 1.5-2 4.5-2 6.5 0C38 8 30 1 20 1z" />
    </svg>
  );
}

/* Specialized Animated Components with Default Styling & Triggers */

export function AnimatedUmbrella({
  className = "h-6 w-9 text-sun",
  trigger = "hover",
}: {
  className?: string;
  trigger?: AnimationTrigger;
}) {
  return (
    <AnimatedIconWrapper animation="sway" trigger={trigger}>
      <UmbrellaIcon className={className} />
    </AnimatedIconWrapper>
  );
}

export function AnimatedCoffee({
  className = "h-5 w-5 text-accent",
  trigger = "hover",
  ...props
}: LucideProps & { trigger?: AnimationTrigger }) {
  return (
    <AnimatedIconWrapper animation="steam" trigger={trigger}>
      <Coffee className={className} {...props} />
    </AnimatedIconWrapper>
  );
}

export function AnimatedSun({
  className = "h-5 w-5 text-sun",
  trigger = "hover",
  ...props
}: LucideProps & { trigger?: AnimationTrigger }) {
  return (
    <AnimatedIconWrapper animation="sun" trigger={trigger}>
      <Sun className={className} {...props} />
    </AnimatedIconWrapper>
  );
}

export function AnimatedWifi({
  className = "h-5 w-5 text-accent",
  trigger = "hover",
  ...props
}: LucideProps & { trigger?: AnimationTrigger }) {
  return (
    <AnimatedIconWrapper animation="wifi" trigger={trigger}>
      <Wifi className={className} {...props} />
    </AnimatedIconWrapper>
  );
}

export function AnimatedPlug({
  className = "h-5 w-5 text-accent",
  trigger = "hover",
  ...props
}: LucideProps & { trigger?: AnimationTrigger }) {
  return (
    <AnimatedIconWrapper animation="plug" trigger={trigger}>
      <Plug className={className} {...props} />
    </AnimatedIconWrapper>
  );
}

export function AnimatedShoppingBag({
  className = "w-5 h-5",
  trigger = "hover",
  ...props
}: LucideProps & { trigger?: AnimationTrigger }) {
  return (
    <AnimatedIconWrapper animation="cart" trigger={trigger}>
      <ShoppingBag className={className} {...props} />
    </AnimatedIconWrapper>
  );
}

export function AnimatedStar({
  className = "h-4 w-4 fill-current",
  trigger = "hover",
  ...props
}: LucideProps & { trigger?: AnimationTrigger }) {
  return (
    <AnimatedIconWrapper animation="star" trigger={trigger}>
      <Star className={className} {...props} />
    </AnimatedIconWrapper>
  );
}

export function AnimatedFlame({
  className = "w-4 h-4 text-orange-500",
  trigger = "hover",
  ...props
}: LucideProps & { trigger?: AnimationTrigger }) {
  return (
    <AnimatedIconWrapper animation="flame" trigger={trigger}>
      <Flame className={className} {...props} />
    </AnimatedIconWrapper>
  );
}

export function AnimatedSnowflake({
  className = "w-4 h-4 text-sky-500",
  trigger = "hover",
  ...props
}: LucideProps & { trigger?: AnimationTrigger }) {
  return (
    <AnimatedIconWrapper animation="snowflake" trigger={trigger}>
      <Snowflake className={className} {...props} />
    </AnimatedIconWrapper>
  );
}

export function AnimatedSparkles({
  className = "w-4 h-4 text-sun",
  trigger = "hover",
  ...props
}: LucideProps & { trigger?: AnimationTrigger }) {
  return (
    <AnimatedIconWrapper animation="sparkle" trigger={trigger}>
      <Sparkles className={className} {...props} />
    </AnimatedIconWrapper>
  );
}

export function AnimatedHeart({
  className = "w-4 h-4 text-rose-500",
  trigger = "hover",
  ...props
}: LucideProps & { trigger?: AnimationTrigger }) {
  return (
    <AnimatedIconWrapper animation="heart" trigger={trigger}>
      <Heart className={className} {...props} />
    </AnimatedIconWrapper>
  );
}

export function AnimatedMapPin({
  className = "w-4 h-4 text-accent",
  trigger = "hover",
  ...props
}: LucideProps & { trigger?: AnimationTrigger }) {
  return (
    <AnimatedIconWrapper animation="pin" trigger={trigger}>
      <MapPin className={className} {...props} />
    </AnimatedIconWrapper>
  );
}

export function AnimatedClock({
  className = "w-4 h-4 text-muted-foreground",
  trigger = "hover",
  ...props
}: LucideProps & { trigger?: AnimationTrigger }) {
  return (
    <AnimatedIconWrapper animation="clock" trigger={trigger}>
      <Clock className={className} {...props} />
    </AnimatedIconWrapper>
  );
}

export function AnimatedPhone({
  className = "w-4 h-4 text-accent",
  trigger = "hover",
  ...props
}: LucideProps & { trigger?: AnimationTrigger }) {
  return (
    <AnimatedIconWrapper animation="phone" trigger={trigger}>
      <Phone className={className} {...props} />
    </AnimatedIconWrapper>
  );
}

export {
  Coffee,
  Sun,
  Wifi,
  Plug,
  ShoppingBag,
  Star,
  Flame,
  Snowflake,
  Sparkles,
  Heart,
  MapPin,
  Clock,
  Phone,
  Check,
  Plus,
  Minus,
  ArrowRight,
  ChevronDown,
};
