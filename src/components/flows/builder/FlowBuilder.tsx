
import { useCallback, useState } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node,
    BackgroundVariant,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { TriggerNode } from './nodes/TriggerNode';
import { ActionNode } from './nodes/ActionNode';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const nodeTypes = {
    trigger: TriggerNode,
    action: ActionNode,
};

const initialNodes: Node[] = [
    {
        id: 'start',
        type: 'trigger',
        position: { x: 100, y: 100 },
        data: { triggerType: 'instagram_comment', keywords: ['info'] }
    },
    {
        id: '1',
        type: 'action',
        position: { x: 100, y: 300 },
        data: { actionType: 'send_dm', config: { message: 'Hello! Here is the info.' } }
    },
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: 'start', target: '1' },
];

interface FlowBuilderProps {
    nodes: any[];
    edges: any[];
    onNodesChange: any;
    onEdgesChange: any;
    onNodeClick?: (event: React.MouseEvent, node: any) => void;
    setNodes: any;
}

export function FlowBuilder({ nodes, edges, onNodesChange, onEdgesChange, onNodeClick, setNodes }: FlowBuilderProps) {
    const { screenToFlowPosition } = useReactFlow();

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow');
            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            const newNode = {
                id: `${type}-${Date.now()}`, // Unique ID
                type,
                position,
                data: { label: `${type} node` },
            };

            setNodes((nds: any) => nds.concat(newNode));
        },
        [screenToFlowPosition, setNodes],
    );

    return (
        <div className="h-full w-full bg-slate-50">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                onDragOver={onDragOver}
                onDrop={onDrop}
                fitView
            >
                <Background />
                <Controls />
                <MiniMap />
            </ReactFlow>
            <div className="absolute top-4 left-4 z-10 bg-white p-2 rounded-lg shadow-md border border-slate-200">
                <div
                    className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded cursor-grab"
                    onDragStart={(event) => event.dataTransfer.setData('application/reactflow', 'action')}
                    draggable
                >
                    <div className="w-8 h-8 rounded bg-blue-100 border border-blue-300 flex items-center justify-center text-blue-600 font-bold text-xs">
                        MSG
                    </div>
                    <span className="text-sm font-medium">Add Message</span>
                </div>
            </div>
        </div>
    );
}
```
