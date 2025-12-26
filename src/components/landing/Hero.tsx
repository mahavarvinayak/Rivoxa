import { Button } from "@/components/ui/button";
import { motion, MotionValue } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router";

interface HeroProps {
  heroY: MotionValue<number>;
  heroOpacity: MotionValue<number>;
}

export function Hero({ heroY, heroOpacity }: HeroProps) {
  const navigate = useNavigate();

  return (
    <section className="container mx-auto px-4 py-20 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: -10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-4xl mx-auto"
        style={{ 
          transformStyle: 'preserve-3d', 
          perspective: '1000px',
          y: heroY,
          opacity: heroOpacity
        }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 text-slate-700 text-sm font-medium mb-6 shadow-sm border border-slate-200">
          <Sparkles className="h-4 w-4" />
          Automate Your Social Commerce
        </div>
        <motion.h1 
          className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900"
          style={{
            textShadow: '0 4px 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)',
            transformStyle: 'preserve-3d',
          }}
          animate={{
            textShadow: [
              '0 4px 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)',
              '0 6px 30px rgba(59, 130, 246, 0.4), 0 0 60px rgba(59, 130, 246, 0.2)',
              '0 4px 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)',
            ],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Turn Instagram & WhatsApp
          <br />
          Into Sales Machines
        </motion.h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Automate customer responses, manage product inquiries, and scale your social commerce with intelligent automation flows.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => navigate("/auth")} className="shadow-lg bg-slate-900 hover:bg-slate-800 text-white border-0">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button size="lg" variant="outline" className="shadow-md border-2 border-slate-300 hover:bg-slate-50 hover:border-slate-400">
            Watch Demo
          </Button>
        </div>
      </motion.div>

      {/* Hero Image Placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateX: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="mt-16 max-w-5xl mx-auto"
        style={{ transformStyle: 'preserve-3d', perspective: '2000px' }}
        whileHover={{ 
          scale: 1.02, 
          rotateX: -2,
          transition: { duration: 0.3 }
        }}
      >
        <div className="rounded-xl bg-gradient-to-br from-white/90 via-blue-50/80 to-slate-100/90 p-8 shadow-2xl border border-slate-200/50 backdrop-blur-sm relative overflow-hidden" style={{ transform: 'translateZ(50px)' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 via-transparent to-slate-400/5" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-300/20 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-slate-300/20 to-transparent rounded-full blur-3xl" />
          <div className="aspect-video bg-gradient-to-br from-white/95 to-slate-50/95 rounded-lg shadow-inner overflow-hidden p-6 relative backdrop-blur-sm border border-slate-200/30">
            {/* Mock Dashboard Interface */}
            <div className="h-full flex flex-col gap-4">
              {/* Header Stats */}
              <div className="grid grid-cols-3 gap-3">
                <motion.div 
                  className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-3 text-white cursor-pointer"
                  style={{ transformStyle: 'preserve-3d' }}
                  whileHover={{ 
                    scale: 1.08, 
                    y: -5,
                    rotateX: 5,
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-xs opacity-80">Messages Today</div>
                  <div className="text-2xl font-bold">1,247</div>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-3 text-white cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-xs opacity-80">Active Flows</div>
                  <div className="text-2xl font-bold">12</div>
                </motion.div>
                <motion.div 
                  className="bg-gradient-to-br from-amber-600 to-amber-700 rounded-lg p-3 text-white cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-xs opacity-80">Integrations</div>
                  <div className="text-2xl font-bold">2</div>
                </motion.div>
              </div>
              
              {/* Chart Area */}
              <div className="flex-1 bg-white/50 rounded-lg p-4 flex items-end gap-2">
                {/* Bar Chart Visualization */}
                <div className="flex-1 flex items-end justify-around gap-1 h-full">
                  {[45, 70, 55, 85, 65, 90, 75].map((height, index) => (
                    <motion.div
                      key={index}
                      className={`w-full rounded-t cursor-pointer ${
                        index % 3 === 0 
                          ? 'bg-gradient-to-t from-slate-600 to-slate-500' 
                          : index % 3 === 1 
                          ? 'bg-gradient-to-t from-blue-600 to-blue-500' 
                          : 'bg-gradient-to-t from-slate-700 to-slate-600'
                      }`}
                      style={{ height: `${height}%` }}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
                      whileHover={{ 
                        scale: 1.1,
                        filter: "brightness(1.2)",
                        transition: { duration: 0.2 }
                      }}
                    />
                  ))}
                </div>
              </div>
              
              {/* Bottom Activity Cards */}
              <div className="grid grid-cols-4 gap-2">
                <motion.div 
                  className="bg-green-100 rounded p-2 text-center cursor-pointer"
                  whileHover={{ scale: 1.05, backgroundColor: "rgb(187, 247, 208)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-lg font-bold text-green-700">847</div>
                  <div className="text-xs text-green-600">Sent</div>
                </motion.div>
                <motion.div 
                  className="bg-blue-100 rounded p-2 text-center cursor-pointer"
                  whileHover={{ scale: 1.05, backgroundColor: "rgb(191, 219, 254)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-lg font-bold text-blue-700">823</div>
                  <div className="text-xs text-blue-600">Delivered</div>
                </motion.div>
                <motion.div 
                  className="bg-red-100 rounded p-2 text-center cursor-pointer"
                  whileHover={{ scale: 1.05, backgroundColor: "rgb(254, 202, 202)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-lg font-bold text-red-700">24</div>
                  <div className="text-xs text-red-600">Failed</div>
                </motion.div>
                <motion.div 
                  className="bg-purple-100 rounded p-2 text-center cursor-pointer"
                  whileHover={{ scale: 1.05, backgroundColor: "rgb(221, 214, 254)" }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-lg font-bold text-purple-700">156</div>
                  <div className="text-xs text-purple-600">Executions</div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
