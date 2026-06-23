import { Footer } from "./components/Footer";
import { HeroSection } from "./components/HeroSection";
import { Navbar } from "./components/Navbar";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans flex flex-col">
      {" "}
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
      </main>
      <Footer />
    </div>
  );
}
