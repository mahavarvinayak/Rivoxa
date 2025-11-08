import { v } from "convex/values";
import { internalQuery, internalMutation } from "./_generated/server";
import { triggerTypeValidator, integrationTypeValidator } from "./schema";

export const getActiveFlows = internalQuery({
  args: {
    userId: v.id("users"),
    triggerType: triggerTypeValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("flows")
      .withIndex("by_user_and_status", (q) =>
        q.eq("userId", args.userId).eq("status", "active")
      )
      .filter((q) => q.eq(q.field("trigger.type"), args.triggerType))
      .collect();
  },
});

export const getIntegration = internalQuery({
  args: {
    userId: v.id("users"),
    type: integrationTypeValidator,
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("integrations")
      .withIndex("by_user_and_type", (q) =>
        q.eq("userId", args.userId).eq("type", args.type)
      )
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();
  },
});

export const updateFlowStats = internalMutation({
  args: {
    flowId: v.id("flows"),
    success: v.boolean(),
  },
  handler: async (ctx, args) => {
    const flow = await ctx.db.get(args.flowId);
    if (!flow) return;
    
    await ctx.db.patch(args.flowId, {
      totalExecutions: (flow.totalExecutions || 0) + 1,
      successfulExecutions: args.success
        ? (flow.successfulExecutions || 0) + 1
        : flow.successfulExecutions,
      failedExecutions: !args.success
        ? (flow.failedExecutions || 0) + 1
        : flow.failedExecutions,
    });
  },
});

export const logMessage = internalMutation({
  args: {
    userId: v.id("users"),
    platform: integrationTypeValidator,
    recipientId: v.string(),
    content: v.string(),
    direction: v.union(v.literal("inbound"), v.literal("outbound")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      userId: args.userId,
      platform: args.platform,
      direction: args.direction,
      recipientId: args.recipientId,
      messageType: "text",
      content: args.content,
      status: "sent",
    });
  },
});
