import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Activity, Plus, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Create New Flow",
      description: "Build automated responses for Instagram & WhatsApp",
      icon: Bot,
      path: "/flows",
      gradient: "from-blue-500 to-indigo-600",
      delay: 0.3
    },
    {
      title: "Connect Account",
      description: "Link your social media accounts to Rivoxa",
      icon: Activity,
      path: "/integrations",
      gradient: "from-purple-500 to-pink-600",
      delay: 0.4
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {actions.map((action, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: action.delay }}
        >
          <Card
            className="group relative overflow-hidden border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer bg-white"
            onClick={() => navigate(action.path)}
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${action.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

            <CardHeader className="flex flex-row items-center gap-6">
              <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <action.icon className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                  {action.title}
                  <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-blue-600" />
                </CardTitle>
                <CardDescription className="text-slate-500">
                  {action.description}
                </CardDescription>
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                <Plus className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
