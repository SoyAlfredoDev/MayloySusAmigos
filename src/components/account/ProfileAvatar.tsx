"use client";

import { useActionState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CldUploadWidget, type CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { updateUserAvatar } from "@/actions/account/profile";
import { Alert } from "@/components/ui/Alert";

function extractUrl(info: CloudinaryUploadWidgetInfo | string): string | null {
  if (typeof info === "string") return info;
  return info.secure_url ?? null;
}

export interface ProfileAvatarProps {
  avatarUrl: string | null;
  fullName: string;
  initials: string;
}

export function ProfileAvatar({
  avatarUrl,
  fullName,
  initials,
}: ProfileAvatarProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updateUserAvatar, null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset =
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ?? "mailo_products";

  useEffect(() => {
    if (state?.ok) router.refresh();
  }, [state, router]);

  return (
    <div className="relative shrink-0">
      <div className="relative h-28 w-28 md:h-32 md:w-32">
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white via-milo-100 to-milo-200 p-1 shadow-lg">
          {avatarUrl ? (
            <div className="relative h-full w-full overflow-hidden rounded-full">
              <Image
                src={avatarUrl}
                alt={fullName}
                fill
                className="object-cover"
                sizes="128px"
                priority
              />
            </div>
          ) : (
            <div
              className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-milo-50 to-white text-3xl font-extrabold tracking-tight text-milo-800 md:text-4xl"
              aria-hidden
            >
              {initials}
            </div>
          )}
        </div>

        {cloudName ? (
          <CldUploadWidget
            uploadPreset={uploadPreset}
            options={{
              multiple: false,
              maxFiles: 1,
              folder: "mailo/avatars",
              sources: ["local", "camera"],
              cropping: true,
              croppingAspectRatio: 1,
              showSkipCropButton: false,
            }}
            onSuccess={(result) => {
              const url = result.info ? extractUrl(result.info) : null;
              if (!url) return;
              const fd = new FormData();
              fd.set("avatarUrl", url);
              formAction(fd);
            }}
          >
            {({ open }) => (
              <button
                type="button"
                onClick={() => open()}
                disabled={pending}
                className="group absolute inset-0 flex items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                aria-label="Cambiar foto de perfil"
              >
                <span className="absolute inset-0 rounded-full bg-ink/0 transition-colors group-hover:bg-ink/40" />
                <span className="relative rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-ink opacity-0 shadow-md transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  {pending ? "Guardando…" : "Cambiar foto"}
                </span>
              </button>
            )}
          </CldUploadWidget>
        ) : (
          <p className="absolute -bottom-8 left-1/2 w-40 -translate-x-1/2 text-center text-[10px] text-milo-100">
            Cloudinary no configurado
          </p>
        )}
      </div>

      {avatarUrl && (
        <form action={formAction} className="mt-3 text-center">
          <input type="hidden" name="avatarUrl" value="" />
          <button
            type="submit"
            disabled={pending}
            className="text-xs font-semibold text-milo-100 underline-offset-2 hover:text-white hover:underline disabled:opacity-60"
          >
            Quitar foto
          </button>
        </form>
      )}

      {state && !state.ok && (
        <Alert variant="error" title="Error" className="absolute left-0 top-full z-10 mt-3 w-56">
          {state.error}
        </Alert>
      )}
    </div>
  );
}
