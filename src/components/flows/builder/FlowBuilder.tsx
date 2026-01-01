
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
    nodes: Node[];
    edges: Edge[];
    onNodesChange: OnNodesChange;
    onEdgesChange: OnEdgesChange;
    onConnect: OnConnect;
}

export function FlowBuilder({ nodes, edges, onNodesChange, onEdgesChange, onConnect }: FlowBuilderProps) {
    // The addActionNode logic and buttons are removed from here as they depend on local state
    // that is now lifted up. They would need to be passed down as props or managed by the parent.

    return (
        <div className="w-full h-full bg-slate-50 relative border rounded-lg overflow-hidden">
            {/* ... existing buttons can stay or move ... */}
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
            >
                <Controls />
                <MiniMap />
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}
