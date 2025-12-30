import { Background } from "@/components/landing/Background";
import { Footer } from "@/components/landing/Footer";
import { Navbar } from "@/components/landing/Navbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, MessageSquare, Zap, BarChart3, Globe, Shield, Users, Clock } from "lucide-react";
import { motion } from "framer-motion";

export default function Features() {
  const features = [
    {
      icon: <Bot className="h-8 w-8 text-purple-600" />,
      title: "AI Automation",
      description: "Intelligent responses powered by advanced language models that understand context and intent."
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-blue-600" />,
      title: "Multi-Channel Support",
      description: "Seamlessly manage conversations across Instagram, WhatsApp, and more from a single dashboard."
    },
    {
      icon: <Zap className="h-8 w-8 text-yellow-600" />,
      title: "Instant Replies",
      description: "Zero latency auto-replies to keep your customers engaged 24/7 without human intervention."
    },
    {
      icon: <BarChart3 className="h-8 w-8 text-green-600" />,
      title: "Advanced Analytics",
      description: "Deep insights into conversation metrics, user engagement, and automation performance."
    },
    {
      icon: <Globe className="h-8 w-8 text-cyan-600" />,
      title: "Global Reach",
      description: "Support for multiple languages and regional nuances to serve a global customer base."
    },
    {
      icon: <Shield className="h-8 w-8 text-red-600" />,
      title: "Enterprise Security",
      description: "Bank-grade encryption and data protection to keep your business and customer data safe."
    },
    {
      icon: <Users className="h-8 w-8 text-orange-600" />,
      title: "Team Collaboration",
      description: "Built-in tools for team members to collaborate on support tickets and conversations."
    },
    {
      icon: <Clock className="h-8 w-8 text-pink-600" />,
      title: "Smart Scheduling",
      description: "Schedule broadcasts and follow-ups based on optimal engagement times."
    }
  ];

  return (
    <div className="min-h-screen relative">
      <Background />
      <Navbar />
      <main className="pt-32 pb-16 container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-1 text-sm border-purple-200 bg-purple-50 text-purple-700">
            Powerful Capabilities
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Everything you need to scale
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Our platform provides a comprehensive suite of tools designed to automate your customer interactions and drive growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow border-slate-200/60 bg-white/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="mb-4 p-3 bg-slate-50 rounded-xl w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
