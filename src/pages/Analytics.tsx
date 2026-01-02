import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Loader2, BarChart3, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Analytics() {
    const { isLoading, isAuthenticated, user, signOut } = useAuth();
    const navigate = useNavigate();
    const stats = useQuery(api.analytics.getDashboardStats);

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

    return (
        <div className="min-h-screen bg-slate-50/50 flex overflow-hidden">
            {/* Sidebar */}
            <div className="hidden md:block w-64 fixed inset-y-0 z-50">
                <Sidebar onSignOut={signOut} user={user || undefined} />
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 relative overflow-y-auto h-screen">
                <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                </div>

                <div className="container mx-auto px-6 py-8 max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                            <BarChart3 className="h-8 w-8 text-indigo-600" />
                            Performance Analytics
                        </h1>
                        <p className="text-slate-500 mt-2">Deep dive into your automation performance and engagement metrics.</p>
                    </motion.div>

                    <StatsGrid stats={stats} planLimits={planLimits} />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                    Engagement Trends
                                </CardTitle>
                                <CardDescription>Visualizing your daily interaction growth.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] flex items-center justify-center bg-slate-50/50 border-t border-slate-100">
                                <p className="text-slate-400 text-sm">Chart visualization coming soon...</p>
                            </CardContent>
                        </Card>
                        <div className="space-y-6">
                            <RecentActivity stats={stats} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
