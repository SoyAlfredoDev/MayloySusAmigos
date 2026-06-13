import { cn } from "@/lib/utils";

export interface BookingProgressProps {
  steps: string[];
  currentStep: number;
  accent?: "milo" | "clinical";
}

export function BookingProgress({
  steps,
  currentStep,
  accent = "milo",
}: BookingProgressProps) {
  const activeClass =
    accent === "clinical" ? "bg-clinical-500" : "bg-milo-500";
  const ringClass =
    accent === "clinical" ? "ring-clinical-200" : "ring-milo-200";

  return (
    <ol className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((label, index) => {
        const isActive = index === currentStep;
        const isDone = index < currentStep;

        return (
          <li
            key={label}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm",
              isActive && `border-transparent ring-2 ${ringClass} bg-white`,
              isDone && "border-milo-200 bg-milo-50",
              !isActive && !isDone && "border-surface-border bg-surface-soft",
            )}
          >
            <span
              className={cn(
                "mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white",
                isActive || isDone ? activeClass : "bg-surface-muted text-ink-muted",
              )}
            >
              {index + 1}
            </span>
            <span className={cn(isActive && "font-semibold text-ink")}>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
