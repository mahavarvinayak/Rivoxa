import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";
import { motion } from "framer-motion";
import { 
  ArrowLeft,
  Bot, 
  Loader2, 
  Plus,
  Settings,
  RefreshCw,
  Video
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";
import { FlowCard } from "@/components/flows/FlowCard";
import { ReelCard } from "@/components/flows/ReelCard";
import { CreateFlowDialog } from "@/components/flows/CreateFlowDialog";
import { Doc } from "@/convex/_generated/dataModel";

export default function Flows() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const flows = useQuery(api.flows.list);
  const reels = useQuery(api.media.listReels);
  const updateFlow = useMutation(api.flows.update);
  const deleteFlow = useMutation(api.flows.remove);
  const syncMedia = useAction(api.media.syncInstagramMedia);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string>("all_reels");
  const [isSyncing, setIsSyncing] = useState(false);
  const [editingFlow, setEditingFlow] = useState<Doc<"flows"> | null>(null);

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

  const handleSyncReels = async () => {
    setIsSyncing(true);
    try {
      await syncMedia();
      toast.success("Instagram reels synced successfully!");
    } catch (error) {
      toast.error("Failed to sync reels. Make sure Instagram is connected.");
      console.error(error);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleToggleFlow = async (flowId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === "active" ? "paused" : "active";
      await updateFlow({
        id: flowId as any,
        status: newStatus as any,
      });
      toast.success(`Flow ${newStatus === "active" ? "activated" : "paused"}`);
    } catch (error) {
      toast.error("Failed to update flow");
      console.error(error);
    }
  };

  const handleDeleteFlow = async (flowId: string) => {
    try {
      await deleteFlow({ id: flowId as any });
      toast.success("Flow deleted successfully");
    } catch (error) {
      toast.error("Failed to delete flow");
      console.error(error);
    }
  };

  const handleEditFlow = (flow: Doc<"flows">) => {
    setEditingFlow(flow);
    setIsCreateDialogOpen(true);
  };

  const handleCreateNew = (postId: string = "all_reels") => {
    setEditingFlow(null);
    setSelectedPostId(postId);
    setIsCreateDialogOpen(true);
  };

  const getFlowsForReel = (postId: string) => {
    return flows?.filter(flow => flow.trigger.postId === postId) || [];
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
              <Logo size="md" />
              <h1 className="text-xl font-bold tracking-tight">AutoFlow.AI</h1>
            </div>
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

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">Automation Flows</h2>
            <p className="text-muted-foreground">
              Create automated responses for Instagram and WhatsApp
            </p>
          </div>
          <Button className="shadow-md" onClick={() => handleCreateNew("all_reels")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Flow
          </Button>
        </motion.div>

        <CreateFlowDialog 
          open={isCreateDialogOpen} 
          onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) setEditingFlow(null);
          }}
          reels={reels}
          defaultPostId={selectedPostId}
          flowToEdit={editingFlow}
        />

        {/* Tabs for All Flows vs Per-Reel */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Flows</TabsTrigger>
            <TabsTrigger value="reels">
              <Video className="h-4 w-4 mr-2" />
              Per-Reel Automation
            </TabsTrigger>
          </TabsList>

          {/* All Flows Tab */}
          <TabsContent value="all">
            {!flows || flows.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="shadow-md">
                  <CardContent className="flex flex-col items-center justify-center py-16">
                    <Bot className="h-16 w-16 text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No flows yet</h3>
                    <p className="text-muted-foreground text-center mb-6">
                      Create your first automation flow to start engaging with your audience
                    </p>
                    <Button onClick={() => handleCreateNew("all_reels")}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Flow
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {flows.map((flow, index) => (
                  <motion.div
                    key={flow._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <FlowCard 
                      flow={flow} 
                      onToggle={handleToggleFlow} 
                      onDelete={handleDeleteFlow}
                      onEdit={handleEditFlow}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Per-Reel Tab */}
          <TabsContent value="reels">
            <div className="mb-4 flex justify-end">
              <Button onClick={handleSyncReels} disabled={isSyncing} variant="outline">
                <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                Sync Instagram Reels
              </Button>
            </div>

            {!reels || reels.length === 0 ? (
              <Card className="shadow-md">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <Video className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No reels found</h3>
                  <p className="text-muted-foreground text-center mb-6">
                    Connect your Instagram account and sync your reels to set up per-reel automation
                  </p>
                  <Button onClick={handleSyncReels} disabled={isSyncing}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
                    Sync Reels
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reels.map((reel, index) => {
                  const reelFlows = getFlowsForReel(reel.mediaId);
                  return (
                    <motion.div
                      key={reel.mediaId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <ReelCard 
                        reel={reel} 
                        flows={reelFlows} 
                        onAddFlow={(mediaId) => handleCreateNew(mediaId)} 
                      />
                    </motion.div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}