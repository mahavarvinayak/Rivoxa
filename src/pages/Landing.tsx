import { BackgroundOrbs } from "@/components/landing/BackgroundOrbs";
import { CTA } from "@/components/landing/CTA";
import { Features } from "@/components/landing/Features";
import { Footer } from "@/components/landing/Footer";
import { Hero } from "@/components/landing/Hero";
import { Integrations } from "@/components/landing/Integrations";
import { Navbar } from "@/components/landing/Navbar";
import { Pricing } from "@/components/landing/Pricing";
import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Landing() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Parallax scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Transform values for parallax effects
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const orb4Y = useTransform(scrollYProgress, [0, 1], [0, -150]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Optimized 3D Animated gradient orbs with depth and parallax */}
      <BackgroundOrbs orb1Y={orb1Y} orb2Y={orb2Y} orb3Y={orb3Y} orb4Y={orb4Y} />
      
      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <Hero heroY={heroY} heroOpacity={heroOpacity} />

      {/* Features Section */}
      <Features />

      {/* Integrations Section */}
      <Integrations />

      {/* Pricing Section */}
      <Pricing />

      {/* CTA Section */}
      <CTA />

      {/* Footer */}
      <Footer />
    </div>
  );
}