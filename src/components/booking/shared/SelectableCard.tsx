import { cn } from "@/lib/utils";

export interface SelectableCardProps {
  title: string;
  description?: string | null;
  meta?: string;
  selected?: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

export function SelectableCard({
  title,
  description,
  meta,
  selected = false,
  onClick,
  disabled = false,
}: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "card-milo w-full text-left transition-all",
        selected && "border-milo-500 ring-2 ring-milo-200",
        disabled && "cursor-not-allowed opacity-50",
        !disabled && "hover:border-milo-300 hover:shadow-card-hover",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-ink">{title}</p>
          {description && (
            <p className="mt-1 text-sm text-ink-muted">{description}</p>
          )}
        </div>
        {meta && (
          <span className="shrink-0 text-sm font-medium text-milo-700">
            {meta}
          </span>
        )}
      </div>
    </button>
  );
}
