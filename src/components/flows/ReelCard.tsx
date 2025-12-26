import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { Plus, Video } from "lucide-react";

interface ReelCardProps {
  reel: Doc<"instagramMedia">;
  flows: Doc<"flows">[];
  onAddFlow: (mediaId: string) => void;
}

export function ReelCard({ reel, flows, onAddFlow }: ReelCardProps) {
  return (
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
              {flows.length} Flow{flows.length !== 1 ? "s" : ""}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onAddFlow(reel.mediaId)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Flow
            </Button>
          </div>
          {flows.length > 0 && (
            <div className="space-y-1">
              {flows.map((flow) => (
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
  );
}
