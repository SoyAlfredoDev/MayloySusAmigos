import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

type PageContainerSize = "default" | "narrow" | "wide";

const sizeClass: Record<PageContainerSize, string> = {
  default: "max-w-7xl",
  narrow: "max-w-4xl",
  wide: "max-w-7xl",
};

export interface PageContainerProps extends ComponentPropsWithoutRef<"div"> {
  size?: PageContainerSize;
}

export function PageContainer({
  size = "default",
  className,
  children,
  ...props
}: PageContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto px-4 py-10 md:px-6",
        sizeClass[size],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
