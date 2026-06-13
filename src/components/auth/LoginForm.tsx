"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginUser } from "@/actions/auth/login";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export function LoginForm({
  callbackUrl = "/cuenta/perfil",
}: {
  callbackUrl?: string;
}) {
  const [state, action, pending] = useActionState(loginUser, null);

  return (
    <form action={action} className="card-milo space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />

      {state && !state.ok && (
        <Alert variant="error" title="No se pudo iniciar sesión" className="mt-0">
          {state.error}
        </Alert>
      )}

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
        <span className="font-medium">Contraseña</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
        />
      </label>

      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Ingresando..." : "Iniciar sesión"}
      </Button>

      <p className="text-center text-sm text-ink-muted">
        ¿No tienes cuenta?{" "}
        <Link href="/cuenta/registro" className="font-semibold text-milo-700 underline">
          Regístrate
        </Link>
      </p>
    </form>
  );
}
