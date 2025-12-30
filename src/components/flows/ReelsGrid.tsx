import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Video, Plus, RefreshCw } from "lucide-react";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useState } from "react";

interface ReelsGridProps {
  reels: any[];
  flows: any[];
  onAddFlow: (mediaId: string) => void;
}

export function ReelsGrid({ reels, flows, onAddFlow }: ReelsGridProps) {
  const syncMedia = useAction(api.media.syncInstagramMedia);
  const [isSyncing, setIsSyncing] = useState(false);

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

  const getFlowsForReel = (postId: string) => {
    return flows?.filter(flow => flow.trigger.postId === postId) || [];
  };

  return (
    <div>
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
                    <div className="aspect-video bg-secondary rounded-t-lg overflow-hidden relative group">
                      {reel.thumbnailUrl ? (
                        <img 
                          src={reel.thumbnailUrl} 
                          alt={reel.caption}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="h-12 w-12 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => onAddFlow(reel.mediaId)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Automation
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <CardTitle className="text-sm mb-2 line-clamp-2 h-10">
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
                      </div>
                      {reelFlows.length > 0 && (
                        <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                          {reelFlows.map((flow: any) => (
                            <div
                              key={flow._id}
                              className="flex items-center justify-between p-2 rounded bg-secondary/50 text-xs"
                            >
                              <span className="truncate flex-1">{flow.name}</span>
                              <Badge
                                variant={flow.status === "active" ? "default" : "secondary"}
                                className="text-xs ml-2"
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
    </div>
  );
}
