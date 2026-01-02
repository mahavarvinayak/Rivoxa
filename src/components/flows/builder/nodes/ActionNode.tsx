import { BaseNode } from "./BaseNode";
import { MessageSquare, Mail, Tag, Clock, GitBranch, Zap, Bell, Calendar, Shuffle, HeartHandshake, Globe } from "lucide-react";

export function ActionNode({ data, selected }: any) {
    const actionType = data.actionType || "send_dm";

    const getConfig = () => {
        switch (actionType) {
            case "send_dm":
                return { icon: MessageSquare, label: "Send DM", color: "blue" };
            case "collect_email":
                return { icon: Mail, label: "Collect Email", color: "purple" };
            case "add_tag":
                return { icon: Tag, label: "Add Tag", color: "green" };
            case "delay":
                return { icon: Clock, label: "Smart Delay", color: "orange" };
            case "condition":
                return { icon: GitBranch, label: "Condition", color: "pink" };
            case "time_window":
                return { icon: Calendar, label: "Time Window", color: "green" };
            case "randomizer":
                return { icon: Shuffle, label: "Randomizer", color: "purple" };
            case "sentiment":
                return { icon: HeartHandshake, label: "Sentiment Check", color: "rose" }; // Rose
            case "webhook":
                return { icon: Globe, label: "Webhook (API)", color: "cyan" }; // Cyan
            case "notify":
                return { icon: Bell, label: "Notify Admin", color: "orange" };
            default:
                return { icon: MessageSquare, label: "Action", color: "default" };
        }
    };

    const config = getConfig();

    const getSummary = () => {
        if (actionType === 'condition') return `Check logic...`;
        if (actionType === 'time_window') return `${data.config?.startTime || "09:00"} - ${data.config?.endTime || "17:00"}`;
        if (actionType === 'randomizer') return `Traffic Split: ${data.config?.percentage || 50}%`;
        if (actionType === 'sentiment') return `Target: ${data.config?.targetSentiment || "Negative"}`;
        if (actionType === 'webhook') return data.config?.url ? "Sending Data..." : "Configure URL";
        if (actionType === 'notify') return data.config?.email ? `Notify ${data.config.email}` : "Configure notification";
        return data.config?.message || data.config?.tag || "Configure this action";
    };

    const isSplitNode = ['condition', 'time_window', 'randomizer', 'sentiment'].includes(actionType);

    return (
        <BaseNode
            data={data}
            selected={selected}
            title={config.label}
            icon={config.icon}
            color={config.color}
            handles={{ source: true, target: true, split: isSplitNode }}
        >
            <div className="line-clamp-2 text-slate-600">
                {getSummary()}
            </div>
        </BaseNode>
    );
}
