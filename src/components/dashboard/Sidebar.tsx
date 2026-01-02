import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  GitGraph,
  Link2,
  Settings,
  LifeBuoy,
  LogOut,
  ChevronRight,
  Megaphone
} from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { motion } from "framer-motion";

interface SidebarProps {
  className?: string;
  onSignOut: () => void;
  user?: { name?: string; email?: string };
}

export function Sidebar({ className, onSignOut, user }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: GitGraph, label: "Flows", path: "/flows" },
    { icon: Megaphone, label: "Broadcasts", path: "/broadcasts" },
    { icon: Link2, label: "Integrations", path: "/integrations" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: LifeBuoy, label: "Support", path: "/support" },
  ];

  return (
    <div className={cn("flex flex-col h-full bg-white/80 backdrop-blur-xl border-r border-slate-200/60", className)}>
      <div className="p-6 flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
        <Logo size="md" />
        <span className="font-bold text-xl tracking-tight text-slate-900">Rivoxa</span>
      </div>

      <div className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 relative overflow-hidden group transition-all duration-300",
                isActive ? "bg-blue-50 text-blue-700 hover:bg-blue-100" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              )}
              onClick={() => navigate(item.path)}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"
                />
              )}
              <item.icon className={cn("h-5 w-5", isActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700")} />
              <span className="font-medium">{item.label}</span>
              {isActive && <ChevronRight className="ml-auto h-4 w-4 opacity-50" />}
            </Button>
          );
        })}
      </div>

      <div className="p-4 border-t border-slate-200/60 bg-slate-50/50">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
            {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || "User"}</p>
            <p className="text-xs text-slate-500 truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100"
          onClick={onSignOut}
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
