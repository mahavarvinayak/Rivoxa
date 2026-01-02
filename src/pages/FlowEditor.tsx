import { FlowBuilder } from "@/components/flows/builder/FlowBuilder";
import { Button } from "@/components/ui/button";
import { NodePropertiesPanel } from "@/components/flows/builder/NodePropertiesPanel";
import { ArrowLeft, Save, Loader2, Zap } from "lucide-react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useEffect, useCallback } from "react";
import { useNodesState, useEdgesState, Node, Edge, ReactFlowProvider, addEdge, OnConnect } from "@xyflow/react";
import { toast } from "sonner";

export default function FlowEditor() {
    const { flowId } = useParams();
    const navigate = useNavigate();

    // Check if we are crearating new or editing
    const flow = useQuery(api.flows.get, { id: flowId as any });
    const updateFlow = useMutation(api.flows.update);

    const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    // Load initial data
    useEffect(() => {
        if (flow) {
            if (flow.nodes) {
                setNodes(flow.nodes);
            }
            if (flow.edges) {
                setEdges(flow.edges);
            }
        }
    }, [flow, setNodes, setEdges]);

    const handleSave = async () => {
        if (!flowId) return;
        setIsSaving(true);
        try {
            await updateFlow({
                id: flowId as any,
                nodes,
                edges,
            });
            toast.success("Flow saved!");
        } catch (error) {
            toast.error("Failed to save flow");
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleStatus = async (newStatus: 'active' | 'draft') => {
        if (!flowId) return;
        try {
            await updateFlow({
                id: flowId as any,
                status: newStatus,
            });
            toast.success(newStatus === 'active' ? "Automation is LIVE! 🚀" : "Automation stopped.");
        } catch (error) {
            toast.error("Failed to update status.");
        }
    };

    const onConnect: OnConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );

    const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        setSelectedNodeId(node.id);
    }, []);

    const handleUpdateNode = useCallback((nodeId: string, newData: any) => {
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === nodeId) {
                    return { ...node, data: newData };
                }
                return node;
            })
        );
    }, [setNodes]);

    const handleDeleteNode = useCallback((nodeId: string) => {
        setNodes((nds) => nds.filter((node) => node.id !== nodeId));
        setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
        setSelectedNodeId(null);
    }, [setNodes, setEdges]);

    if (!flow) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    const selectedNode = nodes.find(n => n.id === selectedNodeId) || null;

    return (
        <div className="h-screen flex flex-col bg-slate-50">
            {/* Header */}
            <header className="h-14 border-b bg-white px-4 flex items-center justify-between shrink-0 z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/flows")}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <h1 className="font-semibold text-slate-900">{flow.name}</h1>
                        <p className="text-xs text-slate-500">Visual Flow Editor</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-9"
                    >
                        {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save
                    </Button>

                    {/* GO LIVE CONTROLS */}
                    {flow.status === 'active' ? (
                        <Button
                            variant="destructive"
                            size="sm"
                            className="h-9 gap-2 shadow-sm font-semibold"
                            onClick={() => handleToggleStatus('draft')}
                        >
                            <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                            Stop Automation
                        </Button>
                    ) : (
                        <Button
                            variant="default"
                            size="sm"
                            className="h-9 gap-2 bg-green-600 hover:bg-green-700 text-white font-bold shadow-md hover:shadow-lg transition-all"
                            onClick={() => handleToggleStatus('active')}
                        >
                            <Zap className="h-4 w-4 fill-current" />
                            Go Live
                        </Button>
                    )}
                </div>
            </header>

            {/* Main Content */}
            <ReactFlowProvider>
                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 relative">
                        <FlowBuilder
                            nodes={nodes}
                            edges={edges}
                            onNodesChange={onNodesChange}
                            onEdgesChange={onEdgesChange}
                            onConnect={onConnect}
                            onNodeClick={handleNodeClick}
                            setNodes={setNodes}
                        />
                    </div>

                    {/* Right Sidebar (Properties Panel) */}
                    {selectedNode && (
                        <NodePropertiesPanel
                            selectedNode={selectedNode}
                            onUpdateNode={handleUpdateNode}
                            onDeleteNode={handleDeleteNode}
                            onClose={() => setSelectedNodeId(null)}
                        />
                    )}
                </div>
            </ReactFlowProvider>
        </div>
    );
}
