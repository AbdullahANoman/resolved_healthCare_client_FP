import CTA from "@/components/HomePage/CTA/CTA";
import HeroSection from "@/components/HomePage/HeroSection/HeroSection";
import HowItWorks from "@/components/HomePage/HowItWorks/HowItWorks";
import Specialist from "@/components/HomePage/Specialist/Specialist";
import Stats from "@/components/HomePage/Stats/Stats";
import Testimonials from "@/components/HomePage/Testimonials/Testimonials";
import TopRatedDoctors from "@/components/HomePage/TopRatedDoctors/TopRatedDoctors";
import WhyUs from "@/components/HomePage/WhyUs/WhyUs";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <Specialist />
      <WhyUs />
      <Stats />
      <TopRatedDoctors />
      <HowItWorks />
      <Testimonials />
      <CTA />
    </>
  );
};

export default HomePage;
