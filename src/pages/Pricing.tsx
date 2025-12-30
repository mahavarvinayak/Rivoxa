import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { Check, Zap, Star, Shield, Rocket } from "lucide-react";
import { useNavigate } from "react-router";
import { Background } from "@/components/landing/Background";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/Footer";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";

export default function Pricing() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Free Trial",
      price: "₹0",
      period: "7-day trial",
      description: "Test the product safely",
      icon: Zap,
      features: [
        "Instagram integration only",
        "Up to 300 automated replies total",
        "1 basic automation flow",
        "AI-powered FAQ replies (limited)",
        "Comment-to-DM basic automation",
        "Community support only",
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "blue",
    },
    {
      name: "Pro",
      price: billingCycle === "monthly" ? "₹499" : "₹4,999",
      originalPrice: billingCycle === "yearly" ? "₹5,988" : null,
      period: billingCycle === "monthly" ? "per month" : "per year",
      description: "For solo creators & small businesses",
      icon: Star,
      features: [
        "Instagram automation",
        "Up to 5 active automation flows",
        "AI-powered smart replies",
        "Comment → DM automation",
        "Basic lead qualification",
        "Fair usage policy applies",
        "Basic analytics dashboard",
        "Email support",
      ],
      cta: "Get Pro",
      popular: true,
      color: "purple",
      savings: billingCycle === "yearly" ? "Save ~17%" : null,
    },
    {
      name: "Ultimate",
      price: billingCycle === "monthly" ? "₹999" : "₹9,999",
      originalPrice: billingCycle === "yearly" ? "₹11,988" : null,
      period: billingCycle === "monthly" ? "per month" : "per year",
      description: "For growing businesses",
      icon: Rocket,
      features: [
        "Instagram + WhatsApp automation",
        "Up to 15 active automation flows",
        "Advanced workflows & delays",
        "Follow-up message sequences",
        "Lead scoring & tagging",
        "Advanced analytics dashboard",
        "API access (read-only)",
        "Priority support",
      ],
      cta: "Get Ultimate",
      popular: false,
      color: "pink",
      savings: billingCycle === "yearly" ? "Save ~17%" : null,
    },
    {
      name: "Business",
      price: billingCycle === "monthly" ? "₹1,999" : "₹20,999",
      originalPrice: billingCycle === "yearly" ? "₹23,988" : null,
      period: billingCycle === "monthly" ? "per month" : "per year",
      description: "Maximum power & control",
      icon: Shield,
      features: [
        "Instagram + WhatsApp automation",
        "Unlimited active flows (Fair Usage)",
        "White-label option",
        "Custom integrations (Zapier/API)",
        "Dedicated account manager",
        "SLA-based priority support",
        "Advanced security controls",
      ],
      cta: "Get Business",
      popular: false,
      color: "orange",
      savings: billingCycle === "yearly" ? "Save ~12%" : null,
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
            <p className="text-xl text-slate-600 mb-6 leading-relaxed">
              Choose the perfect plan for your business. No hidden fees. Cancel anytime.
            </p>
            <div className="flex flex-col items-center gap-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 text-green-700 text-sm font-medium shadow-sm">
                <Shield className="h-4 w-4" />
                <span>100% Meta-Compliant & Safe Inbound-Only Automation</span>
              </div>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center gap-4 p-1.5 bg-white/50 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm">
                <span className={`text-sm font-medium px-3 py-1 rounded-full transition-colors ${billingCycle === 'monthly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                  Monthly
                </span>
                <Switch
                  checked={billingCycle === "yearly"}
                  onCheckedChange={(checked) => setBillingCycle(checked ? "yearly" : "monthly")}
                />
                <span className={`text-sm font-medium px-3 py-1 rounded-full transition-colors flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'}`}>
                  Yearly <span className="text-green-600 font-bold text-xs bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Save up to 17%</span>
                </span>
              </div>
            </div>
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
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                        <span className="text-slate-500 text-sm font-medium">/ {plan.period}</span>
                      </div>
                      {/* @ts-ignore */}
                      {plan.originalPrice && (
                        <div className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                          {/* @ts-ignore */}
                          <span className="line-through">{plan.originalPrice}</span>
                          {/* @ts-ignore */}
                          <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full text-xs">{plan.savings}</span>
                        </div>
                      )}
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