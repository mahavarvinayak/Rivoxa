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
import { useAuth } from "@/hooks/use-auth";
import { PLAN_TYPES } from "@/convex/schema";
import { FLOW_TEMPLATES, FlowTemplate } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, Sparkles, LayoutTemplate } from "lucide-react";

interface CreateFlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reels?: any[];
  defaultPostId?: string;
}

export function CreateFlowDialog({ open, onOpenChange, reels, defaultPostId = "all_reels" }: CreateFlowDialogProps) {
  const { user } = useAuth();
  const createFlow = useMutation(api.flows.create);
  const isPaidPlan = user?.planType === "pro" || user?.planType === "ultimate" || user?.planType === "business";

  const [step, setStep] = useState<1 | 2>(1);
  const [selectedTemplate, setSelectedTemplate] = useState<FlowTemplate | null>(null);

  const [flowName, setFlowName] = useState("");
  const [flowDescription, setFlowDescription] = useState("");
  const [triggerType, setTriggerType] = useState<string>("instagram_comment");
  const [keywords, setKeywords] = useState("");
  const [dmMessage, setDmMessage] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string>(defaultPostId);
  const [requireFollow, setRequireFollow] = useState(false);

  const handleTemplateSelect = (template: FlowTemplate | null) => {
    setSelectedTemplate(template);
    if (template) {
      setFlowName(template.name);
      setFlowDescription(template.description);
      // Pre-select trigger from template logic (first node)
      const firstTrigger = template.nodes.find(n => n.type === 'trigger');
      if (firstTrigger?.data?.triggerType) {
        setTriggerType(firstTrigger.data.triggerType as string);
      }
    } else {
      setFlowName("");
      setFlowDescription("");
      setTriggerType("instagram_comment");
    }
    setStep(2);
  };

  const handleCreateFlow = async () => {
    if (!flowName) {
      toast.error("Please enter a flow name");
      return;
    }
    // Only strictly require DM message if NOT using a template (templates have their own logic/nodes)
    if (!selectedTemplate && !dmMessage) {
      toast.error("Please enter a default DM message");
      return;
    }

    try {
      let nodes = [];
      let edges = [];

      if (selectedTemplate) {
        nodes = selectedTemplate.nodes;
        edges = selectedTemplate.edges;
      } else {
        // "Blank" flow logic: Create basic Trigger -> Action nodes
        nodes = [
          { id: '1', type: 'trigger', position: { x: 250, y: 0 }, data: { triggerType } },
          { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { actionType: 'send_dm', config: { message: dmMessage } } },
        ];
        edges = [
          { id: 'e1-2', source: '1', target: '2' }
        ];
      }

      await createFlow({
        name: flowName,
        description: flowDescription,
        trigger: {
          type: triggerType as any,
          keywords: keywords ? keywords.split(",").map(k => k.trim()) : undefined,
          postId: selectedPostId && selectedPostId !== "all_reels" ? selectedPostId : undefined,
          requireFollow: requireFollow,
        },
        actions: [], // Deprecated linear actions, relying on nodes/edges now
        nodes: nodes,
        edges: edges,
      });

      toast.success("Flow created successfully!");
      onOpenChange(false);

      // Reset
      setStep(1);
      setSelectedTemplate(null);
      setFlowName("");
      setFlowDescription("");
      setKeywords("");
      setDmMessage("");

    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create flow");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) setStep(1); // Reset on close
      onOpenChange(val);
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{step === 1 ? "Choose a Template" : "Customize Flow"}</DialogTitle>
          <DialogDescription>
            {step === 1 ? "Start from scratch or use a pre-built automation template." : "Configure your flow settings."}
          </DialogDescription>
        </DialogHeader>

        {step === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            {/* Blank Template */}
            <div
              onClick={() => handleTemplateSelect(null)}
              className="cursor-pointer group relative flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 rounded-xl hover:border-primary hover:bg-slate-50 transition-all"
            >
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <LayoutTemplate className="h-6 w-6 text-slate-500" />
              </div>
              <h3 className="font-semibold text-slate-900">Start from Scratch</h3>
              <p className="text-sm text-slate-500 text-center mt-1">Build your own custom flow.</p>
            </div>

            {FLOW_TEMPLATES.map((template) => {
              const Icon = template.icon;
              return (
                <div
                  key={template.id}
                  onClick={() => handleTemplateSelect(template)}
                  className="cursor-pointer group relative flex flex-col p-6 border border-slate-200 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all bg-white"
                >
                  <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center mb-4 text-white shadow-sm", template.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-slate-900">{template.name}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{template.description}</p>
                  <div className="mt-4 flex items-center text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Use Template <ArrowLeft className="h-3 w-3 ml-1 rotate-180" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="-ml-2 mb-2">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Templates
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Flow Name *</Label>
                  <Input
                    id="name"
                    value={flowName}
                    onChange={(e) => setFlowName(e.target.value)}
                    placeholder="e.g. My Awesome Flow"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={flowDescription}
                    onChange={(e) => setFlowDescription(e.target.value)}
                    placeholder="What does this flow do?"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Trigger Type</Label>
                  <Select value={triggerType} onValueChange={setTriggerType} disabled={!!selectedTemplate}>
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
                  {selectedTemplate && <p className="text-xs text-muted-foreground">Determined by template</p>}
                </div>

                <div className="space-y-2">
                  <Label>Keywords (Optional)</Label>
                  <Input
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    placeholder="e.g. price, link, info"
                  />
                </div>
              </div>
            </div>

            {!selectedTemplate && (
              <div className="space-y-2 pt-2 border-t">
                <Label>Initial DM Message (Required for Blank Flow)</Label>
                <Textarea
                  value={dmMessage}
                  onChange={(e) => setDmMessage(e.target.value)}
                  placeholder="Enter the first message to send..."
                />
              </div>
            )}

            {/* Simplified settings for quickstart */}
          </div>
        )}

        <DialogFooter>
          {step === 2 && (
            <Button onClick={handleCreateFlow}>
              <Sparkles className="h-4 w-4 mr-2" />
              {selectedTemplate ? `Create "${selectedTemplate.name}"` : "Create Flow"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
