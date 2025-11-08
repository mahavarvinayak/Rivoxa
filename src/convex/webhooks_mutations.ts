import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

export const processInstagramMessage = internalMutation({
  args: {
    senderId: v.string(),
    recipientId: v.string(),
    message: v.any(),
    timestamp: v.number(),
  },
  handler: async (ctx, args) => {
    // Find the integration for this Instagram account
    const integration = await ctx.db
      .query("integrations")
      .filter((q) => 
        q.and(
          q.eq(q.field("type"), "instagram"),
          q.eq(q.field("platformUserId"), args.recipientId),
          q.eq(q.field("isActive"), true)
        )
      )
      .first();
    
    if (!integration) {
      console.log("No active Instagram integration found");
      return;
    }
    
    // Store the webhook event
    await ctx.db.insert("webhookEvents", {
      userId: integration.userId,
      platform: "instagram",
      eventType: "message",
      payload: args,
      processed: false,
    });
    
    // Trigger flow execution
    await ctx.scheduler.runAfter(0, internal.flowEngine.executeFlows, {
      userId: integration.userId,
      triggerType: "instagram_dm",
      context: {
        senderId: args.senderId,
        message: args.message,
      },
    });
  },
});

export const processInstagramComment = internalMutation({
  args: {
    commentId: v.string(),
    postId: v.optional(v.string()),
    text: v.string(),
    from: v.any(),
    timestamp: v.string(),
  },
  handler: async (ctx, args) => {
    // Find integration by checking all Instagram integrations
    const integrations = await ctx.db
      .query("integrations")
      .filter((q) => 
        q.and(
          q.eq(q.field("type"), "instagram"),
          q.eq(q.field("isActive"), true)
        )
      )
      .collect();
    
    if (integrations.length === 0) return;
    
    // Process for each integration (in case multiple accounts)
    for (const integration of integrations) {
      await ctx.db.insert("webhookEvents", {
        userId: integration.userId,
        platform: "instagram",
        eventType: "comment",
        payload: args,
        processed: false,
      });
      
      await ctx.scheduler.runAfter(0, internal.flowEngine.executeFlows, {
        userId: integration.userId,
        triggerType: "instagram_comment",
        context: {
          commentId: args.commentId,
          postId: args.postId,
          text: args.text,
          from: args.from,
        },
      });
    }
  },
});

export const processWhatsAppMessage = internalMutation({
  args: {
    messageId: v.string(),
    from: v.string(),
    timestamp: v.string(),
    type: v.string(),
    text: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Find WhatsApp integration
    const integrations = await ctx.db
      .query("integrations")
      .filter((q) => 
        q.and(
          q.eq(q.field("type"), "whatsapp"),
          q.eq(q.field("isActive"), true)
        )
      )
      .collect();
    
    if (integrations.length === 0) return;
    
    for (const integration of integrations) {
      await ctx.db.insert("webhookEvents", {
        userId: integration.userId,
        platform: "whatsapp",
        eventType: "message",
        payload: args,
        processed: false,
      });
      
      await ctx.scheduler.runAfter(0, internal.flowEngine.executeFlows, {
        userId: integration.userId,
        triggerType: "whatsapp_message",
        context: {
          messageId: args.messageId,
          from: args.from,
          text: args.text,
        },
      });
    }
  },
});
