
import { useCallback } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    BackgroundVariant,
    useReactFlow,
    Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TriggerNode } from './nodes/TriggerNode';
import { ActionNode } from './nodes/ActionNode';
import { MessageSquare, Clock, GitBranch, Mail, Tag, Zap, Plus, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

const nodeTypes = {
    trigger: TriggerNode,
    action: ActionNode,
};

interface FlowBuilderProps {
    nodes: any[];
    edges: any[];
    onNodesChange: any;
    onEdgesChange: any;
    onConnect: any;
    onNodeClick?: (event: React.MouseEvent, node: any) => void;
    setNodes: any;
}

const TOOLBAR_ITEMS = [
    { type: 'action', actionType: 'send_dm', label: 'Message', icon: MessageSquare, color: 'bg-blue-100 text-blue-600 border-blue-200' },
    { type: 'action', actionType: 'delay', label: 'Smart Delay', icon: Clock, color: 'bg-orange-100 text-orange-600 border-orange-200' },
    { type: 'action', actionType: 'add_tag', label: 'Add Tag', icon: Tag, color: 'bg-green-100 text-green-600 border-green-200' },
    { type: 'action', actionType: 'collect_email', label: 'Collect Email', icon: Mail, color: 'bg-purple-100 text-purple-600 border-purple-200' },
    { type: 'action', actionType: 'condition', label: 'Condition', icon: GitBranch, color: 'bg-pink-100 text-pink-600 border-pink-200' },
];

export function FlowBuilder({ nodes, edges, onNodesChange, onEdgesChange, onConnect, onNodeClick, setNodes }: FlowBuilderProps) {
    const { screenToFlowPosition } = useReactFlow();

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow/type');
            const actionType = event.dataTransfer.getData('application/reactflow/actionType');

            if (!type) return;

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: `${type}-${Date.now()}`,
                type,
                position,
                data: {
                    label: `New ${type}`,
                    actionType: actionType || undefined, // Store the specific action type
                    config: {}
                },
            };

            setNodes((nds: any) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes],
    );

    const onDragStart = (event: React.DragEvent, nodeType: string, actionType: string) => {
        event.dataTransfer.setData('application/reactflow/type', nodeType);
        event.dataTransfer.setData('application/reactflow/actionType', actionType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="h-full w-full bg-slate-50 relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                onDragOver={onDragOver}
                onDrop={onDrop}
                fitView
                defaultEdgeOptions={{
                    type: 'smoothstep',
                    animated: true,
                    style: { stroke: '#64748b', strokeWidth: 2 }
                }}
            >
                <Background color="#94a3b8" gap={16} size={1} variant={BackgroundVariant.Dots} />
                <Controls className="bg-white border-slate-200 shadow-md !text-slate-600" />
                <MiniMap className="!bg-slate-50 border-slate-200" />

                {/* Floating Node Library Panel */}
                <Panel position="top-left" className="m-4">
                    <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-xl border border-slate-200 w-64 flex flex-col gap-3 transition-opacity">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                            <Zap className="h-4 w-4 text-slate-500" />
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Node Library</span>
                        </div>

                        <div className="grid grid-cols-1 gap-2">
                            {TOOLBAR_ITEMS.map((item) => (
                                <div
                                    key={item.label}
                                    className="group flex items-center gap-3 p-2 bg-white rounded-lg border border-slate-100 shadow-sm hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all cursor-grab active:cursor-grabbing"
                                    onDragStart={(event) => onDragStart(event, item.type, item.actionType)}
                                    draggable
                                >
                                    <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-colors", item.color)}>
                                        <item.icon className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-slate-700">{item.label}</p>
                                    </div>
                                    <GripVertical className="h-4 w-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            ))}
                        </div>

                        <div className="pt-2 text-[10px] text-center text-slate-400">
                            Drag & drop to canvas
                        </div>
                    </div>
                </Panel>
            </ReactFlow>
        </div>
    );
}
