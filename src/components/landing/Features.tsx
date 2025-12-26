import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Bot, MessageSquare, Package, Zap } from "lucide-react";

export function Features() {
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

  return (
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
  );
}
