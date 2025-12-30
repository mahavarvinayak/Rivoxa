import { Background } from "@/components/landing/Background";
import { CTA } from "@/components/landing/CTA";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Integrations } from "@/components/landing/Integrations";
import { Navbar } from "@/components/landing/Navbar";

export default function Landing() {
  return (
    <div className="min-h-screen relative">
      <Background />
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Integrations />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}