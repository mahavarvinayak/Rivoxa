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
                                        <SelectItem value="time_window">Time Window</SelectItem>
                                        <SelectItem value="sentiment">Sentiment Check</SelectItem>
                                        <SelectItem value="randomizer">Randomizer</SelectItem>
                                        <SelectItem value="webhook">Webhook (API)</SelectItem>
                                        <SelectItem value="notify">Notify Admin</SelectItem>
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

                            {/* Sentiment Config */}
                            {data.actionType === 'sentiment' && (
                                <div className="space-y-4">
                                    <div className="p-3 bg-rose-50 border border-rose-100 rounded-md text-xs text-rose-700">
                                        Detects message tone. Connect <strong>TRUE</strong> if match, <strong>FALSE</strong> otherwise.
                                    </div>
                                    <div className="space-y-3">
                                        <Label>Check for Sentiment</Label>
                                        <Select
                                            value={data.config?.targetSentiment || "negative"}
                                            onValueChange={(val) => handleChange("config", { ...data.config, targetSentiment: val })}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="negative">Negative / Angry</SelectItem>
                                                <SelectItem value="positive">Positive / Happy</SelectItem>
                                                <SelectItem value="urgent">Urgent / Help</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label>Sensitivity</Label>
                                        <Select
                                            value={data.config?.sensitivity || "medium"}
                                            onValueChange={(val) => handleChange("config", { ...data.config, sensitivity: val })}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="low">Low (Strict)</SelectItem>
                                                <SelectItem value="medium">Medium</SelectItem>
                                                <SelectItem value="high">High (Loose)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}

                            {/* Webhook Config */}
                            {data.actionType === 'webhook' && (
                                <div className="space-y-4">
                                    <div className="p-3 bg-cyan-50 border border-cyan-100 rounded-md text-xs text-cyan-700">
                                        Send data to external APIs (Zapier, Make, etc).
                                    </div>
                                    <div className="space-y-3">
                                        <Label>Target URL</Label>
                                        <Input
                                            value={data.config?.url || ""}
                                            onChange={(e) => handleChange("config", { ...data.config, url: e.target.value })}
                                            placeholder="https://hooks.zapier.com/..."
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label>Method</Label>
                                        <Select
                                            value={data.config?.method || "POST"}
                                            onValueChange={(val) => handleChange("config", { ...data.config, method: val })}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="POST">POST</SelectItem>
                                                <SelectItem value="GET">GET</SelectItem>
                                                <SelectItem value="PUT">PUT</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-3">
                                        <Label>JSON Body (Optional)</Label>
                                        <Textarea
                                            value={data.config?.body || "{}"}
                                            onChange={(e) => handleChange("config", { ...data.config, body: e.target.value })}
                                            rows={4}
                                            placeholder='{"user": "{{user_id}}", "msg": "{{message}}"}'
                                            className="font-mono text-xs"
                                        />
                                        <p className="text-[10px] text-slate-400">
                                            Supports templating variables.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Time Window Config */}
                            {data.actionType === 'time_window' && (
                                <div className="space-y-4">
                                    <div className="p-3 bg-teal-50 border border-teal-100 rounded-md text-xs text-teal-700">
                                        Route users based on time of day. TRUE = Open, FALSE = Closed.
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-3">
                                            <Label>Start Time</Label>
                                            <Input
                                                type="time"
                                                value={data.config?.startTime || "09:00"}
                                                onChange={(e) => handleChange("config", { ...data.config, startTime: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-3">
                                            <Label>End Time</Label>
                                            <Input
                                                type="time"
                                                value={data.config?.endTime || "17:00"}
                                                onChange={(e) => handleChange("config", { ...data.config, endTime: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label>Timezone</Label>
                                        <Select
                                            value={data.config?.timezone || "UTC"}
                                            onValueChange={(val) => handleChange("config", { ...data.config, timezone: val })}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="UTC">UTC</SelectItem>
                                                <SelectItem value="IST">India (IST)</SelectItem>
                                                <SelectItem value="EST">US Eastern (EST)</SelectItem>
                                                <SelectItem value="PST">US Pacific (PST)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            )}

                            {/* Randomizer Config */}
                            {data.actionType === 'randomizer' && (
                                <div className="space-y-4">
                                    <div className="p-3 bg-violet-50 border border-violet-100 rounded-md text-xs text-violet-700">
                                        Split traffic randomly. Connect TRUE (A) and FALSE (B).
                                    </div>
                                    <div className="space-y-3">
                                        <Label>Path A Percentage ({data.config?.percentage || 50}%)</Label>
                                        <Input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={data.config?.percentage || 50}
                                            onChange={(e) => handleChange("config", { ...data.config, percentage: parseInt(e.target.value) })}
                                        />
                                        <div className="flex justify-between text-xs text-slate-500 font-medium">
                                            <span>Path B (False)</span>
                                            <span>Path A (True)</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notify Admin Config */}
                            {data.actionType === 'notify' && (
                                <div className="space-y-4">
                                    <div className="space-y-3">
                                        <Label>Admin Email</Label>
                                        <Input
                                            value={data.config?.email || ""}
                                            onChange={(e) => handleChange("config", { ...data.config, email: e.target.value })}
                                            placeholder="admin@example.com"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label>Notification Message</Label>
                                        <Input
                                            value={data.config?.message || "New lead detected!"}
                                            onChange={(e) => handleChange("config", { ...data.config, message: e.target.value })}
                                            placeholder="Subject or body..."
                                        />
                                    </div>
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
                                <div className="space-y-4">
                                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-xs text-blue-700">
                                        Condition nodes split the flow. Connect the <strong>TRUE</strong> handle to one node and <strong>FALSE</strong> to another.
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Variable</Label>
                                        <Select
                                            value={data.config?.variable || "message_text"}
                                            onValueChange={(val) => handleChange("config", { ...data.config, variable: val })}
                                        >
                                            <SelectTrigger><SelectValue placeholder="Select variable" /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="message_text">Message Text</SelectItem>
                                                <SelectItem value="user_tag">User Tag</SelectItem>
                                                <SelectItem value="follower_count">Follower Count</SelectItem>
                                                <SelectItem value="is_follower">Is Follower</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Operator</Label>
                                        <Select
                                            value={data.config?.operator || "contains"}
                                            onValueChange={(val) => handleChange("config", { ...data.config, operator: val })}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="equals">Equals</SelectItem>
                                                <SelectItem value="contains">Contains</SelectItem>
                                                <SelectItem value="starts_with">Starts With</SelectItem>
                                                <SelectItem value="greater_than">Greater Than (Numbers)</SelectItem>
                                                <SelectItem value="less_than">Less Than (Numbers)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3">
                                        <Label>Value</Label>
                                        <Input
                                            value={data.config?.value || ""}
                                            onChange={(e) => handleChange("config", { ...data.config, value: e.target.value })}
                                            placeholder="Value to check against..."
                                        />
                                    </div>
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
