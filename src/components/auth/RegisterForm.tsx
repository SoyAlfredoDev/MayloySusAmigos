"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerUser } from "@/actions/auth/register";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export function RegisterForm({
  callbackUrl = "/cuenta/perfil",
}: {
  callbackUrl?: string;
}) {
  const [state, action, pending] = useActionState(registerUser, null);
  const loginHref = callbackUrl
    ? `/cuenta/ingresar?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/cuenta/ingresar";

  return (
    <form action={action} className="card-milo space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      {state?.ok && (
        <Alert variant="info" title="Cuenta creada" className="mt-0">
          {state.message}{" "}
          <Link href={loginHref} className="font-semibold underline">
            Iniciar sesión
          </Link>
        </Alert>
      )}

      {state && !state.ok && (
        <Alert variant="error" title="Revisa los datos" className="mt-0">
          {state.error}
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="font-medium">Nombre</span>
          <input
            name="name"
            required
            autoComplete="given-name"
            className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
          />
        </label>
        <label className="block text-sm">
          <span className="font-medium">Apellido</span>
          <input
            name="lastName"
            autoComplete="family-name"
            className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="font-medium">Correo</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium">Teléfono</span>
        <input
          name="phone"
          required
          autoComplete="tel"
          className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
        />
      </label>

      <label className="block text-sm">
        <span className="font-medium">Contraseña</span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
        />
        <span className="mt-1 block text-xs text-ink-muted">
          Mínimo 8 caracteres, con letras y números.
        </span>
      </label>

      <label className="block text-sm">
        <span className="font-medium">Confirmar contraseña</span>
        <input
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
        />
      </label>

      <label className="flex items-start gap-2 text-sm">
        <input
          name="privacyConsent"
          type="checkbox"
          required
          className="mt-1"
        />
        <span>
          Acepto el tratamiento de mis datos personales conforme a la Ley 19.628
          (Chile) para gestionar citas, mascotas y comunicaciones del servicio.
        </span>
      </label>

      <label className="flex items-start gap-2 text-sm text-ink-muted">
        <input name="marketingConsent" type="checkbox" className="mt-1" />
        <span>Deseo recibir novedades y promociones (opcional).</span>
      </label>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Creando cuenta..." : "Crear cuenta"}
      </Button>

      <p className="text-center text-sm text-ink-muted">
        ¿Ya tienes cuenta?{" "}
        <Link href={loginHref} className="font-semibold text-milo-700 underline">
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}
