import { FlowBuilder } from "@/components/flows/builder/FlowBuilder";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Loader2, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useCallback, useState } from "react";
import { useNodesState, useEdgesState, addEdge, Connection, Edge, Node } from '@xyflow/react';
import { toast } from "sonner";

const initialNodes: Node[] = [
    {
        id: 'start',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { triggerType: 'instagram_comment', keywords: ['info'] }
    },
];

export default function FlowEditor() {
    const navigate = useNavigate();
    const { flowId } = useParams();

    // Check if we are creating new or editing
    const flow = useQuery(api.flows.get, flowId ? { id: flowId as any } : "skip");
    const updateFlow = useMutation(api.flows.update);

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [isSaving, setIsSaving] = useState(false);

    // Load initial data
    useEffect(() => {
        if (flow) {
            if (flow.nodes) setNodes(flow.nodes);
            if (flow.edges) setEdges(flow.edges);
        }
    }, [flow, setNodes, setEdges]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const handleSave = async () => {
        if (!flowId) return;
        setIsSaving(true);
        try {
            // Also basic compile to legacy actions for compatibility (simple linear)
            // Find start node, find connected action... this is complex.
            // For now, just save graph data. Execution will need update.

            await updateFlow({
                id: flowId as any,
                nodes,
                edges,
            });
            toast.success("Flow saved!");
        } catch (error) {
            toast.error("Failed to save flow");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    const addActionNode = () => {
        const newNode: Node = {
            id: Math.random().toString(),
            type: 'action',
            position: { x: 100, y: nodes.length * 150 + 100 },
            data: { actionType: 'send_dm', config: { message: 'New message' } },
        };
        setNodes((nds) => [...nds, newNode]);
    };

    if (!flowId) return <div>Invalid Flow ID</div>;

    return (
        <div className="h-screen flex flex-col bg-background">
            {/* Header */}
            <header className="border-b bg-card shadow-sm px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/flows")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-lg font-semibold">Flow Editor</h1>
                        <p className="text-xs text-muted-foreground">{flow?.name || "Loading..."}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" onClick={addActionNode}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Action
                    </Button>
                    <Button size="sm" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </header>

            {/* Editor Canvas */}
            <div className="flex-1 overflow-hidden p-4 bg-slate-100">
                <FlowBuilder
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                />
            </div>
        </div>
    );
}
