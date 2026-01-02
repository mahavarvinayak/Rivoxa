import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Loader2, Send, MessageSquare, Megaphone, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";

export default function Broadcasts() {
    const { isLoading, isAuthenticated, user, signOut } = useAuth();
    const navigate = useNavigate();
    const broadcasts = useQuery(api.broadcasts.list);
    const createBroadcast = useMutation(api.broadcasts.create);
    const sendBroadcast = useMutation(api.broadcasts.send);

    const [isCreating, setIsCreating] = useState(false);
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [includedTags, setIncludedTags] = useState("");
    const [excludedTags, setExcludedTags] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!isAuthenticated) {
        navigate("/auth");
        return null;
    }

    const handleSignOut = async () => {
        await signOut();
        navigate("/auth");
    };

    const handleCreate = async () => {
        if (!name || !message) {
            toast.error("Please fill in all fields");
            return;
        }
        setIsSubmitting(true);
        try {
            const tags = includedTags.split(',').map(t => t.trim()).filter(t => t.length > 0);
            const exclude = excludedTags.split(',').map(t => t.trim()).filter(t => t.length > 0);

            const id = await createBroadcast({
                name,
                message,
                platform: "instagram",
                targetAudience: {
                    tags: tags.length > 0 ? tags : undefined,
                    excludeTags: exclude.length > 0 ? exclude : undefined
                }
            });
            await sendBroadcast({ id });
            toast.success("Broadcast started! 🚀");
            setIsCreating(false);
            setName("");
            setMessage("");
            setIncludedTags("");
            setExcludedTags("");
        } catch (error) {
            toast.error("Failed to start broadcast");
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50/50 flex overflow-hidden">
            {/* Sidebar */}
            <div className="hidden md:block w-64 fixed inset-y-0 z-50">
                <Sidebar onSignOut={handleSignOut} user={user ?? undefined} />
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 relative overflow-y-auto h-screen">
                <div className="container mx-auto px-6 py-8 max-w-6xl">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                                Broadcasts
                            </h1>
                            <p className="text-slate-500 mt-1">Send mass messages to your audience safely.</p>
                        </div>
                        <Dialog open={isCreating} onOpenChange={setIsCreating}>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                                    <Megaphone className="h-4 w-4 mr-2" />
                                    New Broadcast
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Create Broadcast</DialogTitle>
                                    <DialogDescription>
                                        Send a message to all your contacts. Messages are spaced out (5s delay) to prevent rate limits.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Campaign Name</Label>
                                        <Input
                                            placeholder="e.g. Summer Sale Announcement"
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Filter Audience (Optional)</Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <Input
                                                    placeholder="Include Tags (e.g. vip, lead)"
                                                    value={includedTags}
                                                    onChange={e => setIncludedTags(e.target.value)}
                                                    className="text-sm"
                                                />
                                                <p className="text-[10px] text-slate-400">Match ANY of these tags</p>
                                            </div>
                                            <div className="space-y-1">
                                                <Input
                                                    placeholder="Exclude Tags (e.g. blocked)"
                                                    value={excludedTags}
                                                    onChange={e => setExcludedTags(e.target.value)}
                                                    className="text-sm"
                                                />
                                                <p className="text-[10px] text-slate-400">Exclude ANY of these tags</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Message</Label>
                                        <Textarea
                                            placeholder="Hey! Check out our new collection..."
                                            value={message}
                                            onChange={e => setMessage(e.target.value)}
                                            rows={5}
                                        />
                                        <p className="text-xs text-slate-500">
                                            This message will be sent to all your Instagram contacts.
                                        </p>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
                                    <Button onClick={handleCreate} disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                                        Send Broadcast
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="grid gap-4">
                        {broadcasts === undefined ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
                            </div>
                        ) : broadcasts.length === 0 ? (
                            <Card className="border-dashed border-2 bg-slate-50/50">
                                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                    <Megaphone className="h-12 w-12 text-slate-300 mb-4" />
                                    <h3 className="text-lg font-medium text-slate-700">No broadcasts yet</h3>
                                    <p className="text-sm text-slate-500 max-w-sm mt-2">
                                        Create your first broadcast to engage with your audience.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            broadcasts.map((broadcast) => (
                                <Card key={broadcast._id} className="overflow-hidden">
                                    <div className="p-6 flex items-center justify-between">
                                        <div className="flex items-start gap-4">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                                                <MessageSquare className="h-5 w-5 text-slate-500" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold text-slate-900">{broadcast.name}</h3>
                                                    <StatusBadge status={broadcast.status} />
                                                </div>
                                                <p className="text-sm text-slate-500 mt-1 line-clamp-1">{broadcast.message}</p>
                                                <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                                                    <span>Created: {new Date(broadcast._creationTime).toLocaleDateString()}</span>
                                                    <span>•</span>
                                                    <span>Sent: {broadcast.sentCount || 0} / {broadcast.totalRecipients || '?'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-2">
                                            {broadcast.status === 'sending' && (
                                                <div className="text-xs text-purple-600 font-medium animate-pulse flex items-center">
                                                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                                    Sending...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {broadcast.status === 'sending' && (
                                        <div className="h-1 w-full bg-slate-100">
                                            <div
                                                className="h-full bg-purple-500 transition-all duration-500"
                                                style={{ width: `${Math.min(((broadcast.sentCount || 0) / (broadcast.totalRecipients || 1)) * 100, 100)}% ` }}
                                            />
                                        </div>
                                    )}
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    switch (status) {
        case 'completed':
            return <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 gap-1"><CheckCircle2 className="h-3 w-3" /> Completed</Badge>;
        case 'sending':
            return <Badge variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-100 gap-1"><Loader2 className="h-3 w-3 animate-spin" /> Sending</Badge>;
        case 'failed':
            return <Badge variant="destructive" className="gap-1"><AlertCircle className="h-3 w-3" /> Failed</Badge>;
        default:
            return <Badge variant="secondary" className="bg-slate-100 text-slate-700 gap-1"><Clock className="h-3 w-3" /> {status}</Badge>;
    }
}
