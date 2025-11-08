import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Loader2, 
  Settings as SettingsIcon,
  User,
  CreditCard,
  Bell,
  Shield
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Settings() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || "");
  const createPaymentOrder = useAction(api.payments.createPaymentOrder);
  const verifyPayment = useAction(api.payments.verifyPayment);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const handleUpgradePlan = async (planType: "starter" | "pro") => {
    try {
      const order = await createPaymentOrder({ planType });
      
      // Load Razorpay checkout script
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => {
        const options = {
          key: order.keyId,
          order_id: order.orderId,
          amount: order.amount,
          currency: order.currency,
          name: "ChatFlow AI",
          description: `${planType.charAt(0).toUpperCase() + planType.slice(1)} Plan Subscription`,
          handler: async (response: any) => {
            const verified = await verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              planType,
            });
            
            if (verified.verified) {
              toast.success("Payment successful! Plan upgraded.");
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
    toast.success("Profile updated successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <img src="/logo.png" alt="AutoFlow.AI" className="h-8 w-8" />
              <h1 className="text-xl font-bold tracking-tight">AutoFlow.AI</h1>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <SettingsIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
              <p className="text-muted-foreground">Manage your account and preferences</p>
            </div>
          </div>
        </motion.div>

        {/* Settings Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="billing">
                <CreditCard className="h-4 w-4 mr-2" />
                Billing
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>Update your account details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="bg-muted"
                    />
                    <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                  </div>
                  <Button onClick={handleSaveProfile}>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Billing Tab */}
            <TabsContent value="billing">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Billing & Subscription</CardTitle>
                  <CardDescription>Manage your plan and payment methods</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Current Plan</span>
                      <span className="text-lg font-bold capitalize">{user?.planType || "Free"}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {user?.planType === "free" && "50 messages per reel/day"}
                      {user?.planType === "starter" && "400 messages per reel/day"}
                      {user?.planType === "pro" && "1,000 messages per reel/day"}
                      {user?.planType === "enterprise" && "Unlimited messages"}
                    </p>
                  </div>
                  
                  {(!user?.planType || user?.planType === "free") && (
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => handleUpgradePlan("starter")}
                      >
                        Upgrade to Starter - $4/month
                      </Button>
                      <Button 
                        variant="default" 
                        className="w-full"
                        onClick={() => handleUpgradePlan("pro")}
                      >
                        Upgrade to Pro - $8/month
                      </Button>
                    </div>
                  )}
                  
                  {user?.planType === "starter" && (
                    <Button 
                      variant="default" 
                      className="w-full"
                      onClick={() => handleUpgradePlan("pro")}
                    >
                      Upgrade to Pro - $8/month
                    </Button>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what updates you want to receive</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Flow Execution Alerts</p>
                      <p className="text-sm text-muted-foreground">Get notified when flows execute</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Daily Reports</p>
                      <p className="text-sm text-muted-foreground">Receive daily analytics summaries</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card className="shadow-md">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <p className="font-medium mb-2">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Add an extra layer of security to your account
                    </p>
                    <Button variant="outline">Enable 2FA</Button>
                  </div>
                  <div className="p-4 rounded-lg bg-secondary/50">
                    <p className="font-medium mb-2">Active Sessions</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manage devices where you're logged in
                    </p>
                    <Button variant="outline">View Sessions</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}