import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";
import { useRef } from "react";

export function Hero() {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section ref={containerRef} className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <motion.div 
        style={{ y, opacity }}
        className="container mx-auto px-4 text-center relative z-10"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-white/60 text-slate-600 text-sm font-medium mb-8 shadow-sm hover:bg-white/80 transition-colors cursor-default"
        >
          <Sparkles className="h-4 w-4 text-blue-500" />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-semibold">
            New: AI-Powered Automation
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-bold tracking-tight mb-8 text-slate-900"
        >
          Turn Conversations Into
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent pb-2">
            Revenue Streams
          </span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed"
        >
          Automate your Instagram & WhatsApp customer interactions with intelligent flows. 
          Scale your social commerce without losing the personal touch.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button 
            size="lg" 
            onClick={() => navigate("/auth")} 
            className="h-14 px-8 text-lg rounded-full shadow-xl bg-slate-900 hover:bg-slate-800 text-white border-0 hover:scale-105 transition-all duration-300 hover:shadow-slate-900/25"
          >
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="h-14 px-8 text-lg rounded-full border-2 border-slate-200 bg-white/50 hover:bg-white hover:border-slate-300 text-slate-700 hover:scale-105 transition-all duration-300 backdrop-blur-sm"
          >
            View Demo
          </Button>
        </motion.div>

        {/* Hero Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.4, type: "spring" }}
          className="mt-20 mx-auto max-w-5xl perspective-1000"
        >
          <div className="relative rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl p-2 shadow-2xl ring-1 ring-black/5">
            <div className="rounded-xl overflow-hidden bg-white shadow-inner border border-slate-100">
              <div className="h-12 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="flex-1 text-center text-xs font-medium text-slate-400">ChatFlow Dashboard</div>
              </div>
              <div className="aspect-[16/9] bg-slate-50/50 p-8 grid grid-cols-12 gap-6">
                {/* Sidebar */}
                <div className="col-span-2 bg-white rounded-lg shadow-sm border border-slate-100 p-4 space-y-3 hidden md:block">
                  <div className="h-8 w-full bg-slate-100 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-slate-50 rounded animate-pulse" />
                  <div className="h-4 w-1/2 bg-slate-50 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-slate-50 rounded animate-pulse" />
                </div>
                {/* Main Content */}
                <div className="col-span-12 md:col-span-10 space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-slate-100 space-y-2">
                        <div className="h-4 w-1/3 bg-slate-100 rounded" />
                        <div className="h-8 w-1/2 bg-slate-200 rounded" />
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-slate-100 h-64 p-4 flex items-end justify-between gap-2">
                    {[40, 70, 45, 90, 65, 85, 55, 95, 75, 60, 80, 50].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: 0.5 + (i * 0.05) }}
                        viewport={{ once: true }}
                        className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
