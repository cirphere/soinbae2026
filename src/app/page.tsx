import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import OrganizationSection from "@/components/OrganizationSection";
import TimelineSection from "@/components/TimelineSection";
import RecruitingSection from "@/components/RecruitingSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import CareerTestSection from "@/components/CareerTestSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <OrganizationSection />
      <TimelineSection />
      <RecruitingSection />
      <ShowcaseSection />
      <CareerTestSection />
      <Footer />
    </div>
  );
};

export default Index;
