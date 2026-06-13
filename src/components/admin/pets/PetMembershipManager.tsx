"use client";

import { useActionState, useMemo, useState } from "react";
import {
  linkPetMembership,
  unlinkPetMembership,
} from "@/actions/admin/pet-memberships";
import type { ActionResult } from "@/actions/shop/types";
import type {
  AdminPetMembershipRow,
  AdminPetOption,
  AdminUserOption,
} from "@/lib/admin/pets/queries";
import {
  petMembershipRoleLabels,
  petSpeciesLabels,
} from "@/lib/booking/labels";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/config/site";

const initial: ActionResult | null = null;

function formatUserLabel(user: AdminUserOption): string {
  const fullName = [user.name, user.lastName].filter(Boolean).join(" ");
  return `${fullName} · ${user.email}`;
}

function formatPetLabel(pet: AdminPetOption): string {
  const species = petSpeciesLabels[pet.species];
  return `${pet.name} (${species}${pet.breed ? ` · ${pet.breed}` : ""})`;
}

function formatPersonName(name: string, lastName: string | null): string {
  return [name, lastName].filter(Boolean).join(" ");
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat(siteConfig.locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function PetMembershipManager({
  users,
  pets,
  memberships,
}: {
  users: AdminUserOption[];
  pets: AdminPetOption[];
  memberships: AdminPetMembershipRow[];
}) {
  const [linkState, linkAction, linkPending] = useActionState(
    linkPetMembership,
    initial,
  );
  const [filter, setFilter] = useState("");

  const [selectedUserId, setSelectedUserId] = useState("");

  const linkedPetIdsForUser = useMemo(() => {
    if (!selectedUserId) return new Set<string>();
    return new Set(
      memberships
        .filter((row) => row.userId === selectedUserId)
        .map((row) => row.petId),
    );
  }, [memberships, selectedUserId]);

  const availablePets = useMemo(
    () => pets.filter((pet) => !linkedPetIdsForUser.has(pet.id)),
    [pets, linkedPetIdsForUser],
  );

  const filteredMemberships = useMemo(() => {
    const query = filter.trim().toLowerCase();
    if (!query) return memberships;

    return memberships.filter((row) => {
      const userName = formatPersonName(row.user.name, row.user.lastName);
      const haystack = [
        userName,
        row.user.email,
        row.pet.name,
        petSpeciesLabels[row.pet.species],
        row.pet.breed ?? "",
        petMembershipRoleLabels[row.role],
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });
  }, [memberships, filter]);

  return (
    <div className="space-y-8">
      <Card>
        <h2 className="text-lg font-semibold text-ink">Vincular mascota</h2>
        <p className="mt-1 text-sm text-ink-muted">
          Selecciona un tutor y una mascota para crear la asociación. El usuario
          podrá ver la mascota en su cuenta y agendar citas.
        </p>

        <form action={linkAction} className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="block text-sm md:col-span-2">
            <span className="font-medium">Usuario (tutor)</span>
            <select
              name="userId"
              required
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
              className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
            >
              <option value="">Seleccionar usuario...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {formatUserLabel(user)}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm md:col-span-2">
            <span className="font-medium">Mascota</span>
            <select
              name="petId"
              required
              disabled={!selectedUserId || availablePets.length === 0}
              className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2 disabled:opacity-60"
            >
              <option value="">
                {!selectedUserId
                  ? "Primero elige un usuario"
                  : availablePets.length === 0
                    ? "Sin mascotas disponibles para vincular"
                    : "Seleccionar mascota..."}
              </option>
              {availablePets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {formatPetLabel(pet)}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="font-medium">Rol</span>
            <select
              name="role"
              defaultValue="OWNER"
              className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
            >
              <option value="OWNER">{petMembershipRoleLabels.OWNER}</option>
              <option value="CAREGIVER">
                {petMembershipRoleLabels.CAREGIVER}
              </option>
            </select>
          </label>

          <label className="flex items-center gap-2 self-end text-sm">
            <input name="isPrimary" type="checkbox" />
            <span>Marcar como tutor principal de la mascota</span>
          </label>

          <div className="md:col-span-2">
            <Button type="submit" disabled={linkPending || !selectedUserId}>
              {linkPending ? "Vinculando..." : "Vincular mascota"}
            </Button>
          </div>
        </form>

        {linkState && !linkState.ok && (
          <Alert variant="error" title="No se pudo vincular" className="mt-4">
            {linkState.error}
          </Alert>
        )}
        {linkState?.ok && (
          <Alert variant="info" title="Listo" className="mt-4">
            {linkState.message}
          </Alert>
        )}
      </Card>

      <Card>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-ink">
              Asociaciones activas
            </h2>
            <p className="mt-1 text-sm text-ink-muted">
              {memberships.length} vínculo(s) entre tutores y mascotas.
            </p>
          </div>
          <label className="block min-w-[220px] flex-1 text-sm sm:max-w-xs">
            <span className="font-medium">Buscar</span>
            <input
              type="search"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              placeholder="Nombre, correo o mascota..."
              className="mt-1 w-full rounded-lg border border-surface-border px-3 py-2"
            />
          </label>
        </div>

        {filteredMemberships.length === 0 ? (
          <p className="mt-6 text-sm text-ink-muted">
            {memberships.length === 0
              ? "Aún no hay asociaciones registradas."
              : "Ninguna asociación coincide con la búsqueda."}
          </p>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-surface-border text-xs uppercase tracking-wide text-ink-light">
                  <th className="py-3 pr-4">Tutor</th>
                  <th className="py-3 pr-4">Mascota</th>
                  <th className="py-3 pr-4">Rol</th>
                  <th className="py-3 pr-4">Desde</th>
                  <th className="py-3">Acción</th>
                </tr>
              </thead>
              <tbody>
                {filteredMemberships.map((row) => (
                  <MembershipRow key={row.id} row={row} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function MembershipRow({ row }: { row: AdminPetMembershipRow }) {
  const [state, action, pending] = useActionState(unlinkPetMembership, initial);

  return (
    <tr className="border-b border-surface-border/70">
      <td className="py-3 pr-4">
        <p className="font-medium text-ink">
          {formatPersonName(row.user.name, row.user.lastName)}
        </p>
        <p className="text-xs text-ink-muted">{row.user.email}</p>
      </td>
      <td className="py-3 pr-4">
        <p className="font-medium text-ink">{row.pet.name}</p>
        <p className="text-xs text-ink-muted">
          {petSpeciesLabels[row.pet.species]}
          {row.pet.breed ? ` · ${row.pet.breed}` : ""}
        </p>
      </td>
      <td className="py-3 pr-4">
        <span className="rounded-pill bg-surface-muted px-2 py-1 text-xs font-semibold">
          {petMembershipRoleLabels[row.role]}
        </span>
        {row.isPrimary && (
          <span className="mt-1 block text-xs font-medium text-milo-700">
            Principal
          </span>
        )}
      </td>
      <td className="py-3 pr-4 text-ink-muted">
        {formatDate(row.createdAt)}
      </td>
      <td className="py-3">
        <form action={action}>
          <input type="hidden" name="membershipId" value={row.id} />
          <Button
            type="submit"
            variant="ghost"
            size="sm"
            disabled={pending}
            onClick={(event) => {
              const ok = window.confirm(
                `¿Desvincular a ${row.pet.name} de ${formatPersonName(row.user.name, row.user.lastName)}?`,
              );
              if (!ok) event.preventDefault();
            }}
          >
            {pending ? "..." : "Desvincular"}
          </Button>
        </form>
        {state && !state.ok && (
          <p className="mt-1 text-xs text-clinical-600">{state.error}</p>
        )}
      </td>
    </tr>
  );
}
