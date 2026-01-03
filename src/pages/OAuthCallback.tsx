import { useEffect, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useAction, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function OAuthCallback() {
    const { platform } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // Authentication State
    const { isAuthenticated, isLoading } = useConvexAuth();

    // Use a ref to prevent double-execution in React Strict Mode
    const hasExecuted = useRef(false);

    // Actions
    const connectInstagram = useAction(api.oauth.completeInstagramAuth);
    // const connectWhatsApp = useAction(api.oauth.completeWhatsAppAuth);

    useEffect(() => {
        if (hasExecuted.current) return;

        // 1. Wait for Auth to load
        if (isLoading) return;

        // 2. Check if user is authenticated
        if (!isAuthenticated) {
            toast.error("Session expired during redirect. Please log in again.");
            // Redirect to auth, but remember where we were? 
            // For now, just go to auth. The user will have to retry connecting.
            navigate("/auth");
            return;
        }

        if (error) {
            toast.error(`Authentication Failed: ${error}`);
            navigate("/integrations");
            return;
        }

        if (!code || !platform) {
            navigate("/integrations");
            return;
        }

        hasExecuted.current = true;

        const handleAuth = async () => {
            try {
                if (platform === "instagram") {
                    await connectInstagram({ code });
                    toast.success("Instagram Connected Successfully! 🎉");
                } else if (platform === "whatsapp") {
                    // await connectWhatsApp({ code });
                    toast.success("WhatsApp Connected! (Mock)");
                }
                navigate("/integrations");
            } catch (err: any) {
                console.error("OAuth Error:", err);
                // Show more specific error
                toast.error(err.message || "Failed to connect account. Please try again.");
                navigate("/integrations");
            }
        };

        handleAuth();
    }, [code, platform, error, navigate, connectInstagram, isLoading, isAuthenticated]);

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-zinc-950">
            <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-4" />
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Connecting your account...</h2>
            <p className="text-zinc-500 mt-2">Please wait while we secure your connection.</p>
            {!isLoading && !isAuthenticated && (
                <p className="text-red-500 mt-4">Session lost. Redirecting to login...</p>
            )}
        </div>
    );
}
