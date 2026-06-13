import {
  BookingIntro,
  BookingWizard,
  veterinaryBookingConfig,
} from "@/components/booking";
import { PageContainer } from "@/components/shared/PageContainer";
import { auth } from "@/auth";
import { getCurrentUserId } from "@/lib/auth/session";
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

  const session = await auth();
  const userId = await getCurrentUserId();
  const [specialties, services, professionals, initialPets] = await Promise.all([
    getSpecialties("VETERINARY"),
    getServices("VETERINARY"),
    getProfessionals("VETERINARY"),
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
    <PageContainer>
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
        initialUser={initialUser}
      />
    </PageContainer>
  );
}
