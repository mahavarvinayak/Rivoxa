import { useEffect } from "react";
import { useParams, useSearchParams } from "react-router";

export default function OAuthCallback() {
    const { platform } = useParams();
    const [searchParams] = useSearchParams();
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    useEffect(() => {
        // We are in a popup. The main window (opener) holds the session.
        // We just need to pass the code back to it.

        if (!window.opener) {
            document.body.innerHTML = "<div style='text-align:center; padding: 20px;'>Please close this window and try again. (No Opener found)</div>";
            return;
        }

        if (error) {
            window.opener.postMessage({ type: "oauth-error", platform, error }, window.origin);
            window.close();
            return;
        }

        if (code && platform) {
            window.opener.postMessage({ type: "oauth-code", platform, code }, window.origin);
            window.close();
        }
    }, [code, platform, error]);

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-zinc-950 font-sans">
            <div className="h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-zinc-500">Securing connection...</p>
        </div>
    );
}
