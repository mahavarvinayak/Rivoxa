import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useMutation } from "convex/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface FlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reels: Doc<"instagramMedia">[] | undefined;
  defaultPostId?: string;
  flowToEdit?: Doc<"flows"> | null;
}

export function CreateFlowDialog({ open, onOpenChange, reels, defaultPostId = "all_reels", flowToEdit }: FlowDialogProps) {
  const createFlow = useMutation(api.flows.create);
  const updateFlow = useMutation(api.flows.update);
  
  const [flowName, setFlowName] = useState("");
  const [flowDescription, setFlowDescription] = useState("");
  const [triggerType, setTriggerType] = useState<string>("instagram_comment");
  const [keywords, setKeywords] = useState("");
  const [dmMessage, setDmMessage] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string>(defaultPostId);
  const [requireFollow, setRequireFollow] = useState(false);
  const [followReminder, setFollowReminder] = useState("");

  // Reset or populate form when opening/closing or changing flowToEdit
  useEffect(() => {
    if (open) {
      if (flowToEdit) {
        // Edit mode
        setFlowName(flowToEdit.name);
        setFlowDescription(flowToEdit.description || "");
        setTriggerType(flowToEdit.trigger.type);
        setKeywords(flowToEdit.trigger.keywords?.join(", ") || "");
        setSelectedPostId(flowToEdit.trigger.postId || "all_reels");
        setRequireFollow(flowToEdit.requireFollow || false);
        setFollowReminder(flowToEdit.followReminder || "");
        
        // Extract DM message from actions
        const dmAction = flowToEdit.actions.find(a => a.type === "send_dm");
        if (dmAction) {
          setDmMessage(dmAction.config.message || "");
        }
      } else {
        // Create mode - reset to defaults
        setFlowName("");
        setFlowDescription("");
        setTriggerType("instagram_comment");
        setKeywords("");
        setDmMessage("");
        setSelectedPostId(defaultPostId);
        setRequireFollow(false);
        setFollowReminder("");
      }
    }
  }, [open, flowToEdit, defaultPostId]);

  const handleSaveFlow = async () => {
    if (!flowName || !dmMessage) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const flowData = {
        name: flowName,
        description: flowDescription,
        trigger: {
          type: triggerType as any,
          keywords: keywords ? keywords.split(",").map(k => k.trim()).filter(k => k.length > 0) : undefined,
          postId: selectedPostId && selectedPostId !== "all_reels" ? selectedPostId : undefined,
        },
        requireFollow,
        followReminder: requireFollow ? followReminder : undefined,
        actions: [
          {
            type: "send_dm",
            config: { message: dmMessage },
          },
        ],
      };

      if (flowToEdit) {
        await updateFlow({
          id: flowToEdit._id,
          ...flowData,
        });
        toast.success("Flow updated successfully!");
      } else {
        await createFlow(flowData);
        toast.success("Flow created successfully!");
      }

      onOpenChange(false);
    } catch (error) {
      toast.error(flowToEdit ? "Failed to update flow" : "Failed to create flow");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{flowToEdit ? "Edit Flow" : "Create New Flow"}</DialogTitle>
          <DialogDescription>
            {flowToEdit ? "Update your automation flow settings" : "Set up an automated response flow for your social media"}
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

          <div className="flex items-center space-x-2 py-2">
            <Switch
              id="require-follow"
              checked={requireFollow}
              onCheckedChange={setRequireFollow}
            />
            <Label htmlFor="require-follow">Require user to follow before DM</Label>
          </div>

          {requireFollow && (
            <div className="space-y-2 pl-6 border-l-2 border-primary/20">
              <Label htmlFor="follow-reminder">Follow Reminder Message</Label>
              <Textarea
                id="follow-reminder"
                placeholder="Hey! Please follow us to receive the link via DM."
                value={followReminder}
                onChange={(e) => setFollowReminder(e.target.value)}
                rows={2}
              />
              <p className="text-xs text-muted-foreground">
                This message will be replied to their comment if they don't follow you.
              </p>
            </div>
          )}

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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveFlow}>
            {flowToEdit ? "Update Flow" : "Create Flow"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}