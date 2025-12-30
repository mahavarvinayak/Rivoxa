import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";
import { triggerTypeValidator, flowStatusValidator, PLAN_TYPES } from "./schema";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    
    return await ctx.db
      .query("flows")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const get = query({
  args: { id: v.id("flows") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    
    const flow = await ctx.db.get(args.id);
    if (!flow || flow.userId !== user._id) return null;
    
    return flow;
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    trigger: v.object({
      type: triggerTypeValidator,
      keywords: v.optional(v.array(v.string())),
      conditions: v.optional(v.any()),
      postId: v.optional(v.string()),
      scheduleTime: v.optional(v.string()),
      requireFollow: v.optional(v.boolean()),
    }),
    actions: v.array(v.object({
      type: v.string(),
      config: v.any(),
    })),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    // Check plan limits if creating an active flow (default is draft, but good to check if we allow setting status)
    // Since this creates as "draft", we don't strictly need to check active limit here, 
    // but we should check if they are allowed to create flows at all if there was a total limit.
    // The prompt says "Up to X active automation flows". So draft creation is fine.
    
    return await ctx.db.insert("flows", {
      userId: user._id,
      name: args.name,
      description: args.description,
      status: "draft",
      trigger: args.trigger,
      actions: args.actions,
      totalExecutions: 0,
      successfulExecutions: 0,
      failedExecutions: 0,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("flows"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(flowStatusValidator),
    trigger: v.optional(v.object({
      type: triggerTypeValidator,
      keywords: v.optional(v.array(v.string())),
      conditions: v.optional(v.any()),
      postId: v.optional(v.string()),
      scheduleTime: v.optional(v.string()),
      requireFollow: v.optional(v.boolean()),
    })),
    actions: v.optional(v.array(v.object({
      type: v.string(),
      config: v.any(),
    }))),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    
    const flow = await ctx.db.get(args.id);
    if (!flow || flow.userId !== user._id) {
      throw new Error("Flow not found");
    }

    // Check limits if activating a flow
    if (args.status === "active" && flow.status !== "active") {
      const activeFlows = await ctx.db
        .query("flows")
        .withIndex("by_user_and_status", (q) => 
          q.eq("userId", user._id).eq("status", "active")
        )
        .collect();

      const plan = user.planType || PLAN_TYPES.FREE;
      let limit = 1; // Default Free limit

      switch (plan) {
        case PLAN_TYPES.FREE:
          limit = 1;
          break;
        case PLAN_TYPES.PRO:
          limit = 5;
          break;
        case PLAN_TYPES.ULTIMATE:
          limit = 15;
          break;
        case PLAN_TYPES.BUSINESS:
          limit = 999999; // Unlimited
          break;
      }

      if (activeFlows.length >= limit) {
        throw new Error(`Plan limit reached. You can only have ${limit} active flows on the ${plan} plan.`);
      }
    }
    
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("flows") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    
    const flow = await ctx.db.get(args.id);
    if (!flow || flow.userId !== user._id) {
      throw new Error("Flow not found");
    }
    
    await ctx.db.delete(args.id);
  },
});

export const getStats = query({
  args: { id: v.id("flows") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    
    const flow = await ctx.db.get(args.id);
    if (!flow || flow.userId !== user._id) return null;
    
    return {
      totalExecutions: flow.totalExecutions || 0,
      successfulExecutions: flow.successfulExecutions || 0,
      failedExecutions: flow.failedExecutions || 0,
      successRate: flow.totalExecutions 
        ? ((flow.successfulExecutions || 0) / flow.totalExecutions * 100).toFixed(1)
        : "0",
    };
  },
});