import { StepList } from "@/components/ui/StepList";
import type { StepListProps } from "@/components/ui/StepList";

export interface BookingStepListProps {
  steps: string[];
  accent?: StepListProps["accent"];
}

export function BookingStepList({ steps, accent = "milo" }: BookingStepListProps) {
  return <StepList steps={steps} accent={accent} className="mt-8" />;
}
