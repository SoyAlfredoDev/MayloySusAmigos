import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "cta" | "ghost";
type ButtonSize = "sm" | "md";

export interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  external?: boolean;
}

const variantClass: Record<ButtonVariant, string> = {
  primary: "btn-primary",
  cta: "btn-cta",
  ghost:
    "inline-flex items-center justify-center rounded-pill px-4 py-2 font-semibold text-ink-muted hover:bg-surface-muted",
};

const sizeClass: Record<ButtonSize, string> = {
  sm: "text-sm px-4 py-2",
  md: "",
};

export function Button({
  variant = "primary",
  size = "md",
  href,
  external,
  className,
  children,
  ...props
}: ButtonProps) {
  const classes = cn(variantClass[variant], sizeClass[size], className);

  if (href) {
    return (
      <Link
        href={href}
        className={classes}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
      >
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
