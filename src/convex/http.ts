import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { internal } from "./_generated/api";

const http = httpRouter();

auth.addHttpRoutes(http);

// OAuth callback handlers - MOVED TO FRONTEND (Client Side)
// The redirect_uri now points to /auth/callback/:platform
// See src/pages/OAuthCallback.tsx and src/convex/oauth.ts

// Instagram Webhook
http.route({
  path: "/api/webhooks/instagram",
  method: "GET",
  handler: httpAction(async (ctx, req) => {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");

    const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN || "RIVOXA";

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

    const verifyToken = process.env.WEBHOOK_VERIFY_TOKEN || "RIVOXA";

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