import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import { motion } from "framer-motion";
import { 
  AlertCircle,
  CheckCircle2,
  Instagram, 
  Loader2, 
  MessageSquare, 
  Settings,
  Unplug
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function Integrations() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const integrations = useQuery(api.integrations.list);
  const disconnect = useMutation(api.integrations.disconnect);
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);

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

  const instagramIntegration = integrations?.find(i => i.type === "instagram");
  const whatsappIntegration = integrations?.find(i => i.type === "whatsapp");

  const handleConnect = (platform: "instagram" | "whatsapp") => {
    // Check if META_APP_ID is configured
    const clientId = import.meta.env.VITE_META_APP_ID;
    
    if (!clientId) {
      toast.error("Meta App ID not configured. Please add VITE_META_APP_ID to your environment variables.");
      return;
    }
    
    // Use popup window for OAuth
    const baseUrl = window.location.origin;
    const redirectUri = `${baseUrl}/api/oauth/callback/${platform}`;
    
    const scope = platform === "instagram" 
      ? "instagram_basic,instagram_manage_messages,instagram_manage_comments"
      : "whatsapp_business_management,whatsapp_business_messaging";
    
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;
    
    // Open OAuth in popup window
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    const popup = window.open(
      authUrl,
      `${platform}_oauth`,
      `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no,scrollbars=yes`
    );
    
    if (!popup) {
      toast.error("Popup blocked. Please allow popups for this site.");
      return;
    }
    
    // Listen for OAuth callback
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "oauth-success" && event.data?.platform === platform) {
        toast.success(`${platform === "instagram" ? "Instagram" : "WhatsApp"} connected successfully!`);
        window.removeEventListener("message", handleMessage);
        // Refresh integrations list
        window.location.reload();
      } else if (event.data?.type === "oauth-error" && event.data?.platform === platform) {
        toast.error(`Failed to connect ${platform}: ${event.data.error}`);
        window.removeEventListener("message", handleMessage);
      }
    };
    
    window.addEventListener("message", handleMessage);
    
    // Clean up listener after 5 minutes
    setTimeout(() => {
      window.removeEventListener("message", handleMessage);
    }, 5 * 60 * 1000);
  };

  const handleDisconnect = async (integrationId: string, platform: string) => {
    try {
      await disconnect({ id: integrationId as any });
      toast.success(`${platform} disconnected successfully`);
      setDisconnectingId(null);
    } catch (error) {
      toast.error(`Failed to disconnect ${platform}`);
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <img src="/logo.svg" alt="AutoFlow.AI" className="h-8 w-8" />
            <h1 className="text-xl font-bold tracking-tight">AutoFlow.AI</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Integrations
          </h2>
          <p className="text-muted-foreground mb-8">
            Connect your Instagram and WhatsApp Business accounts to start automating
          </p>
        </motion.div>

        {/* Integration Cards */}
        <div className="space-y-4">
          {/* Instagram Integration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                      <Instagram className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Instagram</CardTitle>
                      <CardDescription>
                        Auto-respond to comments and DMs
                      </CardDescription>
                    </div>
                  </div>
                  {instagramIntegration?.isActive ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Not Connected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {instagramIntegration?.isActive ? (
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Username:</strong> @{instagramIntegration.platformUsername || "N/A"}</p>
                      <p><strong>Account ID:</strong> {instagramIntegration.platformUserId}</p>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={() => setDisconnectingId(instagramIntegration._id)}
                      className="w-full sm:w-auto"
                    >
                      <Unplug className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleConnect("instagram")}
                    className="w-full sm:w-auto"
                  >
                    <Instagram className="h-4 w-4 mr-2" />
                    Connect Instagram
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* WhatsApp Integration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-md">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">WhatsApp Business</CardTitle>
                      <CardDescription>
                        Automate customer support messages
                      </CardDescription>
                    </div>
                  </div>
                  {whatsappIntegration?.isActive ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Not Connected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {whatsappIntegration?.isActive ? (
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Business Account:</strong> {whatsappIntegration.businessAccountId || "N/A"}</p>
                      <p><strong>Phone Number ID:</strong> {whatsappIntegration.phoneNumberId || "N/A"}</p>
                    </div>
                    <Button 
                      variant="destructive" 
                      onClick={() => setDisconnectingId(whatsappIntegration._id)}
                      className="w-full sm:w-auto"
                    >
                      <Unplug className="h-4 w-4 mr-2" />
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => handleConnect("whatsapp")}
                    className="w-full sm:w-auto"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Connect WhatsApp
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Setup Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <Card className="shadow-md bg-muted/50">
            <CardHeader>
              <CardTitle className="text-lg">Setup Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Before connecting:</h4>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Create a Meta Developer account at <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">developers.facebook.com</a></li>
                  <li>Create a new app and add Instagram/WhatsApp products</li>
                  <li>Configure OAuth redirect URIs in your app settings:
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li><code className="text-xs bg-background px-1 py-0.5 rounded">{window.location.origin}/api/oauth/callback/instagram</code></li>
                      <li><code className="text-xs bg-background px-1 py-0.5 rounded">{window.location.origin}/api/oauth/callback/whatsapp</code></li>
                    </ul>
                  </li>
                  <li>Add environment variables in the <strong>API Keys</strong> tab:
                    <ul className="list-disc list-inside ml-6 mt-1">
                      <li><strong>Frontend:</strong> <code className="text-xs bg-background px-1 py-0.5 rounded">VITE_META_APP_ID</code> (your Meta App ID)</li>
                      <li><strong>Backend:</strong> <code className="text-xs bg-background px-1 py-0.5 rounded">META_APP_ID</code>, <code className="text-xs bg-background px-1 py-0.5 rounded">META_APP_SECRET</code>, <code className="text-xs bg-background px-1 py-0.5 rounded">SITE_URL</code></li>
                    </ul>
                  </li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Required permissions:</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li><strong>Instagram:</strong> instagram_basic, instagram_manage_messages, instagram_manage_comments</li>
                  <li><strong>WhatsApp:</strong> whatsapp_business_management, whatsapp_business_messaging</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Disconnect Confirmation Dialog */}
      <AlertDialog open={!!disconnectingId} onOpenChange={() => setDisconnectingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect Integration?</AlertDialogTitle>
            <AlertDialogDescription>
              This will stop all automation flows using this integration. You can reconnect at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (disconnectingId) {
                  const integration = integrations?.find(i => i._id === disconnectingId);
                  handleDisconnect(disconnectingId, integration?.type || "integration");
                }
              }}
            >
              Disconnect
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
