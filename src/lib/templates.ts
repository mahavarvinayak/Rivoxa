
import { MessageSquare, Mail, Zap, Clock, ShoppingBag } from "lucide-react";
import { Node, Edge } from "@xyflow/react";

export interface FlowTemplate {
    id: string;
    name: string;
    description: string;
    icon: any;
    color: string;
    nodes: Node[];
    edges: Edge[];
}

export const FLOW_TEMPLATES: FlowTemplate[] = [
    {
        id: "welcome-message",
        name: "Welcome & Menu",
        description: "Greet new followers and send them a menu of options.",
        icon: MessageSquare,
        color: "bg-blue-500",
        nodes: [
            { id: '1', type: 'trigger', position: { x: 250, y: 0 }, data: { triggerType: 'instagram_story_mention' } },
            { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { actionType: 'send_dm', config: { message: 'Thanks for mentioning us! Here is a 10% discount code: MENTION10' } } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' }
        ]
    },
    {
        id: "keyword-reply",
        name: "Keyword Auto-Reply",
        description: "Send a specific message when a user comments a keyword.",
        icon: Zap,
        color: "bg-yellow-500",
        nodes: [
            { id: '1', type: 'trigger', position: { x: 250, y: 0 }, data: { triggerType: 'instagram_comment' } },
            { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { actionType: 'send_dm', config: { message: 'Here is the info you requested!' } } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' }
        ]
    },
    {
        id: "lead-magnet",
        name: "Email Collector",
        description: "Offer a free resource in exchange for an email address.",
        icon: Mail,
        color: "bg-green-500",
        nodes: [
            { id: '1', type: 'trigger', position: { x: 250, y: 0 }, data: { triggerType: 'instagram_dm' } },
            { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { actionType: 'send_dm', config: { message: 'Great! What is your email address?' } } },
            { id: '3', type: 'action', position: { x: 250, y: 300 }, data: { actionType: 'collect_email', config: {} } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }
        ]
    },
    {
        id: "delayed-followup",
        name: "Smart Follow-up",
        description: "Wait for 24 hours before sending a second message.",
        icon: Clock,
        color: "bg-purple-500",
        nodes: [
            { id: '1', type: 'trigger', position: { x: 250, y: 0 }, data: { triggerType: 'instagram_comment' } },
            { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { actionType: 'delay', config: { duration: 24, unit: 'hours' } } },
            { id: '3', type: 'action', position: { x: 250, y: 300 }, data: { actionType: 'send_dm', config: { message: 'Did you get a chance to check out our offer?' } } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }
        ]
    }
];
