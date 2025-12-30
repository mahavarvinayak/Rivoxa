import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Check, Zap, Star, Shield, Rocket } from "lucide-react";
import { useNavigate } from "react-router";
import { Background } from "@/components/landing/Background";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";

export default function Pricing() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free Trial",
      price: "₹0",
      period: "1 month trial",
      description: "Perfect for testing the waters",
      icon: Zap,
      features: [
        "Unlimited messages",
        "3 Automation flows",
        "AI FAQs",
        "Instagram integration",
        "WhatsApp integration",
        "Community support",
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "blue",
    },
    {
      name: "Pro",
      price: "₹499",
      period: "per month",
      description: "For growing businesses",
      icon: Star,
      features: [
        "Unlimited messages",
        "8-10 Automation flows",
        "Advanced automation",
        "Analytics dashboard",
        "Custom templates",
        "Priority support",
      ],
      cta: "Get Pro",
      popular: true,
      color: "purple",
    },
    {
      name: "Ultimate",
      price: "₹999",
      period: "per month",
      description: "For scaling operations",
      icon: Rocket,
      features: [
        "Unlimited messages",
        "10-20 Automation flows",
        "Advanced analytics",
        "API access",
        "Follow before DM",
        "Follow Up sequences",
        "Dedicated support",
      ],
      cta: "Get Ultimate",
      popular: false,
      color: "pink",
    },
    {
      name: "Business",
      price: "₹1999",
      period: "per month",
      description: "Maximum power & control",
      icon: Shield,
      features: [
        "Unlimited messages",
        "Unlimited flows",
        "White-label option",
        "Custom integrations",
        "Dedicated account manager",
        "24/7 Priority support",
      ],
      cta: "Get Business",
      popular: false,
      color: "orange",
    },
  ];

  return (
    <div className="min-h-screen relative font-sans">
      <Background />
      <Navbar />
      
      <main className="pt-32 pb-20">
        {/* Header */}
        <section className="container mx-auto px-4 text-center mb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">
              Simple, Transparent <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Pricing</span>
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Choose the perfect plan for your business. No hidden fees. Cancel anytime.
            </p>
          </motion.div>
        </section>

        {/* Pricing Cards */}
        <section className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className={`h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-2 flex flex-col ${
                  plan.popular 
                    ? "border-2 border-purple-500 shadow-2xl shadow-purple-500/20 bg-white/90 backdrop-blur-xl" 
                    : "border border-slate-200 shadow-xl hover:shadow-2xl bg-white/80 backdrop-blur-lg"
                }`}>
                  {plan.popular && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-gradient-to-l from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                        MOST POPULAR
                      </div>
                    </div>
                  )}
                  
                  <CardHeader className="pb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-${plan.color}-100 text-${plan.color}-600`}>
                      <plan.icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-900">{plan.name}</CardTitle>
                    <CardDescription className="text-slate-500">{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col pt-0">
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                      <span className="text-slate-500 text-sm font-medium ml-2">/ {plan.period}</span>
                    </div>
                    
                    <div className="space-y-4 mb-8 flex-1">
                      {plan.features.map((feature, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className={`mt-1 rounded-full p-0.5 bg-${plan.color}-100 text-${plan.color}-600`}>
                            <Check className="h-3 w-3" />
                          </div>
                          <span className="text-sm text-slate-600">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={`w-full h-12 rounded-xl font-semibold shadow-lg transition-all duration-300 ${
                        plan.popular 
                          ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 hover:shadow-purple-500/25" 
                          : "bg-white text-slate-900 border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                      }`}
                      onClick={() => navigate("/auth")}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}