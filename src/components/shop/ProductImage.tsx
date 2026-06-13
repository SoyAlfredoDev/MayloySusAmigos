import { cn } from "@/lib/utils";

export interface ProductImageProps {
  src: string | null;
  alt: string;
  className?: string;
}

export function ProductImage({ src, alt, className }: ProductImageProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className={cn("aspect-square w-full object-cover", className)}
        loading="lazy"
      />
    );
  }

  return (
    <div
      className={cn(
        "flex aspect-square w-full items-center justify-center bg-milo-50 text-4xl",
        className,
      )}
      aria-hidden
    >
      🐾
    </div>
  );
}
