import { AppointmentConfirmation } from "@/components/booking";
import { PageContainer } from "@/components/shared/PageContainer";
import { fetchAppointment } from "@/actions/booking/appointments";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reserva confirmada — Peluquería",
};

export default async function GroomingConfirmPage({
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
