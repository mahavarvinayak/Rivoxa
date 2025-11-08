import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Trash2,
  Zap,
  Play,
  Pause,
  RefreshCw,
  Video
} from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Flows() {
  const { isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const flows = useQuery(api.flows.list);
  const reels = useQuery(api.media.listReels);
  const createFlow = useMutation(api.flows.create);
  const updateFlow = useMutation(api.flows.update);
  const deleteFlow = useMutation(api.flows.remove);
  const syncMedia = useAction(api.media.syncInstagramMedia);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [flowName, setFlowName] = useState("");
  const [flowDescription, setFlowDescription] = useState("");
  const [triggerType, setTriggerType] = useState<string>("instagram_comment");
  const [keywords, setKeywords] = useState("");
  const [dmMessage, setDmMessage] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string>("all_reels");
  const [isSyncing, setIsSyncing] = useState(false);

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

  const handleCreateFlow = async () => {
    if (!flowName || !dmMessage) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createFlow({
        name: flowName,
        description: flowDescription,
        trigger: {
          type: triggerType as any,
          keywords: keywords ? keywords.split(",").map(k => k.trim()) : undefined,
          postId: selectedPostId && selectedPostId !== "all_reels" ? selectedPostId : undefined,
        },
        actions: [
          {
            type: "send_dm",
            config: { message: dmMessage },
          },
        ],
      });

      toast.success("Flow created successfully!");
      setIsCreateDialogOpen(false);
      setFlowName("");
      setFlowDescription("");
      setKeywords("");
      setDmMessage("");
      setSelectedPostId("all_reels");
    } catch (error) {
      toast.error("Failed to create flow");
      console.error(error);
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
              <img src="/assets/ChatFlow_Logo_new.png" alt="AutoFlow.AI" className="h-8 w-8" />
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
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Create Flow
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Flow</DialogTitle>
                <DialogDescription>
                  Set up an automated response flow for your social media
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Flow Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Comment to DM - Product Link"
                    value={flowName}
                    onChange={(e) => setFlowName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="What does this flow do?"
                    value={flowDescription}
                    onChange={(e) => setFlowDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="trigger">Trigger Type</Label>
                  <Select value={triggerType} onValueChange={setTriggerType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="instagram_comment">Instagram Comment</SelectItem>
                      <SelectItem value="instagram_dm">Instagram DM</SelectItem>
                      <SelectItem value="instagram_story_mention">Instagram Story Mention</SelectItem>
                      <SelectItem value="instagram_story_reply">Instagram Story Reply</SelectItem>
                      <SelectItem value="whatsapp_message">WhatsApp Message</SelectItem>
                      <SelectItem value="keyword">Keyword</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="post">Specific Reel (Optional)</Label>
                  <Select value={selectedPostId} onValueChange={setSelectedPostId}>
                    <SelectTrigger>
                      <SelectValue placeholder="All reels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all_reels">All reels</SelectItem>
                      {reels?.map((reel) => (
                        <SelectItem key={reel.mediaId} value={reel.mediaId}>
                          {reel.caption.substring(0, 50)}...
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Leave empty to apply to all reels
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="keywords">Keywords (comma-separated)</Label>
                  <Input
                    id="keywords"
                    placeholder="e.g., link, info, price"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Flow will trigger when any of these keywords are detected
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">DM Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="Hi! Thanks for your interest. Here's the link: https://..."
                    value={dmMessage}
                    onChange={(e) => setDmMessage(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateFlow}>Create Flow</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>

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
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
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
                    <Card className="shadow-md hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1">{flow.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {flow.description || "No description"}
                            </CardDescription>
                          </div>
                          <Badge variant={flow.status === "active" ? "default" : "secondary"}>
                            {flow.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-sm">
                            <Zap className="h-4 w-4 text-primary" />
                            <span className="text-muted-foreground">
                              Trigger: {flow.trigger.type.replace(/_/g, " ")}
                            </span>
                          </div>
                          {flow.trigger.postId && (
                            <Badge variant="outline" className="text-xs">
                              Specific Reel
                            </Badge>
                          )}
                          {flow.trigger.keywords && flow.trigger.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {flow.trigger.keywords.map((keyword, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="pt-2 border-t">
                            <div className="text-xs text-muted-foreground mb-2">Stats</div>
                            <div className="grid grid-cols-3 gap-2 text-center">
                              <div>
                                <div className="text-lg font-bold">{flow.totalExecutions || 0}</div>
                                <div className="text-xs text-muted-foreground">Total</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-green-600">
                                  {flow.successfulExecutions || 0}
                                </div>
                                <div className="text-xs text-muted-foreground">Success</div>
                              </div>
                              <div>
                                <div className="text-lg font-bold text-red-600">
                                  {flow.failedExecutions || 0}
                                </div>
                                <div className="text-xs text-muted-foreground">Failed</div>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleToggleFlow(flow._id, flow.status)}
                            >
                              {flow.status === "active" ? (
                                <>
                                  <Pause className="h-3 w-3 mr-1" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="h-3 w-3 mr-1" />
                                  Activate
                                </>
                              )}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteFlow(flow._id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
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
                      <Card className="shadow-md hover:shadow-lg transition-shadow">
                        <CardHeader className="p-0">
                          <div className="aspect-video bg-secondary rounded-t-lg overflow-hidden">
                            {reel.thumbnailUrl ? (
                              <img 
                                src={reel.thumbnailUrl} 
                                alt={reel.caption}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Video className="h-12 w-12 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <CardTitle className="text-sm mb-2 line-clamp-2">
                            {reel.caption || "No caption"}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                            <span>❤️ {reel.likeCount}</span>
                            <span>💬 {reel.commentsCount}</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                {reelFlows.length} Flow{reelFlows.length !== 1 ? "s" : ""}
                              </span>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedPostId(reel.mediaId);
                                  setIsCreateDialogOpen(true);
                                }}
                              >
                                <Plus className="h-3 w-3 mr-1" />
                                Add Flow
                              </Button>
                            </div>
                            {reelFlows.length > 0 && (
                              <div className="space-y-1">
                                {reelFlows.map((flow) => (
                                  <div
                                    key={flow._id}
                                    className="flex items-center justify-between p-2 rounded bg-secondary/50 text-xs"
                                  >
                                    <span className="truncate flex-1">{flow.name}</span>
                                    <Badge
                                      variant={flow.status === "active" ? "default" : "secondary"}
                                      className="text-xs"
                                    >
                                      {flow.status}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
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