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
      // Check user's message limit
      const user = await ctx.db.get(integration.userId);
      if (!user) continue;

      const planLimits = {
        free: 50,
        pro: 1000,
        ultimate: 5000,
        business: 10000,
      };

      const limit = planLimits[user.planType || "free"];
      const today = new Date().toISOString().split('T')[0];

      // Reset counter if new day
      if (user.lastResetDate !== today) {
        await ctx.db.patch(integration.userId, {
          messagesUsedToday: 0,
          lastResetDate: today,
        });
      }

      // Check if limit exceeded
      if ((user.messagesUsedToday || 0) >= limit) {
        console.log(`User ${user._id} exceeded message limit`);
        continue;
      }

      await ctx.db.insert("webhookEvents", {
        userId: integration.userId,
        platform: "instagram",
        eventType: "comment",
        payload: args,
        processed: false,
      });


      // Find active flow for this trigger
      const activeFlow = await ctx.db
        .query("flows")
        .withIndex("by_user_and_status", (q) =>
          q.eq("userId", integration.userId).eq("status", "active")
        )
        .filter((q) => q.eq(q.field("trigger.type"), "instagram_comment")) // Logic check - we need to see how trigger type is stored
        .first();

      // Actually, we should probably fetch all active flows and filter in code or use a better index
      // For now, let's keep it simple. If we have a new graph flow, it should have a start node.

      const activeFlows = await ctx.db
        .query("flows")
        .withIndex("by_user_and_status", (q) => q.eq("userId", integration.userId).eq("status", "active"))
        .collect();

      const matchingFlow = activeFlows.find(f => {
        // New Graph Logic: Check if it has a Trigger Node of correct type
        if (f.nodes && Array.isArray(f.nodes)) {
          return f.nodes.some((n: any) => n.type === 'trigger' && n.data.triggerType === 'instagram_comment');
        }
        // Fallback legacy check
        return f.trigger?.type === 'instagram_comment';
      });

      if (matchingFlow) {
        await ctx.scheduler.runAfter(0, internal.flowEngineGraph.startFlow, {
          flowId: matchingFlow._id,
          triggerType: "instagram_comment",
          context: {
            commentId: args.commentId,
            postId: args.postId,
            text: args.text,
            from: args.from,
            pageId: integration.platformUserId, // Added for sending DM
            userId: args.from.id // The user to reply to
          },
        });
      } else {
        // Fallback to old engine if needed, or just log
        console.log("No matching flow found for Instagram Comment.");
      }

      // Increment message counter
      await ctx.db.patch(integration.userId, {
        messagesUsedToday: (user.messagesUsedToday || 0) + 1,
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
      // Check user's message limit
      const user = await ctx.db.get(integration.userId);
      if (!user) continue;

      const planLimits = {
        free: 50,
        pro: 1000,
        ultimate: 5000,
        business: 10000,
      };

      const limit = planLimits[user.planType || "free"];
      const today = new Date().toISOString().split('T')[0];

      // Reset counter if new day
      if (user.lastResetDate !== today) {
        await ctx.db.patch(integration.userId, {
          messagesUsedToday: 0,
          lastResetDate: today,
        });
      }

      // Check if limit exceeded
      if ((user.messagesUsedToday || 0) >= limit) {
        console.log(`User ${user._id} exceeded message limit`);
        continue;
      }

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

      // Increment message counter
      await ctx.db.patch(integration.userId, {
        messagesUsedToday: (user.messagesUsedToday || 0) + 1,
      });
    }
  },
});