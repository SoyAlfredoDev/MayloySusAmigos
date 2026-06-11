import { Badge } from "@/components/ui/Badge";

export interface BookingIntroProps {
  badge: string;
  title: string;
  description: string;
}

export function BookingIntro({ badge, title, description }: BookingIntroProps) {
  return (
    <div>
      <Badge>{badge}</Badge>
      <h1 className="section-title mt-4">{title}</h1>
      <p className="mt-2 text-ink-muted">{description}</p>
    </div>
  );
}
