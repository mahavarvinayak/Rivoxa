import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Doc } from "@/convex/_generated/dataModel";
import { Pause, Play, Trash2, Zap, Pencil } from "lucide-react";

interface FlowCardProps {
  flow: Doc<"flows">;
  onToggle: (id: string, status: string) => void;
  onDelete: (id: string) => void;
  onEdit: (flow: Doc<"flows">) => void;
}

export function FlowCard({ flow, onToggle, onDelete, onEdit }: FlowCardProps) {
  return (
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
          {flow.requireFollow && (
            <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800 hover:bg-blue-200">
              Requires Follow
            </Badge>
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
              onClick={() => onToggle(flow._id, flow.status)}
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
              variant="outline"
              size="sm"
              onClick={() => onEdit(flow)}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(flow._id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}