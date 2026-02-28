import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import OrganizationSection from "@/components/OrganizationSection";
import TimelineSection from "@/components/TimelineSection";
import RecruitingSection from "@/components/RecruitingSection";
import ShowcaseSection from "@/components/ShowcaseSection";
import CareerTestSection from "@/components/CareerTestSection";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SoInBae",
  description: "전남대학교 인공지능학부 동아리 AIM 소인배 팀 소개 사이트",
  openGraph: {
    title: "SoInBae",
    description: "전남대학교 인공지능학부 동아리 AIM 소인배 팀 소개 사이트",
    images: ["/soinbae.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "SoInBae",
    description: "전남대학교 인공지능학부 동아리 AIM 소인배 팀 소개 사이트",
    images: ["/soinbae.png"],
  },
};

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
