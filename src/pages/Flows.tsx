import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation, useAction } from "convex/react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Zap
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
import { useState } from "react";
import { Logo } from "@/components/Logo";

export default function Flows() {
  const { isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const flows = useQuery(api.flows.list);
  const createFlow = useMutation(api.flows.create);
  const syncMedia = useAction(api.media.syncInstagramMedia);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [flowName, setFlowName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate("/auth");
    return null;
  }

  const handleCreateFlow = async () => {
    if (!flowName) {
      toast.error("Please enter a flow name");
      return;
    }

    setIsCreating(true);
    try {
      const flowId = await createFlow({
        name: flowName,
        description: "New automation flow",
        trigger: {
          type: "instagram_comment", // Default
        } as any,
        actions: [],
        nodes: [
          { id: 'start', type: 'trigger', position: { x: 100, y: 100 }, data: { triggerType: 'instagram_comment' } },
        ],
        edges: [],
      });

      toast.success("Flow created!");
      setIsCreateDialogOpen(false);
      setFlowName("");
      // Redirect to the new Visual Editor
      navigate(`/flows/${flowId}/editor`);
    } catch (error) {
      toast.error("Failed to create flow");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSyncReels = async () => {
    setIsSyncing(true);
    try {
      await syncMedia();
      toast.success("Instagram data synced!");
    } catch (error) {
      toast.error("Failed to sync.");
    } finally {
      setIsSyncing(false);
    }
  };

  const filteredFlows = flows?.filter(flow =>
    flow.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <Logo size="sm" />
            <span className="font-bold text-xl tracking-tight hidden md:block">Rivoxa</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleSyncReels} disabled={isSyncing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isSyncing ? "animate-spin" : ""}`} />
              Sync Data
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate("/settings")}>
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Automation Flows</h1>
            <p className="text-slate-500 mt-1">Manage your chatbots and automated responses.</p>
          </div>

          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search flows..."
                className="pl-9 w-[200px] md:w-[250px] bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="shadow-lg shadow-blue-500/20">
                  <Plus className="h-4 w-4 mr-2" />
                  New Flow
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Flow</DialogTitle>
                  <DialogDescription>
                    Give your automation a name to get started.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="name">Flow Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Discount Auto-Reply"
                    value={flowName}
                    onChange={(e) => setFlowName(e.target.value)}
                    className="mt-2"
                    autoFocus
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateFlow} disabled={isCreating}>
                    {isCreating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Start Building
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {!filteredFlows || filteredFlows.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed"
          >
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No flows found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mt-2 mb-6">
              {searchQuery ? "Try adjusting your search terms." : "Create your first automation flow to start engaging with your audience automatically."}
            </p>
            {!searchQuery && (
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Flow
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlows.map((flow, idx) => (
              <motion.div
                key={flow._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate(`/flows/${flow._id}/editor`)}
                className="group cursor-pointer"
              >
                <Card className="h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200 overflow-hidden">
                  <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/50">
                    <div className="flex justify-between items-start mb-1">
                      <div className={`p-2 rounded-lg ${flow.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        <Zap className="h-4 w-4" />
                      </div>
                      <Badge variant={flow.status === 'active' ? 'default' : 'secondary'} className={flow.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}>
                        {flow.status}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-1 group-hover:text-blue-600 transition-colors">
                      {flow.name}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 text-xs">
                      {flow.description || "No description provided."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="flex justify-between items-center text-sm text-slate-500">
                      <div>
                        <span className="font-semibold text-slate-900">{flow.totalExecutions || 0}</span> runs
                      </div>
                      <div className="flex items-center text-blue-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Edit Flow <ArrowRight className="h-3 w-3 ml-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}