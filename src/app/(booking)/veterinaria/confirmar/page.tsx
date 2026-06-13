import { AppointmentConfirmation } from "@/components/booking";
import { PageContainer } from "@/components/shared/PageContainer";
import { fetchAppointment } from "@/actions/booking/appointments";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Cita confirmada — Veterinaria",
};

export default async function VeterinaryConfirmPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const appointment = id ? await fetchAppointment(id) : null;

  return (
    <PageContainer size="narrow">
      <AppointmentConfirmation appointment={appointment} />
    </PageContainer>
  );
}
