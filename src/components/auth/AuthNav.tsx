"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function AuthNav() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <span className="text-sm text-ink-muted">...</span>
    );
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href="/cuenta/perfil"
          className="hidden text-sm font-medium text-ink-muted sm:inline"
        >
          {session.user.name ?? session.user.email}
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          Salir
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/cuenta/ingresar"
        className="rounded-pill px-3 py-2 text-sm font-semibold text-ink-muted hover:bg-surface-muted"
      >
        Ingresar
      </Link>
      <Link href="/cuenta/registro" className="btn-cta text-sm">
        Registrarse
      </Link>
    </div>
  );
}
