import { BaseNode } from "./BaseNode";
import { MessageSquare, Mail, UserPlus, Clock } from "lucide-react";

export function ActionNode({ data, selected }: any) {
    const actionType = data.actionType || "send_dm";

    const getConfig = () => {
        switch (actionType) {
            case "send_dm":
                return { icon: MessageSquare, label: "Send DM", color: "blue" };
            case "collect_email":
                return { icon: Mail, label: "Collect Email", color: "orange" };
            case "add_tag":
                return { icon: UserPlus, label: "Add Tag", color: "green" };
            case "delay":
                return { icon: Clock, label: "Delay", color: "default" };
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
                {data.config?.message || data.config?.tag || "Configure this action"}
            </div>
        </BaseNode>
    );
}
