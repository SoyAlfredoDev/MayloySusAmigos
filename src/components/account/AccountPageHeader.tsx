export interface AccountPageHeaderProps {
  title: string;
  description?: string;
}

export function AccountPageHeader({ title, description }: AccountPageHeaderProps) {
  return (
    <div>
      <h1 className="section-title">{title}</h1>
      {description && <p className="mt-2 text-ink-muted">{description}</p>}
    </div>
  );
}
