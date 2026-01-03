import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { useAction, useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OAuthCallback() {
    const { platform } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    // Authentication State
    const { isAuthenticated, isLoading } = useConvexAuth();
    const [status, setStatus] = useState("Initializing...");

    const hasExecuted = useRef(false);
    const connectInstagram = useAction(api.oauth.completeInstagramAuth);

    useEffect(() => {
        if (isLoading) {
            setStatus("Loading authentication...");
            return;
        }

        if (!isAuthenticated) {
            setStatus("Not Authenticated. Waiting for session...");
            return;
        }

        if (hasExecuted.current) {
            setStatus("Processing...");
            return;
        }

        if (error) {
            setStatus(`Error from Meta: ${error}`);
            return;
        }

        if (!code || !platform) {
            setStatus("Missing code or platform.");
            return;
        }

        // Only execute if authenticated and we have code
        hasExecuted.current = true;
        setStatus("Exchanging code...");

        const handleAuth = async () => {
            try {
                if (platform === "instagram") {
                    await connectInstagram({ code });
                    toast.success("Instagram Connected Successfully! 🎉");
                    // Close popup if possible, or redirect
                    if (window.opener) {
                        window.close();
                    } else {
                        navigate("/integrations");
                    }
                }
                // Add other platforms here
            } catch (err: any) {
                console.error("OAuth Error:", err);
                setStatus(`Failed: ${err.message}`);
                hasExecuted.current = false; // Allow retry
            }
        };

        handleAuth();
    }, [code, platform, error, navigate, connectInstagram, isLoading, isAuthenticated]);

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-zinc-950 p-4 font-sans">
            <div className="text-center space-y-4">
                {status.includes("Failed") || status.includes("Error") ? (
                    <div className="text-red-500 font-medium mb-4">{status}</div>
                ) : (
                    <>
                        <Loader2 className="h-10 w-10 animate-spin text-purple-600 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Connecting Account</h2>
                    </>
                )}

                <p className="text-zinc-500 text-sm">{status}</p>

                <div className="text-xs text-zinc-400 bg-zinc-100 dark:bg-zinc-900 p-4 rounded text-left mt-4 max-w-md mx-auto overflow-auto">
                    <p>Debug Info:</p>
                    <p>Auth Loading: {isLoading ? "Yes" : "No"}</p>
                    <p>Authenticated: {isAuthenticated ? "Yes" : "No"}</p>
                    <p>Code Present: {code ? "Yes" : "No"}</p>
                </div>

                {!isAuthenticated && !isLoading && (
                    <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                        <RefreshCw className="mr-2 h-4 w-4" /> Reload Session
                    </Button>
                )}
            </div>
        </div>
    );
}
