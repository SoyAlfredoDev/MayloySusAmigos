"use client";

import { useState } from "react";
import { CldUploadWidget, type CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { Button } from "@/components/ui/Button";
import { ProductImage } from "@/components/shop/ProductImage";

export interface CloudinaryImageUploadProps {
  name?: string;
  defaultUrls?: string[];
  label?: string;
}

function extractUrl(info: CloudinaryUploadWidgetInfo | string): string | null {
  if (typeof info === "string") return info;
  return info.secure_url ?? null;
}

export function CloudinaryImageUpload({
  name = "imageUrls",
  defaultUrls = [],
  label = "Imágenes del producto",
}: CloudinaryImageUploadProps) {
  const [urls, setUrls] = useState<string[]>(defaultUrls);
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "mailo_products";
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

  function removeUrl(index: number) {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  }

  if (!cloudName) {
    return (
      <div className="rounded-lg border-2 border-dashed border-ink/15 bg-surface-muted p-4">
        <p className="text-sm font-semibold text-ink">{label}</p>
        <p className="mt-2 text-sm text-ink-muted">
          Configura{" "}
          <code className="rounded bg-surface px-1">
            NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
          </code>{" "}
          y{" "}
          <code className="rounded bg-surface px-1">
            NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
          </code>{" "}
          en <code className="rounded bg-surface px-1">.env</code>. Ver{" "}
          <strong>docs/CLOUDINARY.md</strong>
        </p>
      </div>
    );
  }
  return (
    <div>
      <span className="text-sm font-semibold text-ink">{label}</span>
      <input type="hidden" name={name} value={urls.join("\n")} />

      {urls.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-3">
          {urls.map((url, index) => (
            <li key={url} className="relative">
              <div className="h-20 w-20 overflow-hidden rounded-lg border-2 border-ink/10">
                <ProductImage
                  src={url}
                  alt={`Imagen ${index + 1}`}
                  className="h-full w-full rounded-lg"
                />
              </div>
              <button
                type="button"
                onClick={() => removeUrl(index)}
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-clinical-500 text-xs font-bold text-white"
                aria-label="Quitar imagen"
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3">
        <CldUploadWidget
          uploadPreset={uploadPreset}
          options={{
            multiple: true,
            maxFiles: 5,
            folder: "mailo/productos",
            sources: ["local", "url", "camera"],
          }}
          onSuccess={(result) => {
            if (!result.info) return;
            const url = extractUrl(result.info);
            if (url) setUrls((prev) => [...prev, url]);
          }}
        >
          {({ open }) => (
            <Button type="button" variant="primary" size="sm" onClick={() => open()}>
              Subir imagen con Cloudinary
            </Button>
          )}
        </CldUploadWidget>
      </div>

      <p className="mt-2 text-xs text-ink-muted">
        Sube hasta 5 imágenes. Se guardan en tu cuenta Cloudinary.
      </p>
    </div>
  );
}
