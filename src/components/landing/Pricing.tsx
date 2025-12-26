import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router";

export function Pricing() {
  const navigate = useNavigate();
  
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
  );
}
