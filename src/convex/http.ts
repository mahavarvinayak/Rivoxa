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

// Instagram Webhook
http.route({
  path: "/api/webhooks/instagram",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    
    const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN || "autoflow_verify_token";
    
    if (mode === "subscribe" && token === verifyToken) {
      return new Response(challenge, { status: 200 });
    }
    
    return new Response("Forbidden", { status: 403 });
  }),
});

http.route({
  path: "/api/webhooks/instagram",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const payload = await req.json();
    const signature = req.headers.get("x-hub-signature-256") || undefined;
    
    await ctx.runAction(internal.webhooks.handleInstagramWebhook, {
      payload,
      signature,
    });
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

// WhatsApp Webhook
http.route({
  path: "/api/webhooks/whatsapp",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    
    const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN || "autoflow_verify_token";
    
    if (mode === "subscribe" && token === verifyToken) {
      return new Response(challenge, { status: 200 });
    }
    
    return new Response("Forbidden", { status: 403 });
  }),
});

http.route({
  path: "/api/webhooks/whatsapp",
  method: "POST",
  handler: httpAction(async (ctx, req) => {
    const payload = await req.json();
    const signature = req.headers.get("x-hub-signature-256") || undefined;
    
    await ctx.runAction(internal.webhooks.handleWhatsAppWebhook, {
      payload,
      signature,
    });
    
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }),
});

export default http;