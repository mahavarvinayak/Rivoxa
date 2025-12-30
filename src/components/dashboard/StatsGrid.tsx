import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Zap, Instagram, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface StatsGridProps {
  stats: any;
  planLimits: any;
}

export function StatsGrid({ stats, planLimits }: StatsGridProps) {
  const currentLimit = planLimits[stats?.planType as keyof typeof planLimits] || 100;
  const usagePercentage = currentLimit === Infinity 
    ? 0 
    : ((stats?.messagesUsedToday || 0) / currentLimit) * 100;

  const cards = [
    {
      title: "Messages Today",
      value: stats?.messagesUsedToday || 0,
      subtext: `of ${currentLimit === Infinity ? "unlimited" : currentLimit} limit`,
      icon: MessageSquare,
      color: "text-blue-600",
      bg: "bg-blue-50",
      progress: Math.min(usagePercentage, 100),
      progressColor: "bg-blue-600"
    },
    {
      title: "Active Flows",
      value: stats?.activeFlowsCount || 0,
      subtext: "Running automations",
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-50",
      trend: "+2 this week"
    },
    {
      title: "Connected Accounts",
      value: stats?.integrationsCount || 0,
      subtext: "Active channels",
      icon: Instagram,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "Healthy"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-all duration-300 bg-white/60 backdrop-blur-sm overflow-hidden group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bg} ${card.color} group-hover:scale-110 transition-transform`}>
                <card.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline justify-between">
                <div className="text-3xl font-bold text-slate-900">{card.value}</div>
                {card.trend && (
                  <div className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {card.trend}
                    <ArrowUpRight className="h-3 w-3 ml-1" />
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1">{card.subtext}</p>
              
              {card.progress !== undefined && (
                <div className="w-full bg-slate-100 rounded-full h-1.5 mt-4 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${card.progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${card.progressColor}`}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
