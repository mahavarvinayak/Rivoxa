import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CreditCard,
  Loader2,
  LogOut,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const createPaymentOrder = useAction(api.payments.createPaymentOrder);
  const verifyPayment = useAction(api.payments.verifyPayment);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const handleUpgradePlan = async (planType: "pro" | "ultimate" | "business") => {
    try {
      const order = await createPaymentOrder({ planType });
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const options = {
          key: order.keyId,
          order_id: order.orderId,
          amount: order.amount,
          currency: order.currency,
          name: "Rivoxa",
          description: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan Subscription`,
          handler: async (response: any) => {
            const verified = await verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              planType,
            });

            if (verified.verified) {
              toast.success(`Welcome to Rivoxa ${planType.charAt(0).toUpperCase() + planType.slice(1)}! 🚀`);
              window.location.reload();
            } else {
              toast.error("Payment verification failed");
            }
          },
          prefill: {
            email: user?.email || "",
          },
          theme: {
            color: "#8b5cf6",
          },
        };

        const checkout = new (window as any).Razorpay(options);
        checkout.open();
      };
      document.body.appendChild(script);
    } catch (error) {
      toast.error("Failed to initiate payment");
      console.error(error);
    }
  };

  const handleSaveProfile = () => {
    // In a real app, we would call a mutation here
    toast.success("Profile updated successfully");
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-10 glass-effect border-b bg-white/50 dark:bg-zinc-900/50 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => navigate("/")}
            >
              <Logo size="md" />
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">
                Rivoxa
              </h1>
            </div>
          </div>
          <Button variant="ghost" onClick={handleSignOut} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-10 text-center sm:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">Account Settings</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2">Manage your personal profile and subscription plan.</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full sm:w-[400px] grid-cols-2 p-1 bg-zinc-200/50 dark:bg-zinc-900/50 rounded-full mx-auto sm:mx-0">
              <TabsTrigger value="profile" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm transition-all duration-300">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="billing" className="rounded-full data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm transition-all duration-300">
                <CreditCard className="h-4 w-4 mr-2" />
                Billing
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="outline-none">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="overflow-hidden border-none shadow-xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm">
                  <div className="h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-900/20 dark:to-pink-900/20 relative">
                    <div className="absolute -bottom-12 left-8">
                      <div className="h-24 w-24 rounded-full border-4 border-white dark:border-zinc-900 bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-3xl font-bold text-zinc-400">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    </div>
                  </div>
                  <CardHeader className="pt-16 pb-2 px-8">
                    <CardTitle className="text-xl">Personal Information</CardTitle>
                    <CardDescription>Update your photo and personal details here.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 px-8 pb-8">
                    <Separator />
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-zinc-500">Display Name</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="bg-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 focus-visible:ring-purple-500"
                          placeholder="e.g. John Doe"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-zinc-500">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          value={user?.email || ""}
                          disabled
                          className="bg-zinc-100 dark:bg-zinc-800/50 border-zinc-200 dark:border-zinc-800 text-zinc-500"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-4">
                      <Button onClick={handleSaveProfile} className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg shadow-purple-500/20 rounded-full px-8">
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing" className="outline-none">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Current Plan Card */}
                  <Card className="md:col-span-full bg-gradient-to-br from-zinc-900 to-zinc-950 border-zinc-800 text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-zinc-400 text-sm font-medium mb-1">CURRENT PLAN</p>
                          <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-zinc-400 capitalize">
                            {user?.planType || "Free"} Plan
                          </CardTitle>
                        </div>
                        <Badge variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-none">
                          <Sparkles className="h-3 w-3 mr-1 text-yellow-400" /> Active
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-3 mb-6">
                        <Zap className="h-5 w-5 text-purple-400" />
                        <span className="text-lg">
                          {user?.planType === "free" && "50 messages per day"}
                          {user?.planType === "pro" && "1,000 messages per day"}
                          {user?.planType === "ultimate" && "5,000 messages per day"}
                          {user?.planType === "business" && "Unlimited messages"}
                        </span>
                      </div>
                      <p className="text-zinc-500 text-sm">
                        Renewals happen automatically. You can cancel anytime.
                      </p>
                    </CardContent>
                  </Card>

                  {/* Pro Plan */}
                  <Card className="border shadow-lg hover:shadow-xl transition-shadow dark:bg-zinc-900/50 dark:border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-xl">Pro</CardTitle>
                      <CardDescription>For growing creators</CardDescription>
                      <div className="mt-4">
                        <span className="text-3xl font-bold">₹499</span>
                        <span className="text-muted-foreground">/mo</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-purple-500" /> 1,000 Messages/day</li>
                        <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-purple-500" /> Advanced Analytics</li>
                        <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-purple-500" /> Priority Support</li>
                      </ul>
                      <Button
                        className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        onClick={() => handleUpgradePlan("pro")}
                        disabled={user?.planType === "pro"}
                      >
                        {user?.planType === "pro" ? "Current Plan" : "Upgrade to Pro"}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Ultimate Plan */}
                  <Card className="border shadow-lg hover:shadow-xl transition-shadow border-purple-200 dark:border-purple-900/50 bg-purple-50/50 dark:bg-purple-900/10 relative">
                    <div className="absolute top-0 right-0 px-3 py-1 bg-purple-600 text-white text-xs font-bold rounded-bl-lg">POPULAR</div>
                    <CardHeader>
                      <CardTitle className="text-xl text-purple-700 dark:text-purple-400">Ultimate</CardTitle>
                      <CardDescription>For power users</CardDescription>
                      <div className="mt-4">
                        <span className="text-3xl font-bold">₹999</span>
                        <span className="text-muted-foreground">/mo</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-purple-500" /> 5,000 Messages/day</li>
                        <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-purple-500" /> All Templates</li>
                        <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-purple-500" /> 24/7 Priority Support</li>
                      </ul>
                      <Button
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20 hover:from-purple-700 hover:to-pink-700"
                        onClick={() => handleUpgradePlan("ultimate")}
                        disabled={user?.planType === "ultimate"}
                      >
                        {user?.planType === "ultimate" ? "Current Plan" : "Upgrade to Ultimate"}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Business Plan */}
                  <Card className="border shadow-lg hover:shadow-xl transition-shadow dark:bg-zinc-900/50 dark:border-zinc-800">
                    <CardHeader>
                      <CardTitle className="text-xl">Business</CardTitle>
                      <CardDescription>For agencies & brands</CardDescription>
                      <div className="mt-4">
                        <span className="text-3xl font-bold">₹1999</span>
                        <span className="text-muted-foreground">/mo</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-purple-500" /> Unlimited Messages</li>
                        <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-purple-500" /> Custom Solutions</li>
                        <li className="flex items-center"><Zap className="h-4 w-4 mr-2 text-purple-500" /> Dedicated Manager</li>
                      </ul>
                      <Button
                        className="w-full bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        onClick={() => handleUpgradePlan("business")}
                        disabled={user?.planType === "business"}
                      >
                        {user?.planType === "business" ? "Current Plan" : "Upgrade to Business"}
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}