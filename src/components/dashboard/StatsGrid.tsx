import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Zap, Instagram, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

interface StatsGridProps {
  stats: any;
  planLimits: any;
}

export function StatsGrid({ stats, planLimits }: StatsGridProps) {
  const cards = [
    {
      title: "Total Interactions",
      value: stats?.totalExecutions || 0,
      subtext: "Automated replies sent",
      icon: Zap,
      color: "text-blue-600",
      bg: "bg-blue-50",
      trend: "All time"
    },
    {
      title: "Active Flows",
      value: stats?.activeFlows || 0,
      subtext: `${stats?.totalFlows || 0} total flows created`,
      icon: MessageSquare,
      color: "text-amber-600",
      bg: "bg-amber-50",
      trend: "Online"
    },
    {
      title: "Audience Reach",
      value: stats?.totalContacts || 0,
      subtext: "People interacted with",
      icon: Instagram,
      color: "text-purple-600",
      bg: "bg-purple-50",
      trend: "Growing"
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

            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
