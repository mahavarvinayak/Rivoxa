import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface BaseNodeProps {
    data: any;
    selected?: boolean;
    title: string;
    icon?: LucideIcon;
    color?: string;
    children?: React.ReactNode;
    handles?: {
        source?: boolean;
        target?: boolean;
        split?: boolean;
    };
}

// Modern, saturated colors for "Kadak" look
const colorMap: Record<string, { bg: string, text: string, border: string, iconBg: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-900", border: "border-blue-200", iconBg: "bg-blue-500 text-white" },
    green: { bg: "bg-emerald-50", text: "text-emerald-900", border: "border-emerald-200", iconBg: "bg-emerald-500 text-white" },
    orange: { bg: "bg-orange-50", text: "text-orange-900", border: "border-orange-200", iconBg: "bg-orange-500 text-white" },
    purple: { bg: "bg-purple-50", text: "text-purple-900", border: "border-purple-200", iconBg: "bg-purple-600 text-white" },
    red: { bg: "bg-red-50", text: "text-red-900", border: "border-red-200", iconBg: "bg-red-500 text-white" },
    default: { bg: "bg-white", text: "text-zinc-900", border: "border-zinc-200", iconBg: "bg-zinc-800 text-white" },
};

export function BaseNode({ data, selected, title, icon: Icon, color = "default", children, handles = { source: true, target: true } }: BaseNodeProps) {
    const theme = colorMap[color] || colorMap.default;

    return (
        <div className={cn(
            "relative w-[300px] rounded-2xl bg-white transition-all duration-300 group",
            "border-2",
            selected ? "border-indigo-500 shadow-2xl ring-4 ring-indigo-500/10 scale-[1.02]" : "border-transparent shadow-xl hover:shadow-2xl hover:-translate-y-1",
            "font-sans"
        )}>
            {/* Top Handle - Input */}
            {handles.target && (
                <Handle
                    type="target"
                    position={Position.Top}
                    className="!w-4 !h-4 !-top-3 !bg-zinc-800 !border-2 !border-white !rounded-full transition-transform hover:scale-125"
                />
            )}

            {/* Header Section */}
            <div className={cn(
                "flex items-center gap-3 p-4 rounded-t-xl border-b",
                theme.bg,
                theme.border
            )}>
                <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl shadow-sm",
                    theme.iconBg
                )}>
                    {Icon && <Icon className="h-5 w-5" />}
                </div>
                <div>
                    <h3 className={cn("text-sm font-bold tracking-tight", theme.text)}>{title}</h3>
                    <p className="text-[10px] uppercase tracking-wider font-semibold opacity-60">
                        {data.triggerType ? 'Trigger' : 'Action'}
                    </p>
                </div>
            </div>

            {/* Body Section */}
            <div className="p-4 bg-white rounded-b-xl">
                <div className="text-xs text-zinc-600 font-medium leading-relaxed">
                    {children}
                </div>
            </div>

            {/* Status Indicator (Optional, can be used for runtime status later) */}
            {data.stats && (
                <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-lg ring-2 ring-white">
                    {data.stats.executions || 0}
                </div>
            )}

            {/* Bottom Handle - Standard Output */}
            {handles.source && !handles.split && (
                <Handle
                    type="source"
                    position={Position.Bottom}
                    className="!w-4 !h-4 !-bottom-3 !bg-zinc-800 !border-2 !border-white !rounded-full transition-transform hover:scale-125"
                />
            )}

            {/* Split Handles for Conditions (True/False) */}
            {handles.split && (
                <>
                    {/* TRUE Handle */}
                    <Handle
                        type="source"
                        position={Position.Bottom}
                        id="true"
                        style={{ left: '30%' }}
                        className="!w-4 !h-4 !-bottom-3 !bg-emerald-500 !border-2 !border-white !rounded-full transition-transform hover:scale-125 !z-50"
                    />
                    <div className="absolute -bottom-8 left-[25%] text-[10px] font-bold text-emerald-600 bg-white px-1 rounded shadow-sm border border-emerald-100 pointer-events-none">
                        TRUE
                    </div>

                    {/* FALSE Handle */}
                    <Handle
                        type="source"
                        position={Position.Bottom}
                        id="false"
                        style={{ left: '70%' }}
                        className="!w-4 !h-4 !-bottom-3 !bg-red-500 !border-2 !border-white !rounded-full transition-transform hover:scale-125 !z-50"
                    />
                    <div className="absolute -bottom-8 left-[65%] text-[10px] font-bold text-red-600 bg-white px-1 rounded shadow-sm border border-red-100 pointer-events-none">
                        FALSE
                    </div>
                </>
            )}
        </div>
    );
}
