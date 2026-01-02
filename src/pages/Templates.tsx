import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { Loader2, Copy, Sparkles, LayoutTemplate, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { FLOW_TEMPLATES } from "@/lib/templates";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function Templates() {
    const { isLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const createFlow = useMutation(api.flows.create);
    const [cloningId, setCloningId] = useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        navigate("/auth");
        return null;
    }

    const handleUseTemplate = async (template: any) => {
        setCloningId(template.id);
        try {
            const flowId = await createFlow({
                name: `${template.name} (Copy)`,
                description: template.description,
                trigger: {
                    // Default trigger from template, or generic if missing
                    type: template.nodes.find((n: any) => n.type === 'trigger')?.data?.triggerType || 'instagram_comment',
                } as any, // Type cast for safety
                actions: [],
                nodes: template.nodes,
                edges: template.edges,
            });

            toast.success("Template cloned successfully! 🚀");
            navigate(`/flows/${flowId}/editor`);
        } catch (error) {
            toast.error("Failed to clone template.");
            console.error(error);
        } finally {
            setCloningId(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 p-8">
            {/* Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            </div>

            <div className="container mx-auto max-w-7xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
                        <LayoutTemplate className="h-8 w-8 text-purple-600" />
                        Prebuilt Flows Library
                    </h1>
                    <p className="text-slate-500 mt-2 text-lg">
                        Don't start from scratch. Pick a battle-tested automation recipe and launch in seconds.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {FLOW_TEMPLATES.map((template) => {
                        const Icon = template.icon || Sparkles;
                        return (
                            <Card key={template.id} className="flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-slate-200 group overflow-hidden">
                                <div className={cn("h-2 bg-gradient-to-r w-full", template.color || "from-blue-500 to-purple-500")} />
                                <CardHeader>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className={cn("p-2.5 rounded-xl text-white shadow-sm", template.color || "bg-slate-900")}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                                        {template.name}
                                    </CardTitle>
                                    <CardDescription className="line-clamp-3 min-h-[3rem]">
                                        {template.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardFooter className="mt-auto pt-0">
                                    <Button
                                        className="w-full shadow-md group-hover:shadow-lg transition-all"
                                        onClick={() => handleUseTemplate(template)}
                                        disabled={!!cloningId}
                                        variant={cloningId === template.id ? 'secondary' : 'default'}
                                    >
                                        {cloningId === template.id ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Copying...
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="mr-2 h-4 w-4" /> Use Template
                                            </>
                                        )}
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
