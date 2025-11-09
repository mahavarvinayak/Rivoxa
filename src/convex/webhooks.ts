"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import crypto from "crypto";

// Verify Meta webhook signature
function verifyWebhookSignature(payload: string, signature: string, appSecret: string): boolean {
  const expectedSignature = crypto
    .createHmac("sha256", appSecret)
    .update(payload)
    .digest("hex");
  
  return signature === `sha256=${expectedSignature}`;
}

export const handleInstagramWebhook = internalAction({
  args: {
    payload: v.any(),
    signature: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { payload, signature } = args;
    
    // Verify webhook signature if provided
    if (signature && process.env.META_APP_SECRET) {
      const isValid = verifyWebhookSignature(
        JSON.stringify(payload),
        signature,
        process.env.META_APP_SECRET
      );
      
      if (!isValid) {
        console.error("Invalid webhook signature");
        return { success: false, error: "Invalid signature" };
      }
    }
    
    // Handle Instagram webhook events
    if (payload.object === "instagram") {
      for (const entry of payload.entry || []) {
        // Handle messaging events
        if (entry.messaging) {
          for (const event of entry.messaging) {
            await ctx.runMutation(internal.webhooks_mutations.processInstagramMessage, {
              senderId: event.sender.id,
              recipientId: event.recipient.id,
              message: event.message,
              timestamp: event.timestamp,
            });
          }
        }
        
        // Handle comment events
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === "comments") {
              await ctx.runMutation(internal.webhooks_mutations.processInstagramComment, {
                commentId: change.value.id,
                postId: change.value.media?.id,
                text: change.value.text,
                from: change.value.from,
                timestamp: change.value.timestamp,
              });
            }
          }
        }
      }
    }
    
    return { success: true };
  },
});

export const handleWhatsAppWebhook = internalAction({
  args: {
    payload: v.any(),
    signature: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { payload, signature } = args;
    
    // Verify webhook signature if provided
    if (signature && process.env.META_APP_SECRET) {
      const isValid = verifyWebhookSignature(
        JSON.stringify(payload),
        signature,
        process.env.META_APP_SECRET
      );
      
      if (!isValid) {
        console.error("Invalid webhook signature");
        return { success: false, error: "Invalid signature" };
      }
    }
    
    // Handle WhatsApp webhook events
    if (payload.object === "whatsapp_business_account") {
      for (const entry of payload.entry || []) {
        for (const change of entry.changes || []) {
          if (change.field === "messages") {
            const messages = change.value.messages || [];
            for (const message of messages) {
              await ctx.runMutation(internal.webhooks_mutations.processWhatsAppMessage, {
                messageId: message.id,
                from: message.from,
                timestamp: message.timestamp,
                type: message.type,
                text: message.text?.body,
              });
            }
          }
        }
      }
    }
    
    return { success: true };
  },
});