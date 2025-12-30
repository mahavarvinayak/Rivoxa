import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, CheckCircle2, XCircle, Send, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface RecentActivityProps {
  stats: any;
}

export function RecentActivity({ stats }: RecentActivityProps) {
  const items = [
    {
      label: "Sent",
      value: stats?.todayStats.sentMessages || 0,
      icon: Send,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      label: "Delivered",
      value: stats?.todayStats.deliveredMessages || 0,
      icon: CheckCircle2,
      color: "text-green-600",
      bg: "bg-green-50"
    },
    {
      label: "Failed",
      value: stats?.todayStats.failedMessages || 0,
      icon: XCircle,
      color: "text-red-600",
      bg: "bg-red-50"
    },
    {
      label: "Executions",
      value: stats?.todayStats.flowExecutions || 0,
      icon: PlayCircle,
      color: "text-purple-600",
      bg: "bg-purple-50"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card className="border-slate-200/60 shadow-sm bg-white/60 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">Today's Activity</CardTitle>
            <CardDescription>Real-time message delivery statistics</CardDescription>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Full Analytics
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center justify-center p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className={`p-3 rounded-full ${item.bg} ${item.color} mb-3 group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-wider mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
