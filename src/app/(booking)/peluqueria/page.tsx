import {
  BookingIntro,
  BookingWizard,
  groomingBookingConfig,
} from "@/components/booking";
import { PageContainer } from "@/components/shared/PageContainer";
import { auth } from "@/auth";
import { getCurrentUserId } from "@/lib/auth/session";
import {
  getProfessionals,
  getServices,
  getUserPets,
} from "@/lib/booking/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Agendar Peluquería",
  description: "Reserva servicios estéticos para tu mascota: baño, corte y más.",
};

export default async function GroomingBookingPage() {
  const { badge, title, description, steps, stepAccent } =
    groomingBookingConfig;

  const session = await auth();
  const userId = await getCurrentUserId();
  const [services, professionals, initialPets] = await Promise.all([
    getServices("GROOMING"),
    getProfessionals("GROOMING"),
    userId ? getUserPets(userId) : Promise.resolve([]),
  ]);

  const initialUser = session?.user?.id
    ? {
        id: session.user.id,
        name: session.user.name ?? "Usuario",
        email: session.user.email ?? "",
      }
    : null;

  return (
    <PageContainer size="narrow">
      <BookingIntro badge={badge} title={title} description={description} />
      <BookingWizard
        config={{
          module: "GROOMING",
          steps,
          accent: stepAccent,
          confirmPath: "/peluqueria/confirmar",
        }}
        specialties={[]}
        services={services}
        professionals={professionals}
        initialPets={initialPets}
        initialUser={initialUser}
      />
    </PageContainer>
  );
}
