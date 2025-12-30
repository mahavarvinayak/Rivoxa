import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  Check, 
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router";
import { Logo } from "@/components/Logo";

export default function Pricing() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free Trial",
      price: "₹0",
      period: "1 month trial",
      description: "Perfect for testing the waters",
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
    },
    {
      name: "Pro",
      price: "₹499",
      period: "per month",
      description: "For growing businesses",
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
    },
    {
      name: "Ultimate",
      price: "₹999",
      period: "per month",
      description: "For scaling operations",
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
    },
    {
      name: "Business",
      price: "₹1999",
      period: "per month",
      description: "Maximum power & control",
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
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)' }}
          animate={{
            y: [0, 50, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, transparent 70%)' }}
          animate={{
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-xl shadow-lg sticky top-0 z-50 border-slate-200/50 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-blue-50/40 to-white/60 backdrop-blur-xl" />
        <div className="container mx-auto px-4 py-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <Logo size="md" />
            <span className="text-xl font-bold tracking-tight text-slate-900">ChatFlow AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/support")}>
              Support
            </Button>
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

      {/* Header */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 text-slate-900">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Choose the perfect plan for your business. No hidden fees.
          </p>
        </motion.div>
      </section>

      {/* Pricing Cards */}
      <section className="container mx-auto px-4 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className={`h-full shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white/95 to-slate-50/90 backdrop-blur-md relative overflow-hidden group flex flex-col ${plan.popular ? "border-2 border-slate-800 ring-2 ring-blue-300/50" : "border border-slate-200/50"}`}>
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
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground ml-2 text-sm">/ {plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <ul className="space-y-3 mb-6 flex-1">
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
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/50 bg-gradient-to-br from-white/90 via-slate-50/80 to-blue-50/70 backdrop-blur-md py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-slate-400/5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-center gap-3">
                <Logo size="sm" />
                <span className="font-semibold">ChatFlow AI</span>
              </div>
              <p className="text-sm text-muted-foreground text-center md:text-left">
                Automate your social commerce with intelligent AI-powered flows
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-3">
              <h3 className="font-semibold text-sm">About Us</h3>
              <p className="text-sm text-muted-foreground text-center md:text-left">
                We are THE Π LAB, building innovative automation solutions for modern businesses.
              </p>
            </div>
            <div className="flex flex-col items-center md:items-start gap-3">
              <h3 className="font-semibold text-sm">Get in Touch</h3>
              <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                <a href="mailto:thepilab77@gmail.com" className="hover:text-primary transition-colors">
                  thepilab77@gmail.com
                </a>
              </div>
            </div>
          </div>
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