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
import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { FLOW_TEMPLATES, FlowTemplate } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { ArrowLeft, Sparkles, Zap, GitBranch, LayoutTemplate, MessageCircle, Bot } from "lucide-react";
import { useNavigate } from "react-router";

interface CreateFlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reels?: any[];
  defaultPostId?: string;
}

export function CreateFlowDialog({ open, onOpenChange, reels, defaultPostId = "all_reels" }: CreateFlowDialogProps) {
  const createFlow = useMutation(api.flows.create);
  const navigate = useNavigate();

  // Mode: 'selection' | 'quick' | 'advanced' | 'template_config'
  const [mode, setMode] = useState<'selection' | 'quick' | 'advanced' | 'template_config'>('selection');
  const [selectedTemplate, setSelectedTemplate] = useState<FlowTemplate | null>(null);

  // Form State
  const [flowName, setFlowName] = useState("");
  const [flowDescription, setFlowDescription] = useState("");
  const [triggerType, setTriggerType] = useState<string>("instagram_comment");
  const [keywords, setKeywords] = useState("");
  const [dmMessage, setDmMessage] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string>(defaultPostId);
  const [isLoading, setIsLoading] = useState(false);

  const handleModeSelect = (newMode: 'quick' | 'advanced') => {
    setMode(newMode);
    setFlowName("");
    setFlowDescription("");
    setTriggerType("instagram_comment");
    setKeywords("");
    setDmMessage("");
  };

  const handleTemplateSelect = (template: FlowTemplate | null) => {
    setSelectedTemplate(template);
    if (template) {
      setFlowName(template.name);
      setFlowDescription(template.description);
      const firstTrigger = template.nodes.find(n => n.type === 'trigger');
      if (firstTrigger?.data?.triggerType) {
        setTriggerType(firstTrigger.data.triggerType as string);
      }
    } else {
      setFlowName("");
      setFlowDescription("Custom flow started from scratch.");
    }
    setMode('template_config');
  };

  const handleCreate = async () => {
    if (!flowName.trim()) {
      toast.error("Please enter a flow name");
      return;
    }

    setIsLoading(true);

    try {
      let nodes: any[] = [];
      let edges: any[] = [];

      // LOGIC GENERATION
      if (mode === 'quick') {
        // Quick Mode: Generate simple 2-node flow
        nodes = [
          { id: 'start', type: 'trigger', position: { x: 250, y: 50 }, data: { triggerType } },
          { id: 'action-1', type: 'action', position: { x: 250, y: 250 }, data: { actionType: 'send_dm', config: { message: dmMessage || "Hello!" } } },
        ];
        edges = [
          { id: 'e1', source: 'start', target: 'action-1' }
        ];
      } else if (selectedTemplate) {
        nodes = selectedTemplate.nodes;
        edges = selectedTemplate.edges;
      } else {
        // Advanced Blank
        nodes = [
          { id: 'start', type: 'trigger', position: { x: 100, y: 100 }, data: { triggerType } },
        ];
        edges = [];
      }

      const flowId = await createFlow({
        name: flowName,
        description: flowDescription,
        trigger: {
          type: triggerType as any,
          keywords: keywords ? keywords.split(",").map(k => k.trim()) : undefined,
          postId: selectedPostId && selectedPostId !== "all_reels" ? selectedPostId : undefined,
        },
        actions: [],
        nodes,
        edges,
      });

      toast.success("Flow created successfully! 🚀");
      onOpenChange(false);

      // Navigation Logic
      if (mode === 'quick') {
        // For quick mode, maybe just stay on list or go to editor?
        // User said "won't have time to build workflow", so assume they want it done.
        // But let's open editor so they see it works.
        navigate(`/flows/${flowId}`);
      } else {
        navigate(`/flows/${flowId}`);
      }

      // Reset
      setMode('selection');
      setSelectedTemplate(null);

    } catch (error) {
      console.error(error);
      toast.error("Failed to create flow. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      if (!val) setMode('selection');
      onOpenChange(val);
    }}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0 gap-0 bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">

        {/* Helper Header */}
        <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {mode === 'selection' && "Create New Automation"}
              {mode === 'quick' && "⚡ Quick Auto-Reply"}
              {(mode === 'advanced' || mode === 'template_config') && "🧠 Visual Workflow Builder"}
            </DialogTitle>
            <DialogDescription className="text-zinc-500">
              {mode === 'selection' && "Choose how you want to build your automation flow today."}
              {mode === 'quick' && "Set up a simple trigger and reply in seconds."}
              {(mode === 'advanced' || mode === 'template_config') && "Design powerful logic with the visual graph editor."}
            </DialogDescription>
          </DialogHeader>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {mode === 'selection' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Quick Builder Card */}
              <div
                onClick={() => handleModeSelect('quick')}
                className="group relative cursor-pointer rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 p-6 hover:border-indigo-500 hover:bg-slate-50/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">Quick Auto-Reply</h3>
                <p className="text-sm text-zinc-500">Best for simple responses. Just set a keyword and a reply message. Done in 10 seconds.</p>
                <div className="mt-4 flex items-center text-xs font-semibold text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Start Quick Builder &rarr;
                </div>
              </div>

              {/* Advanced Builder Card */}
              <div
                onClick={() => setMode('advanced')}
                className="group relative cursor-pointer rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 p-6 hover:border-purple-500 hover:bg-slate-50/50 hover:shadow-xl transition-all duration-300"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <GitBranch className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-zinc-900 dark:text-zinc-100">Visual Flow Editor</h3>
                <p className="text-sm text-zinc-500">Full drag-and-drop canvas. Use logic, delays, conditions, and templates. The Pro choice.</p>
                <div className="mt-4 flex items-center text-xs font-semibold text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Enter Visual Editor &rarr;
                </div>
              </div>
            </div>
          )}

          {mode === 'quick' && (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Step 1: Name</Label>
                  <Input autoFocus placeholder="e.g. Price Reply" value={flowName} onChange={e => setFlowName(e.target.value)} className="h-11 border-zinc-200 focus:border-orange-500 focus:ring-orange-500/[.2]" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Step 2: Trigger</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Select value={triggerType} onValueChange={setTriggerType}>
                      <SelectTrigger className="h-11">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram_comment">Comment on Post</SelectItem>
                        <SelectItem value="instagram_dm">DM Keyword</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input placeholder={triggerType === 'instagram_comment' ? "Keyword (e.g. price)" : "Keyword"} value={keywords} onChange={e => setKeywords(e.target.value)} className="h-11" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Step 3: Reply Message</Label>
                  <Textarea rows={4} placeholder="Hello! Here is the info you asked for..." value={dmMessage} onChange={e => setDmMessage(e.target.value)} className="resize-none border-zinc-200 focus:border-orange-500 focus:ring-orange-500/[.2]" />
                </div>
              </div>
            </div>
          )}

          {mode === 'advanced' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Blank */}
              <div
                onClick={() => handleTemplateSelect(null)}
                className="cursor-pointer group flex flex-col items-center justify-center p-6 border-2 border-dashed border-zinc-200 rounded-xl hover:border-purple-500 hover:bg-purple-50/50 transition-all"
              >
                <div className="h-12 w-12 rounded-full bg-zinc-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <LayoutTemplate className="h-5 w-5 text-zinc-500" />
                </div>
                <h3 className="font-semibold text-zinc-900">Start Blank</h3>
              </div>

              {FLOW_TEMPLATES.map((template) => {
                const Icon = template.icon;
                return (
                  <div
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className="cursor-pointer group flex flex-col p-5 border border-zinc-200 rounded-xl hover:border-purple-500 hover:shadow-lg transition-all bg-white"
                  >
                    <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center mb-3 text-white shadow-sm", template.color)}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-zinc-900">{template.name}</h3>
                    <p className="text-xs text-zinc-500 mt-1 line-clamp-2">{template.description}</p>
                  </div>
                );
              })}
            </div>
          )}

          {mode === 'template_config' && (
            <div className="space-y-6 max-w-lg mx-auto">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Flow Name</Label>
                  <Input autoFocus value={flowName} onChange={e => setFlowName(e.target.value)} className="h-11" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea value={flowDescription} onChange={e => setFlowDescription(e.target.value)} className="resize-none" />
                </div>
                {!selectedTemplate && (
                  <div className="space-y-2">
                    <Label>Select Initial Trigger</Label>
                    <Select value={triggerType} onValueChange={setTriggerType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram_comment">Instagram Comment</SelectItem>
                        <SelectItem value="instagram_dm">Instagram DM</SelectItem>
                        <SelectItem value="whatsapp_message">WhatsApp Message</SelectItem>
                        <SelectItem value="keyword">Keyword</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {mode !== 'selection' && (
          <div className="p-6 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 flex justify-between items-center">
            <Button variant="ghost" onClick={() => setMode('selection')}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>

            <Button
              onClick={handleCreate}
              disabled={isLoading}
              className={cn(
                "font-semibold shadow-lg hover:shadow-xl transition-all",
                mode === 'quick' ? "bg-orange-600 hover:bg-orange-700 text-white" : "bg-purple-600 hover:bg-purple-700 text-white"
              )}
            >
              {isLoading ? "Creating..." : (mode === 'quick' ? "Launch Quick Flow 🚀" : "Create & Open Editor ✨")}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
