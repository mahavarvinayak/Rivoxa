"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";

export const sendWebhook = internalAction({
    args: {
        url: v.string(),
        method: v.string(),
        body: v.string(),
        headers: v.optional(v.string()), // JSON string of headers
    },
    handler: async (ctx, args) => {
        console.log(`[WEBHOOK] Sending ${args.method} to ${args.url}`);

        try {
            const headers = args.headers ? JSON.parse(args.headers) : { "Content-Type": "application/json" };

            const response = await fetch(args.url, {
                method: args.method,
                headers: headers,
                body: args.method !== 'GET' ? args.body : undefined,
            });

            if (!response.ok) {
                console.error(`[WEBHOOK] Failed: ${response.status} ${response.statusText}`);
            } else {
                const text = await response.text();
                console.log(`[WEBHOOK] Success: ${text.substring(0, 100)}...`);
            }
        } catch (e) {
            console.error(`[WEBHOOK] Error:`, e);
        }
    },
});
