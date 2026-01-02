
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
    },
    {
        id: "away-message",
        name: "Away Message",
        description: "Auto-reply differently during off-hours.",
        icon: Clock,
        color: "bg-teal-500",
        nodes: [
            { id: '1', type: 'trigger', position: { x: 250, y: 0 }, data: { triggerType: 'instagram_dm' } },
            { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { actionType: 'time_window', config: { startTime: '09:00', endTime: '17:00' } } },
            { id: '3', type: 'action', position: { x: 50, y: 300 }, data: { actionType: 'send_dm', config: { message: 'We are currently closed. We will reply at 9 AM!' } } }, // False path
            { id: '4', type: 'action', position: { x: 450, y: 300 }, data: { actionType: 'send_dm', config: { message: 'Thanks for contacting us! How can we help?' } } }, // True path
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3', sourceHandle: 'false' }, // Connect to Closed
            { id: 'e2-4', source: '2', target: '4', sourceHandle: 'true' }   // Connect to Open
        ]
    },
    {
        id: "ab-testing",
        name: "A/B Testing",
        description: "Test two different welcome messages randomly.",
        icon: Zap,
        color: "bg-violet-500",
        nodes: [
            { id: '1', type: 'trigger', position: { x: 250, y: 0 }, data: { triggerType: 'instagram_dm' } },
            { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { actionType: 'randomizer', config: { percentage: 50 } } },
            { id: '3', type: 'action', position: { x: 50, y: 300 }, data: { actionType: 'send_dm', config: { message: 'Offer A: Get 10% Off Now!' } } },
            { id: '4', type: 'action', position: { x: 450, y: 300 }, data: { actionType: 'send_dm', config: { message: 'Offer B: Buy 1 Get 1 Free!' } } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3', sourceHandle: 'true' },
            { id: 'e2-4', source: '2', target: '4', sourceHandle: 'false' }
        ]
    },
    {
        id: "vip-sentiment",
        name: "VIP Support Triage",
        description: "Prioritize angry customers for admin review.",
        icon: Mail,
        color: "bg-rose-500",
        nodes: [
            { id: '1', type: 'trigger', position: { x: 250, y: 0 }, data: { triggerType: 'instagram_dm' } },
            { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { actionType: 'sentiment', config: { targetSentiment: 'negative' } } },
            { id: '3', type: 'action', position: { x: 450, y: 300 }, data: { actionType: 'notify', config: { email: 'admin@rivoxa.in', message: 'Angry Customer Alert!' } } },
            { id: '4', type: 'action', position: { x: 50, y: 300 }, data: { actionType: 'send_dm', config: { message: 'Thanks for reaching out! We will be with you shortly.' } } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3', sourceHandle: 'true' }, // Negative -> Notify
            { id: 'e2-4', source: '2', target: '4', sourceHandle: 'false' } // Neutral/Positive -> Standard Reply
        ]
    },
    {
        id: "webhook-sync",
        name: "Lead Sync (Zapier)",
        description: "Send collected emails directly to Zapier.",
        icon: ShoppingBag,
        color: "bg-cyan-500",
        nodes: [
            { id: '1', type: 'trigger', position: { x: 250, y: 0 }, data: { triggerType: 'instagram_dm' } },
            { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { actionType: 'collect_email', config: { message: 'Share your email to enroll!' } } },
            { id: '3', type: 'action', position: { x: 250, y: 300 }, data: { actionType: 'webhook', config: { url: 'https://hooks.zapier.com/...', method: 'POST', body: '{"email": "{{last_input}}"}' } } },
            { id: '4', type: 'action', position: { x: 250, y: 450 }, data: { actionType: 'send_dm', config: { message: 'You have been enrolled!' } } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' }
        ]
    }
];
