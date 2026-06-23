import { Navbar } from "./components/Navbar";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans">
      <Navbar />
      <section className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-[#0a192f] text-center mb-12">
          Destacados de Funciones
        </h2>
      </section>
    </div>
  );
}
