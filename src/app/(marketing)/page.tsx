import { FloatingPaws } from "@/components/marketing/FloatingPaws";
import { HeroSection } from "@/components/marketing/HeroSection";
import { ServiceModulesGrid } from "@/components/marketing/ServiceModulesGrid";
import { PageContainer } from "@/components/shared/PageContainer";
import { PageTransition } from "@/components/shared/PageTransition";

export default function HomePage() {
  return (
    <PageTransition>
      <div className="relative overflow-hidden">
        <FloatingPaws />
        <PageContainer className="relative py-16 md:py-24">
          <HeroSection />
          <ServiceModulesGrid />
        </PageContainer>
      </div>
    </PageTransition>
  );
}
