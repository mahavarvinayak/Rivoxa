import { Handle, Position } from "@xyflow/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    };
}

const colors: Record<string, string> = {
    blue: "border-blue-500 bg-blue-50",
    green: "border-green-500 bg-green-50",
    orange: "border-orange-500 bg-orange-50",
    purple: "border-purple-500 bg-purple-50",
    red: "border-red-500 bg-red-50",
    default: "border-slate-200 bg-card",
};

const headerColors: Record<string, string> = {
    blue: "text-blue-700",
    green: "text-green-700",
    orange: "text-orange-700",
    purple: "text-purple-700",
    red: "text-red-700",
    default: "text-foreground",
};

export function BaseNode({ data, selected, title, icon: Icon, color = "default", children, handles = { source: true, target: true } }: BaseNodeProps) {
    return (
        <Card className={cn(
            "w-[280px] shadow-md transition-shadow",
            selected ? "ring-2 ring-primary border-primary" : "",
            colors[color] || colors.default
        )}>
            {handles.target && (
                <Handle type="target" position={Position.Top} className="w-3 h-3 bg-slate-400" />
            )}

            <CardHeader className="p-3 pb-2 flex flex-row items-center gap-2 space-y-0">
                <div className={cn("p-1.5 rounded-md bg-white shadow-sm", headerColors[color] || headerColors.default)}>
                    {Icon && <Icon className="h-4 w-4" />}
                </div>
                <CardTitle className="text-sm font-semibold">{title}</CardTitle>
            </CardHeader>

            <CardContent className="p-3 pt-1">
                <div className="text-xs text-muted-foreground">
                    {children}
                </div>
            </CardContent>

            {handles.source && (
                <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-slate-400" />
            )}
        </Card>
    );
}
