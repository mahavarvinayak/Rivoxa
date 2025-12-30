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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface CreateFlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reels?: any[];
  defaultPostId?: string;
}

export function CreateFlowDialog({ open, onOpenChange, reels, defaultPostId = "all_reels" }: CreateFlowDialogProps) {
  const createFlow = useMutation(api.flows.create);
  
  const [flowName, setFlowName] = useState("");
  const [flowDescription, setFlowDescription] = useState("");
  const [triggerType, setTriggerType] = useState<string>("instagram_comment");
  const [keywords, setKeywords] = useState("");
  const [dmMessage, setDmMessage] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string>(defaultPostId);
  const [requireFollow, setRequireFollow] = useState(false);

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
          requireFollow: requireFollow,
        },
        actions: [
          {
            type: "send_dm",
            config: { message: dmMessage },
          },
        ],
      });

      toast.success("Flow created successfully!");
      onOpenChange(false);
      
      // Reset form
      setFlowName("");
      setFlowDescription("");
      setKeywords("");
      setDmMessage("");
      setRequireFollow(false);
      setSelectedPostId(defaultPostId);
    } catch (error) {
      toast.error("Failed to create flow");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      {reel.caption.substring(0, 30)}...
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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

          <div className="flex items-center space-x-2 border p-3 rounded-md bg-secondary/20">
            <Switch 
              id="require-follow" 
              checked={requireFollow}
              onCheckedChange={setRequireFollow}
            />
            <div className="flex-1">
              <Label htmlFor="require-follow" className="font-medium cursor-pointer">Require user to follow before DM</Label>
              <p className="text-xs text-muted-foreground">
                If enabled, the DM will only be sent if the user follows your account.
              </p>
            </div>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateFlow}>Create Flow</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
