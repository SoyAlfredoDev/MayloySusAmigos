import {
  BookingIntro,
  BookingWizard,
  groomingBookingConfig,
} from "@/components/booking";
import { PageContainer } from "@/components/shared/PageContainer";
import { getBookingUserId } from "@/lib/booking/session";
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

  const userId = await getBookingUserId();
  const [services, professionals, initialPets] = await Promise.all([
    getServices("GROOMING"),
    getProfessionals("GROOMING"),
    userId ? getUserPets(userId) : Promise.resolve([]),
  ]);

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
      />
    </PageContainer>
  );
}
