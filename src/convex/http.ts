import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { internal } from "./_generated/api";

const http = httpRouter();

auth.addHttpRoutes(http);

// OAuth callback handlers
http.route({
  path: "/api/oauth/callback/instagram",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    if (error || !code) {
      return new Response(
        `<html><body><script>window.opener.postMessage({type: 'oauth-error', platform: 'instagram', error: '${error || 'No code received'}'}, '*'); window.close();</script></body></html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }

    try {
      // Get current user from auth
      const userId = await ctx.auth.getUserIdentity();
      
      if (!userId) {
        throw new Error("Not authenticated");
      }

      await ctx.runAction(internal.oauth.handleInstagramCallback, {
        code,
        userId: userId.subject as any,
      });

      return new Response(
        `<html><body><script>window.opener.postMessage({type: 'oauth-success', platform: 'instagram'}, '*'); window.close();</script></body></html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    } catch (error) {
      console.error("Instagram OAuth error:", error);
      return new Response(
        `<html><body><script>window.opener.postMessage({type: 'oauth-error', platform: 'instagram', error: '${error}'}, '*'); window.close();</script></body></html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }
  }),
});

http.route({
  path: "/api/oauth/callback/whatsapp",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    if (error || !code) {
      return new Response(
        `<html><body><script>window.opener.postMessage({type: 'oauth-error', platform: 'whatsapp', error: '${error || 'No code received'}'}, '*'); window.close();</script></body></html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }

    try {
      const userId = await ctx.auth.getUserIdentity();
      
      if (!userId) {
        throw new Error("Not authenticated");
      }

      await ctx.runAction(internal.oauth.handleWhatsAppCallback, {
        code,
        userId: userId.subject as any,
      });

      return new Response(
        `<html><body><script>window.opener.postMessage({type: 'oauth-success', platform: 'whatsapp'}, '*'); window.close();</script></body></html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    } catch (error) {
      console.error("WhatsApp OAuth error:", error);
      return new Response(
        `<html><body><script>window.opener.postMessage({type: 'oauth-error', platform: 'whatsapp', error: '${error}'}, '*'); window.close();</script></body></html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }
  }),
});

export default http;