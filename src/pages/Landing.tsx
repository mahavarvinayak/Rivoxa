import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion, useScroll, useTransform } from "framer-motion";
import { 
  ArrowRight, 
  Bot, 
  Check, 
  Instagram, 
  Loader2, 
  MessageSquare, 
  Package, 
  Sparkles, 
  Zap 
} from "lucide-react";
import { useNavigate } from "react-router";
import { Logo } from "@/components/Logo";
import { useRef } from "react";

export default function Landing() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
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

  const features = [
    {
      icon: Bot,
      title: "Comment-to-DM Automation",
      description: "Automatically send DMs when users comment specific keywords on your Instagram posts",
    },
    {
      icon: MessageSquare,
      title: "Multi-Platform Support",
      description: "Manage Instagram DMs, comments, stories, and WhatsApp messages from one dashboard",
    },
    {
      icon: Package,
      title: "Product Recommendations",
      description: "Send personalized product catalogs and recommendations based on customer inquiries",
    },
    {
      icon: Zap,
      title: "Broadcast Messages",
      description: "Send targeted campaigns to your audience with advanced segmentation and scheduling",
    },
  ];

  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "forever",
      features: [
        "50 messages per reel/day",
        "Basic automation flows",
        "Instagram integration",
        "WhatsApp integration",
        "Community support",
      ],
      cta: "Get Started",
      popular: false,
    },
    {
      name: "Starter",
      price: "$4",
      period: "per month",
      features: [
        "400 messages per reel/day",
        "Advanced automation flows",
        "Priority support",
        "Analytics dashboard",
        "Custom templates",
        "Email support",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Pro",
      price: "$8",
      period: "per month",
      features: [
        "1,000 messages per reel/day",
        "Unlimited flows",
        "Advanced automation",
        "Advanced analytics",
        "API access",
        "White-label option",
        "Dedicated support",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Optimized 3D Animated gradient orbs with depth and parallax */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none will-change-transform" style={{ perspective: '1000px' }}>
        <motion.div
          className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full blur-3xl will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, rgba(37, 99, 235, 0.3) 50%, transparent 100%)',
            transformStyle: 'preserve-3d',
            y: orb1Y,
          }}
          animate={{
            x: [0, 150, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1],
            rotateX: [0, 15, 0],
            rotateY: [0, 15, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-3xl will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(148, 163, 184, 0.3) 0%, rgba(100, 116, 139, 0.2) 50%, transparent 100%)',
            transformStyle: 'preserve-3d',
            y: orb2Y,
          }}
          animate={{
            x: [0, -120, 0],
            y: [0, 120, 0],
            scale: [1, 1.4, 1],
            rotateX: [0, -20, 0],
            rotateZ: [0, 10, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 w-[550px] h-[550px] rounded-full blur-3xl will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.35) 0%, rgba(71, 85, 105, 0.25) 50%, transparent 100%)',
            transformStyle: 'preserve-3d',
            y: orb3Y,
          }}
          animate={{
            x: [0, -80, 0],
            y: [0, -80, 0],
            scale: [1, 1.2, 1],
            rotateY: [0, 20, 0],
            rotateZ: [0, -15, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full blur-3xl will-change-transform"
          style={{
            background: 'radial-gradient(circle, rgba(96, 165, 250, 0.25) 0%, rgba(59, 130, 246, 0.15) 50%, transparent 100%)',
            transformStyle: 'preserve-3d',
            transform: 'translate(-50%, -50%)',
            y: orb4Y,
          }}
          animate={{
            scale: [1, 1.5, 1],
            rotateX: [0, 360, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-slate-200/50 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-blue-50/40 to-white/60 backdrop-blur-xl" />
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <span className="text-xl font-bold tracking-tight text-slate-900">ChatFlow AI</span>
          </div>
          <div className="flex items-center gap-4">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isAuthenticated ? (
              <Button onClick={() => navigate("/dashboard")} className="shadow-md">
                Dashboard
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate("/auth")}>
                  Sign In
                </Button>
                <Button onClick={() => navigate("/auth")} className="shadow-md">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
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

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-slate-50/50 to-gray-50/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything You Need to Automate
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features to help you manage customer conversations at scale
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-lg hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white/95 to-slate-50/90 backdrop-blur-md border border-slate-200/50 hover:border-blue-300/50 relative overflow-hidden group" style={{ transformStyle: 'preserve-3d' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <motion.div 
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ 
                  opacity: 1,
                  background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
                }}
                transition={{ duration: 0.3 }}
              />
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-4 shadow-md">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Integrations Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Connect Your Platforms
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Seamlessly integrate with Instagram and WhatsApp Business
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white/95 to-slate-50/90 backdrop-blur-md border border-slate-200/50 hover:border-blue-300/50 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-slate-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader>
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mb-4 shadow-lg">
                  <Instagram className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Instagram</CardTitle>
                <CardDescription className="text-base">
                  Auto-respond to comments and DMs. Turn engagement into sales with smart automation.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="shadow-xl hover:shadow-2xl transition-all bg-white/80 backdrop-blur-sm border-2 border-green-200 hover:border-green-400">
              <CardHeader>
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-green-500 via-green-600 to-emerald-500 flex items-center justify-center mb-4 shadow-lg">
                  <MessageSquare className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">WhatsApp Business</CardTitle>
                <CardDescription className="text-base">
                  Automate customer support and send product catalogs directly through WhatsApp.
                </CardDescription>
              </CardHeader>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-gray-50/50 to-slate-50/50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your business needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className={`h-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white/95 to-slate-50/90 backdrop-blur-md relative overflow-hidden group ${plan.popular ? "border-2 border-slate-800 ring-2 ring-blue-300/50" : "border border-slate-200/50"}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/0 to-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              {plan.popular && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-2xl" />
              )}
                {plan.popular && (
                  <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white text-center py-2 text-sm font-medium rounded-t-lg">
                    Most Popular
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2">/ {plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full shadow-md ${plan.popular ? "bg-slate-900 hover:bg-slate-800 text-white border-0" : "border-2 border-slate-300 hover:bg-slate-50"}`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => navigate("/auth")}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Card className="max-w-2xl mx-auto shadow-xl bg-gradient-to-br from-white/95 to-slate-50/90 backdrop-blur-md border border-slate-200/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-slate-400/5" />
            <CardHeader>
              <CardTitle className="text-2xl">Enterprise</CardTitle>
              <CardDescription className="text-base">
                For businesses with over 1M followers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Unlimited messages, dedicated support, custom integrations, and white-label options.
              </p>
              <Button variant="outline" size="lg" className="shadow-md border-2 border-slate-300 hover:bg-slate-50">
                Contact Sales
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <Card className="shadow-2xl bg-gradient-to-br from-white/95 via-blue-50/80 to-slate-100/90 border border-slate-200/50 backdrop-blur-md relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-transparent to-slate-400/10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-slate-300/20 to-transparent rounded-full blur-3xl" />
            <CardHeader className="pb-8 pt-12">
              <CardTitle className="text-3xl md:text-4xl mb-4">
                Ready to Automate Your Business?
              </CardTitle>
              <CardDescription className="text-lg">
                Join thousands of businesses using ChatFlow AI to scale their social commerce
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-12">
              <Button size="lg" onClick={() => navigate("/auth")} className="shadow-lg bg-slate-900 hover:bg-slate-800 text-white border-0">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-muted-foreground mt-4">
                No credit card required • 14-day free trial
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-gradient-to-br from-white/90 via-slate-50/80 to-blue-50/70 backdrop-blur-md py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-slate-400/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand Section */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-center gap-3">
                <Logo size="sm" />
                <span className="font-semibold">ChatFlow AI</span>
              </div>
              <p className="text-sm text-muted-foreground text-center md:text-left">
                Automate your social commerce with intelligent AI-powered flows
              </p>
            </div>

            {/* About Section */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <h3 className="font-semibold text-sm">About Us</h3>
              <p className="text-sm text-muted-foreground text-center md:text-left">
                We are THE Π LAB, building innovative automation solutions for modern businesses.
              </p>
            </div>

            {/* Contact Section */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <h3 className="font-semibold text-sm">Get in Touch</h3>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a 
                  href="https://www.linkedin.com/company/the-%CF%80-lab/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  LinkedIn
                </a>
                <a 
                  href="mailto:thepilab77@gmail.com" 
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  thepilab77@gmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-slate-200 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 ChatFlow AI by THE Π LAB. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}