import { BaseNode } from "./BaseNode";
import { Zap } from "lucide-react";

export function TriggerNode({ data, selected }: any) {
    const triggerType = data.triggerType || "instagram_comment";

    const getLabel = () => {
        switch (triggerType) {
            case "instagram_comment": return "Instagram Comment";
            case "instagram_dm": return "Instagram DM";
            case "whatsapp_message": return "WhatsApp Message";
            default: return triggerType;
        }
    };

    return (
        <BaseNode
            data={data}
            selected={selected}
            title="Trigger"
            icon={Zap}
            color="purple"
            handles={{ source: true, target: false }}
        >
            <div className="font-medium text-slate-700 mb-1">{getLabel()}</div>
            {data.keywords && (
                <div className="text-[10px] bg-white/50 p-1 rounded">
                    Keywords: {data.keywords.join(", ")}
                </div>
            )}
        </BaseNode>
    );
}
