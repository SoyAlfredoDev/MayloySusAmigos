import {
  BookingIntro,
  BookingStepList,
  veterinaryBookingConfig,
} from "@/components/booking";
import { PageContainer } from "@/components/shared/PageContainer";

export const metadata = {
  title: "Agendar Veterinaria",
  description: "Reserva consultas médicas con nuestros veterinarios especialistas.",
};

export default function VeterinaryBookingPage() {
  const { badge, title, description, steps, stepAccent } =
    veterinaryBookingConfig;

  return (
    <PageContainer size="narrow">
      <BookingIntro badge={badge} title={title} description={description} />
      <BookingStepList steps={[...steps]} accent={stepAccent} />
    </PageContainer>
  );
}
