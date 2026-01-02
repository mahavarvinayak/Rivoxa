import { BaseNode } from "./BaseNode";
import { MessageSquare, Mail, Tag, Clock, GitBranch } from "lucide-react";

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
                return { icon: GitBranch, label: "Condition", color: "pink" }; // Distinct color
            default:
                return { icon: MessageSquare, label: "Action", color: "default" };
        }
    };

    const config = getConfig();

    return (
        <BaseNode
            data={data}
            selected={selected}
            title={config.label}
            icon={config.icon}
            color={config.color}
            handles={{ source: true, target: true }}
        >
            <div className="line-clamp-2 text-slate-600">
                {data.config?.message || data.config?.tag || (actionType === 'condition' ? 'Check logic...' : "Configure this action")}
            </div>
        </BaseNode>
    );
}
