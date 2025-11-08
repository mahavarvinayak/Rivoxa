import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { motion } from "framer-motion";
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

export default function Landing() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navigation */}
      <nav className="border-b bg-white/90 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-purple-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size="md" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">ChatFlow AI</span>
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
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-primary text-sm font-medium mb-6 shadow-md border border-purple-200">
            <Sparkles className="h-4 w-4" />
            Automate Your Social Commerce
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Turn Instagram & WhatsApp
            <br />
            Into Sales Machines
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Automate customer responses, manage product inquiries, and scale your social commerce with intelligent automation flows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth")} className="shadow-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="shadow-lg border-2 border-purple-300 hover:bg-purple-50 hover:border-purple-400">
              Watch Demo
            </Button>
          </div>
        </motion.div>

        {/* Hero Image Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <div className="rounded-xl bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-8 shadow-2xl border-2 border-purple-200">
            <div className="aspect-video bg-card rounded-lg shadow-inner overflow-hidden p-6">
              {/* Mock Dashboard Interface */}
              <div className="h-full flex flex-col gap-4">
                {/* Header Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <motion.div 
                    className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-3 text-white cursor-pointer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-xs opacity-80">Messages Today</div>
                    <div className="text-2xl font-bold">1,247</div>
                  </motion.div>
                  <motion.div 
                    className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg p-3 text-white cursor-pointer"
                    whileHover={{ scale: 1.05, y: -2 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-xs opacity-80">Active Flows</div>
                    <div className="text-2xl font-bold">12</div>
                  </motion.div>
                  <motion.div 
                    className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-3 text-white cursor-pointer"
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
                            ? 'bg-gradient-to-t from-purple-500 to-purple-400' 
                            : index % 3 === 1 
                            ? 'bg-gradient-to-t from-pink-500 to-pink-400' 
                            : 'bg-gradient-to-t from-blue-500 to-blue-400'
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
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-purple-50/50 to-pink-50/50">
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
              <Card className="h-full shadow-lg hover:shadow-2xl transition-all bg-white/80 backdrop-blur-sm border-2 border-purple-100 hover:border-purple-300">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-md">
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
            <Card className="shadow-xl hover:shadow-2xl transition-all bg-white/80 backdrop-blur-sm border-2 border-purple-200 hover:border-purple-400">
              <CardHeader>
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-pink-500 flex items-center justify-center mb-4 shadow-lg">
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
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-pink-50/50 to-blue-50/50">
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
              <Card className={`h-full shadow-xl hover:shadow-2xl transition-all bg-white/80 backdrop-blur-sm ${plan.popular ? "border-2 border-purple-500 ring-4 ring-purple-200" : "border-2 border-purple-100"}`}>
                {plan.popular && (
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-center py-2 text-sm font-medium rounded-t-lg">
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
                    className={`w-full shadow-lg ${plan.popular ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0" : "border-2 border-purple-300 hover:bg-purple-50"}`}
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
          <Card className="max-w-2xl mx-auto shadow-xl bg-white/80 backdrop-blur-sm border-2 border-purple-200">
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
              <Button variant="outline" size="lg" className="shadow-lg border-2 border-purple-300 hover:bg-purple-50">
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
          <Card className="shadow-2xl bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 border-2 border-purple-200">
            <CardHeader className="pb-8 pt-12">
              <CardTitle className="text-3xl md:text-4xl mb-4">
                Ready to Automate Your Business?
              </CardTitle>
              <CardDescription className="text-lg">
                Join thousands of businesses using ChatFlow AI to scale their social commerce
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-12">
              <Button size="lg" onClick={() => navigate("/auth")} className="shadow-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0">
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
      <footer className="border-t border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50 py-12">
        <div className="container mx-auto px-4">
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
                  href="https://www.linkedin.com/company/the-pi-lab" 
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
                  href="mailto:contact@thepilab.com" 
                  className="hover:text-primary transition-colors flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  contact@thepilab.com
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-purple-200 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 ChatFlow AI by THE Π LAB. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}