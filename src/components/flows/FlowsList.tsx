import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Bot, Plus, Zap, Play, Pause, Trash2, UserCheck } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

interface FlowsListProps {
  flows: any[];
  onCreateClick: () => void;
}

export function FlowsList({ flows, onCreateClick }: FlowsListProps) {
  const updateFlow = useMutation(api.flows.update);
  const deleteFlow = useMutation(api.flows.remove);

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

  if (!flows || flows.length === 0) {
    return (
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
            <Button onClick={onCreateClick}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Flow
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {flows.map((flow, index) => (
        <motion.div
          key={flow._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
        >
          <Card className="shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-1 line-clamp-1">{flow.name}</CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {flow.description || "No description"}
                  </CardDescription>
                </div>
                <Badge variant={flow.status === "active" ? "default" : "secondary"}>
                  {flow.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-2 text-sm">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">
                    Trigger: {flow.trigger.type.replace(/_/g, " ")}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {flow.trigger.postId && (
                    <Badge variant="outline" className="text-xs">
                      Specific Reel
                    </Badge>
                  )}
                  {flow.trigger.requireFollow && (
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      <UserCheck className="h-3 w-3 mr-1" />
                      Follow Required
                    </Badge>
                  )}
                </div>

                {flow.trigger.keywords && flow.trigger.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {flow.trigger.keywords.map((keyword: string, i: number) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="pt-4 mt-4 border-t">
                <div className="text-xs text-muted-foreground mb-2">Stats</div>
                <div className="grid grid-cols-3 gap-2 text-center mb-4">
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
                
                <div className="flex gap-2">
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
  );
}
