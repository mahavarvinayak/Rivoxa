import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Header } from "@/components/dashboard/Header";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const stats = useQuery(api.analytics.getDashboardStats);
  const flows = useQuery(api.flows.list);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const planLimits = {
    free: 100,
    starter: 600,
    pro: 1500,
    enterprise: Infinity,
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 flex overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:block w-64 fixed inset-y-0 z-50">
        <Sidebar onSignOut={handleSignOut} user={user ?? undefined} />
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 relative overflow-y-auto h-screen">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Header 
              title={`Welcome back, ${user?.name?.split(' ')[0] || "User"}!`} 
              description="Here's what's happening with your automations today."
            />
          </motion.div>

          <StatsGrid stats={stats} planLimits={planLimits} />
          
          <QuickActions />
          
          <RecentActivity stats={stats} />
        </div>
      </main>
    </div>
  );
}