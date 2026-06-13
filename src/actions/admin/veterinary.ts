"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import type { ActionResult } from "@/actions/shop/types";

function revalidateVetAdmin() {
  revalidatePath("/admin/veterinaria");
  revalidatePath("/veterinaria");
  revalidatePath("/cuenta/citas");
}

function parseHm(value: string): string | null {
  const trimmed = value.trim();
  if (!/^\d{2}:\d{2}$/.test(trimmed)) return null;
  const [hour, minute] = trimmed.split(":").map(Number);
  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) return null;
  return trimmed;
}

function hmToMinutes(value: string): number {
  const [hour, minute] = value.split(":").map(Number);
  return hour * 60 + minute;
}

export async function saveProfessionalWeeklySchedule(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const professionalId = String(formData.get("professionalId") ?? "").trim();
  if (!professionalId) return { ok: false, error: "Profesional no válido." };

  const professional = await db.professional.findFirst({
    where: { id: professionalId, module: "VETERINARY" },
    select: { id: true },
  });
  if (!professional) return { ok: false, error: "Profesional no encontrado." };

  const rows: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    slotMinutes: number;
  }[] = [];

  for (let day = 0; day <= 6; day += 1) {
    const enabled = formData.get(`day_${day}_enabled`) === "on";
    if (!enabled) continue;

    const startTime = parseHm(String(formData.get(`day_${day}_start`) ?? ""));
    const endTime = parseHm(String(formData.get(`day_${day}_end`) ?? ""));
    const slotMinutes = Math.max(
      5,
      Number.parseInt(String(formData.get(`day_${day}_slot`) ?? "30"), 10) || 30,
    );

    if (!startTime || !endTime) {
      return { ok: false, error: "Revisa los horarios de inicio y término." };
    }
    if (hmToMinutes(endTime) <= hmToMinutes(startTime)) {
      return {
        ok: false,
        error: "La hora de término debe ser posterior al inicio.",
      };
    }

    rows.push({ dayOfWeek: day, startTime, endTime, slotMinutes });
  }

  await db.$transaction(async (tx) => {
    await tx.schedule.deleteMany({ where: { professionalId } });
    if (rows.length > 0) {
      await tx.schedule.createMany({
        data: rows.map((row) => ({ professionalId, ...row })),
      });
    }
  });

  revalidateVetAdmin();
  return { ok: true, message: "Horarios actualizados." };
}

export async function updateVeterinaryService(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const id = String(formData.get("id") ?? "").trim();
  const durationMinutes = Math.max(
    5,
    Number.parseInt(String(formData.get("durationMinutes") ?? ""), 10) || 0,
  );
  const price = Math.max(
    0,
    Number.parseInt(String(formData.get("price") ?? ""), 10) || 0,
  );
  const isActive = formData.get("isActive") === "on";

  if (!id) return { ok: false, error: "Servicio no válido." };
  if (durationMinutes < 5) {
    return { ok: false, error: "La duración mínima es 5 minutos." };
  }

  const service = await db.service.findFirst({
    where: { id, module: "VETERINARY" },
    select: { id: true },
  });
  if (!service) return { ok: false, error: "Servicio no encontrado." };

  await db.service.update({
    where: { id },
    data: { durationMinutes, price, isActive },
  });

  revalidateVetAdmin();
  return { ok: true, message: "Servicio actualizado." };
}
