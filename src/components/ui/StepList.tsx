import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

type StepAccent = "milo" | "clinical";

export interface StepListProps {
  steps: string[];
  accent?: StepAccent;
  className?: string;
}

const accentClass: Record<StepAccent, string> = {
  milo: "bg-milo-500",
  clinical: "bg-clinical-500",
};

export function StepList({ steps, accent = "milo", className }: StepListProps) {
  return (
    <ol className={cn("space-y-4", className)}>
      {steps.map((step, index) => (
        <li key={step}>
          <Card className="flex items-center gap-4">
            <span
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold text-white",
                accentClass[accent],
              )}
            >
              {index + 1}
            </span>
            <span className="font-medium">{step}</span>
          </Card>
        </li>
      ))}
    </ol>
  );
}
