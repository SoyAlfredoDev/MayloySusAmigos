import {
  BookingIntro,
  BookingWizard,
  veterinaryBookingConfig,
} from "@/components/booking";
import { PageContainer } from "@/components/shared/PageContainer";
import { getBookingUserId } from "@/lib/booking/session";
import {
  getProfessionals,
  getServices,
  getSpecialties,
  getUserPets,
} from "@/lib/booking/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Agendar Veterinaria",
  description: "Reserva consultas médicas con nuestros veterinarios especialistas.",
};

export default async function VeterinaryBookingPage() {
  const { badge, title, description, steps, stepAccent } =
    veterinaryBookingConfig;

  const userId = await getBookingUserId();
  const [specialties, services, professionals, initialPets] = await Promise.all([
    getSpecialties("VETERINARY"),
    getServices("VETERINARY"),
    getProfessionals("VETERINARY"),
    userId ? getUserPets(userId) : Promise.resolve([]),
  ]);

  return (
    <PageContainer size="narrow">
      <BookingIntro badge={badge} title={title} description={description} />
      <BookingWizard
        config={{
          module: "VETERINARY",
          steps,
          accent: stepAccent,
          confirmPath: "/veterinaria/confirmar",
        }}
        specialties={specialties}
        services={services}
        professionals={professionals}
        initialPets={initialPets}
      />
    </PageContainer>
  );
}
