import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Node } from "@xyflow/react";
import { X, Save, Trash2, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface NodePropertiesPanelProps {
    selectedNode: Node | null;
    onUpdateNode: (nodeId: string, data: any) => void;
    onDeleteNode: (nodeId: string) => void;
    onClose: () => void;
}

export function NodePropertiesPanel({ selectedNode, onUpdateNode, onDeleteNode, onClose }: NodePropertiesPanelProps) {
    const [data, setData] = useState<any>({});

    // Sync local state when selected node changes
    useEffect(() => {
        if (selectedNode) {
            setData({ ...selectedNode.data });
        }
    }, [selectedNode]);

    const handleChange = (field: string, value: any) => {
        const newData = { ...data, [field]: value };
        setData(newData);
        // Auto-save to parent (or we could have a save button)
        if (selectedNode) {
            onUpdateNode(selectedNode.id, newData);
        }
    };

    if (!selectedNode) {
        return (
            <div className="w-80 border-l bg-slate-50/50 p-6 flex flex-col items-center justify-center text-center h-full">
                <div className="bg-slate-200 p-4 rounded-full mb-4">
                    <HelpCircle className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-800">No Node Selected</h3>
                <p className="text-sm text-slate-500 mt-2">Click on a node in the canvas to configure its properties.</p>
            </div>
        );
    }

    const isTrigger = selectedNode.type === 'trigger';
    const isAction = selectedNode.type === 'action';

    return (
        <div className="w-80 border-l bg-white flex flex-col h-full shadow-xl z-20">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between bg-slate-50">
                <div>
                    <Badge variant="outline" className="mb-2 uppercase text-[10px] tracking-wider">
                        {selectedNode.type}
                    </Badge>
                    <h3 className="font-semibold text-slate-900">Configure Node</h3>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <ScrollArea className="flex-1 p-4">
                <div className="space-y-6">

                    {/* TRIGGER CONFIGURATION */}
                    {isTrigger && (
                        <>
                            <div className="space-y-3">
                                <Label>Trigger Type</Label>
                                <Select
                                    value={data.triggerType || "instagram_comment"}
                                    onValueChange={(val) => handleChange("triggerType", val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="instagram_comment">Instagram Comment</SelectItem>
                                        <SelectItem value="instagram_dm">Instagram DM</SelectItem>
                                        <SelectItem value="instagram_story_mention">Story Mention</SelectItem>
                                        <SelectItem value="keyword">Keyword Match</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <Label>Keywords</Label>
                                    <span className="text-xs text-slate-400">Comma separated</span>
                                </div>
                                <Input
                                    value={Array.isArray(data.keywords) ? data.keywords.join(", ") : (data.keywords || "")}
                                    onChange={(e) => handleChange("keywords", e.target.value.split(",").map((k: string) => k.trim()))}
                                    placeholder="e.g. price, info, discount"
                                />
                            </div>

                            <div className="space-y-3">
                                <Label>Required Post ID (Optional)</Label>
                                <Input
                                    value={data.postId || ""}
                                    onChange={(e) => handleChange("postId", e.target.value)}
                                    placeholder="Specific Media ID"
                                />
                            </div>
                        </>
                    )}

                    {/* ACTION CONFIGURATION */}
                    {isAction && (
                        <>
                            <div className="space-y-3">
                                <Label>Action Type</Label>
                                <Select
                                    value={data.actionType || "send_dm"}
                                    onValueChange={(val) => handleChange("actionType", val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="send_dm">Send Message</SelectItem>
                                        <SelectItem value="delay">Smart Delay</SelectItem>
                                        <SelectItem value="add_tag">Add Tag</SelectItem>
                                        <SelectItem value="collect_email">Collect Email</SelectItem>
                                        <SelectItem value="condition">Condition</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Send DM Config */}
                            {data.actionType === 'send_dm' && (
                                <div className="space-y-3">
                                    <Label>Message Text</Label>
                                    <Textarea
                                        value={data.config?.message || ""}
                                        onChange={(e) => handleChange("config", { ...data.config, message: e.target.value })}
                                        placeholder="Hello! How can I help you?"
                                        rows={6}
                                        className="resize-none"
                                    />
                                    <p className="text-xs text-slate-500">
                                        Response sent to the user.
                                    </p>
                                </div>
                            )}

                            {/* Delay Config */}
                            {data.actionType === 'delay' && (
                                <div className="flex gap-2">
                                    <div className="space-y-3 flex-1">
                                        <Label>Duration</Label>
                                        <Input
                                            type="number"
                                            value={data.config?.duration || 1}
                                            onChange={(e) => handleChange("config", { ...data.config, duration: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-3 w-1/3">
                                        <Label>Unit</Label>
                                        <Select
                                            value={data.config?.unit || "hours"}
                                            onValueChange={(val) => handleChange("config", { ...data.config, unit: val })}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="minutes">Mins</SelectItem>
                                                <SelectItem value="hours">Hours</SelectItem>
                                                <SelectItem value="days">Days</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}

                            {/* Add Tag Config */}
                            {data.actionType === 'add_tag' && (
                                <div className="space-y-3">
                                    <Label>Tag Name</Label>
                                    <Input
                                        value={data.config?.tag || ""}
                                        onChange={(e) => handleChange("config", { ...data.config, tag: e.target.value })}
                                        placeholder="e.g. interested_pro"
                                    />
                                    <p className="text-xs text-slate-500">
                                        Tag applied to the user.
                                    </p>
                                </div>
                            )}

                            {/* Collect Email Config */}
                            {data.actionType === 'collect_email' && (
                                <div className="space-y-3">
                                    <Label>Prompt Message</Label>
                                    <Textarea
                                        value={data.config?.message || "Please share your email address:"}
                                        onChange={(e) => handleChange("config", { ...data.config, message: e.target.value })}
                                        rows={3}
                                    />
                                    <Label className="mt-2 block">Success Message</Label>
                                    <Input
                                        value={data.config?.successMessage || "Thanks! We've saved your email."}
                                        onChange={(e) => handleChange("config", { ...data.config, successMessage: e.target.value })}
                                        placeholder="Confirmation reply"
                                    />
                                </div>
                            )}

                            {/* Condition Config */}
                            {data.actionType === 'condition' && (
                                <div className="space-y-3">
                                    <Label>If Condition</Label>
                                    <div className="p-3 bg-slate-50 rounded border text-sm text-slate-600">
                                        Condition logic is currently visualized via connections.
                                        Future update will add complex rules here.
                                    </div>
                                    <Select
                                        value={data.config?.conditionType || "has_tag"}
                                        onValueChange={(val) => handleChange("config", { ...data.config, conditionType: val })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="has_tag">User has Tag</SelectItem>
                                            <SelectItem value="is_follower">User follows me</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                        </>
                    )}

                </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t bg-slate-50 flex justify-between items-center">
                <Button variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => onDeleteNode(selectedNode.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                </Button>
            </div>
        </div>
    );
}
