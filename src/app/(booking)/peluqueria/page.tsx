import {
  BookingIntro,
  BookingStepList,
  groomingBookingConfig,
} from "@/components/booking";
import { PageContainer } from "@/components/shared/PageContainer";

export const metadata = {
  title: "Agendar Peluquería",
  description: "Reserva servicios estéticos para tu mascota: baño, corte y más.",
};

export default function GroomingBookingPage() {
  const { badge, title, description, steps, stepAccent } =
    groomingBookingConfig;

  return (
    <PageContainer size="narrow">
      <BookingIntro badge={badge} title={title} description={description} />
      <BookingStepList steps={[...steps]} accent={stepAccent} />
    </PageContainer>
  );
}
