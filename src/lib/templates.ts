
import { MessageSquare, Mail, Zap, Clock, ShoppingBag, Gift, Star, Users, Phone, Calendar, HelpCircle, Trophy } from "lucide-react";
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
        name: "Welcome & Discount",
        description: "Greet new followers and send them a 10% discount code immediately.",
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
        description: "Send a specific message or link when a user comments a specific keyword.",
        icon: Zap,
        color: "bg-yellow-500",
        nodes: [
            { id: '1', type: 'trigger', position: { x: 250, y: 0 }, data: { triggerType: 'instagram_comment' } },
            { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { actionType: 'send_dm', config: { message: 'Here is the link you requested: https://rivoxa.in/offer' } } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' }
        ]
    },
    {
        id: "lead-magnet",
        name: "E-Book Lead Magnet",
        description: "Offer a free guide in exchange for an email address.",
        icon: Mail,
        color: "bg-green-500",
        nodes: [
            { id: '1', type: 'trigger', position: { x: 250, y: 0 }, data: { triggerType: 'instagram_dm' } },
            { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { actionType: 'send_dm', config: { message: 'Awesome! Send me your email and I will email the PDF right now.' } } },
            { id: '3', type: 'action', position: { x: 250, y: 300 }, data: { actionType: 'collect_email', config: {} } },
            { id: '4', type: 'action', position: { x: 250, y: 450 }, data: { actionType: 'send_dm', config: { message: 'Sent! Check your inbox (and spam folder)!' } } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' }
        ]
    },
    {
        id: "contest-entry",
        name: "Contest Giveaway",
        description: "Simple 'Comment to Win' automation that confirms entry.",
        icon: Trophy,
        color: "bg-orange-500",
        nodes: [
            { id: '1', type: 'trigger', position: { x: 250, y: 0 }, data: { triggerType: 'instagram_comment' } },
            { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { actionType: 'randomizer', config: { percentage: 100 } } }, // Dummy node for flow
            { id: '3', type: 'action', position: { x: 250, y: 300 }, data: { actionType: 'send_dm', config: { message: 'You are officially entered into the giveaway! Good luck! 🏆' } } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }
        ]
    },
    {
        id: "support-triage",
        name: "Customer Support Hero",
        description: "Route customers to Sales or Support based on keywords.",
        icon: HelpCircle,
        color: "bg-rose-500",
        nodes: [
            { id: '1', type: 'trigger', position: { x: 250, y: 0 }, data: { triggerType: 'instagram_dm' } },
            { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { actionType: 'send_dm', config: { message: 'Hi! Are you looking for Support or Sales? (Reply with one)' } } },
            { id: '3', type: 'action', position: { x: 50, y: 300 }, data: { actionType: 'send_dm', config: { message: 'Connecting you to a support agent...' } } },
            { id: '4', type: 'action', position: { x: 450, y: 300 }, data: { actionType: 'send_dm', config: { message: 'Our sales team will DM you shortly!' } } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }, // Hypothetically conditional, simpler for template
        ]
    },
    {
        id: "webinar-signup",
        name: "Webinar Registration",
        description: "Register users for your next live event entirely in DMs.",
        icon: Calendar,
        color: "bg-indigo-500",
        nodes: [
            { id: '1', type: 'trigger', position: { x: 250, y: 0 }, data: { triggerType: 'instagram_story_mention' } },
            { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { actionType: 'send_dm', config: { message: 'Ready for the masterclass? Reply YES to reserve your spot.' } } },
            { id: '3', type: 'action', position: { x: 250, y: 300 }, data: { actionType: 'collect_email', config: {} } },
            { id: '4', type: 'action', position: { x: 250, y: 450 }, data: { actionType: 'webhook', config: { url: 'https://zoom.us/api/register', method: 'POST' } } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' }
        ]
    },
    {
        id: "influencer-collab",
        name: "Influencer Screening",
        description: "Auto-qualify potential brand ambassadors.",
        icon: Star,
        color: "bg-pink-500",
        nodes: [
            { id: '1', type: 'trigger', position: { x: 250, y: 0 }, data: { triggerType: 'instagram_dm' } },
            { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { actionType: 'send_dm', config: { message: 'Thanks for your interest! How many followers do you have?' } } },
            { id: '3', type: 'action', position: { x: 250, y: 300 }, data: { actionType: 'delay', config: { duration: 2, unit: 'minutes' } } },
            { id: '4', type: 'action', position: { x: 250, y: 450 }, data: { actionType: 'send_dm', config: { message: 'Great! Fill out this form to apply: bit.ly/collab' } } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' }
        ]
    },
    {
        id: "product-recommend",
        name: "Product Quiz",
        description: "Ask users questions to recommend the perfect product.",
        icon: ShoppingBag,
        color: "bg-violet-500",
        nodes: [
            { id: '1', type: 'trigger', position: { x: 250, y: 0 }, data: { triggerType: 'instagram_comment' } },
            { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { actionType: 'send_dm', config: { message: 'Do you have Oily or Dry skin?' } } },
            { id: '3', type: 'action', position: { x: 50, y: 300 }, data: { actionType: 'send_dm', config: { message: 'For Oily skin, we recommend our Matte Gel!' } } }, // Path A
            { id: '4', type: 'action', position: { x: 450, y: 300 }, data: { actionType: 'send_dm', config: { message: 'For Dry skin, try our Hydration Cream!' } } }, // Path B
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            // In a real scenario, these would be conditional edges
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e2-4', source: '2', target: '4' }
        ]
    },
    {
        id: "feedback-loop",
        name: "Feedback Collector",
        description: "Ask customers to rate their experience after purchase.",
        icon: Users,
        color: "bg-cyan-500",
        nodes: [
            { id: '1', type: 'trigger', position: { x: 250, y: 0 }, data: { triggerType: 'instagram_dm' } },
            { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { actionType: 'delay', config: { duration: 24, unit: 'hours' } } },
            { id: '3', type: 'action', position: { x: 250, y: 300 }, data: { actionType: 'send_dm', config: { message: 'How was your experience? Rate us 1-5!' } } },
            { id: '4', type: 'action', position: { x: 250, y: 450 }, data: { actionType: 'sentiment', config: { targetSentiment: 'negative' } } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' }
        ]
    },
    {
        id: "birthday-club",
        name: "Birthday Club",
        description: "Collect user birthdays for special yearly offers.",
        icon: Gift,
        color: "bg-fuchsia-500",
        nodes: [
            { id: '1', type: 'trigger', position: { x: 250, y: 0 }, data: { triggerType: 'instagram_comment' } },
            { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { actionType: 'send_dm', config: { message: 'Join our Birthday Club! When is your bday? (DD/MM)' } } },
            { id: '3', type: 'action', position: { x: 250, y: 300 }, data: { actionType: 'webhook', config: { url: 'https://crm.rivoxa.in/bday', method: 'POST' } } },
            { id: '4', type: 'action', position: { x: 250, y: 450 }, data: { actionType: 'send_dm', config: { message: 'Saved! You will get a surprise on your day. 🎂' } } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' },
            { id: 'e3-4', source: '3', target: '4' }
        ]
    },
    {
        id: "smart-followup",
        name: "Smart Sales Follow-up",
        description: "Wait 24h, then check if they bought. If not, offer discount.",
        icon: Clock,
        color: "bg-purple-600",
        nodes: [
            { id: '1', type: 'trigger', position: { x: 250, y: 0 }, data: { triggerType: 'instagram_dm' } },
            { id: '2', type: 'action', position: { x: 250, y: 150 }, data: { actionType: 'delay', config: { duration: 24, unit: 'hours' } } },
            { id: '3', type: 'action', position: { x: 250, y: 300 }, data: { actionType: 'send_dm', config: { message: 'Hey! Still interested? Use code SAVE5 for 5% off.' } } },
        ],
        edges: [
            { id: 'e1-2', source: '1', target: '2' },
            { id: 'e2-3', source: '2', target: '3' }
        ]
    },
    {
        id: "ab-testing",
        name: "A/B Testing",
        description: "Randomly split traffic to test two different messages.",
        icon: Zap,
        color: "bg-indigo-600",
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
    }
];
