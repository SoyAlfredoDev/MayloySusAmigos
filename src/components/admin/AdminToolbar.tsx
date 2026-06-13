import { cn } from "@/lib/utils";
import type { ComponentPropsWithoutRef } from "react";

export function AdminToolbar({
  className,
  children,
  ...props
}: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("mt-6 flex flex-wrap items-center gap-3", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export const adminToolbarButtonClass =
  "min-w-[9.5rem] justify-center text-center";
