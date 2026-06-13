import { AccountPageHeader } from "@/components/account";
import { AppointmentsList } from "@/components/booking";
import { fetchUserAppointments } from "@/actions/booking/appointments";

export const dynamic = "force-dynamic";

export const metadata = { title: "Mis Citas" };

export default async function AppointmentsPage() {
  const appointments = await fetchUserAppointments();

  return (
    <div>
      <AccountPageHeader
        title="Mis citas"
        description="Citas activas y pasadas de veterinaria y peluquería."
      />
      <AppointmentsList appointments={appointments} />
    </div>
  );
}
