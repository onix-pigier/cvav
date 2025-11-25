import Header from "@/components/header";
import Hero from "@/components/hero";
import Footer from "@/components/footer";
import { TeamSection } from "@/components/teams";
import   AboutPage  from "@/components/about";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <AboutPage />
      <TeamSection />
      <Footer />
    </>
  );
}
