import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, PlayCircle, CheckCircle2, TrendingUp, Users, MessageSquare } from "lucide-react";
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md border border-blue-100 text-slate-600 text-sm font-medium mb-8 shadow-sm hover:bg-white transition-colors cursor-default"
        >
          <Sparkles className="h-4 w-4 text-blue-500" />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-bold">
            New: AI-Powered Automation Engine
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-slate-900 leading-tight"
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
          className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed"
        >
          Automate your Instagram & WhatsApp customer interactions with intelligent flows. 
          Scale your social commerce without losing the personal touch.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
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
            <PlayCircle className="mr-2 h-5 w-5" />
            View Demo
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-500 mb-20"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>14-day free trial</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>Cancel anytime</span>
          </div>
        </motion.div>

        {/* Hero Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 100, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.5, type: "spring", stiffness: 50 }}
          className="mx-auto max-w-5xl perspective-1000 relative z-20"
        >
          {/* Floating Elements */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-4 lg:-left-12 top-1/4 z-30 hidden md:block"
          >
            <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 max-w-[200px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Revenue Up</div>
                  <div className="text-[10px] text-slate-500">+24% this week</div>
                </div>
              </div>
              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full w-[70%] bg-green-500 rounded-full" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -right-4 lg:-right-12 top-1/3 z-30 hidden md:block"
          >
            <div className="bg-white p-4 rounded-2xl shadow-2xl border border-slate-100 max-w-[200px]">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">AI Reply Sent</div>
                  <div className="text-[10px] text-slate-500">Just now</div>
                </div>
              </div>
              <div className="text-xs text-slate-600">
                "Here is the link to the product you asked about! 🛍️"
              </div>
            </div>
          </motion.div>

          <div className="relative rounded-2xl border border-white/40 bg-white/40 backdrop-blur-xl p-2 shadow-2xl ring-1 ring-black/5">
            <div className="rounded-xl overflow-hidden bg-white shadow-inner border border-slate-100 flex flex-col">
              <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/80" />
                  <div className="w-3 h-3 rounded-full bg-green-400/80" />
                </div>
                <div className="flex-1 text-center text-xs font-medium text-slate-400">ChatFlow Analytics Dashboard</div>
              </div>
              
              <div className="aspect-[16/9] bg-slate-50/50 p-6 grid grid-cols-12 gap-6">
                {/* Sidebar */}
                <div className="col-span-2 hidden md:flex flex-col gap-2">
                  <div className="h-8 w-full bg-blue-50 text-blue-600 rounded-lg flex items-center px-3 text-xs font-bold">Dashboard</div>
                  <div className="h-8 w-full hover:bg-slate-100 text-slate-500 rounded-lg flex items-center px-3 text-xs font-medium transition-colors">Conversations</div>
                  <div className="h-8 w-full hover:bg-slate-100 text-slate-500 rounded-lg flex items-center px-3 text-xs font-medium transition-colors">Automations</div>
                  <div className="h-8 w-full hover:bg-slate-100 text-slate-500 rounded-lg flex items-center px-3 text-xs font-medium transition-colors">Contacts</div>
                  <div className="mt-auto h-8 w-full hover:bg-slate-100 text-slate-500 rounded-lg flex items-center px-3 text-xs font-medium transition-colors">Settings</div>
                </div>
                
                {/* Main Content */}
                <div className="col-span-12 md:col-span-10 flex flex-col gap-6">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                      <div className="text-xs text-slate-500 mb-1">Total Revenue</div>
                      <div className="text-xl font-bold text-slate-900">$12,450</div>
                      <div className="text-[10px] text-green-500 font-medium mt-1">+15% vs last month</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                      <div className="text-xs text-slate-500 mb-1">Active Conversations</div>
                      <div className="text-xl font-bold text-slate-900">1,204</div>
                      <div className="text-[10px] text-green-500 font-medium mt-1">+8% vs last month</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                      <div className="text-xs text-slate-500 mb-1">Automation Rate</div>
                      <div className="text-xl font-bold text-slate-900">94.2%</div>
                      <div className="text-[10px] text-blue-500 font-medium mt-1">All time high</div>
                    </div>
                  </div>

                  {/* Chart Area */}
                  <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 p-5 flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-sm font-bold text-slate-900">Message Volume</div>
                        <div className="text-xs text-slate-500">Last 7 days</div>
                      </div>
                      <div className="flex gap-2">
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <div className="w-2 h-2 rounded-full bg-blue-500" /> Instagram
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <div className="w-2 h-2 rounded-full bg-indigo-400" /> WhatsApp
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex items-end justify-between gap-2 sm:gap-3 px-2">
                      {[40, 70, 45, 90, 65, 85, 55, 95, 75, 60, 80, 50, 65, 85, 95].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 0.8, delay: 1 + (i * 0.05), ease: "easeOut" }}
                          className="w-full bg-gradient-to-t from-blue-600 to-indigo-400 rounded-t-sm opacity-80 hover:opacity-100 transition-opacity relative group"
                        >
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                            {h * 12} msgs
                          </div>
                        </motion.div>
                      ))}
                    </div>
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