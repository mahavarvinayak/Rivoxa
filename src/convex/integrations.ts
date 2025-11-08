import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getCurrentUser } from "./users";
import { integrationTypeValidator } from "./schema";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    
    return await ctx.db
      .query("integrations")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();
  },
});

export const getByType = query({
  args: { type: integrationTypeValidator },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;
    
    const integrations = await ctx.db
      .query("integrations")
      .withIndex("by_user_and_type", (q) => 
        q.eq("userId", user._id).eq("type", args.type)
      )
      .collect();
    
    return integrations[0] || null;
  },
});

export const create = internalMutation({
  args: {
    type: integrationTypeValidator,
    accessToken: v.string(),
    refreshToken: v.optional(v.string()),
    expiresAt: v.optional(v.number()),
    platformUserId: v.string(),
    platformUsername: v.optional(v.string()),
    phoneNumberId: v.optional(v.string()),
    businessAccountId: v.optional(v.string()),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    // Check if integration already exists
    const existing = await ctx.db
      .query("integrations")
      .withIndex("by_user_and_type", (q) => 
        q.eq("userId", args.userId).eq("type", args.type)
      )
      .first();
    
    if (existing) {
      // Update existing integration
      await ctx.db.patch(existing._id, {
        accessToken: args.accessToken,
        refreshToken: args.refreshToken,
        expiresAt: args.expiresAt,
        platformUserId: args.platformUserId,
        platformUsername: args.platformUsername,
        phoneNumberId: args.phoneNumberId,
        businessAccountId: args.businessAccountId,
        isActive: true,
      });
      return existing._id;
    }
    
    return await ctx.db.insert("integrations", {
      userId: args.userId,
      type: args.type,
      accessToken: args.accessToken,
      refreshToken: args.refreshToken,
      expiresAt: args.expiresAt,
      platformUserId: args.platformUserId,
      platformUsername: args.platformUsername,
      phoneNumberId: args.phoneNumberId,
      businessAccountId: args.businessAccountId,
      isActive: true,
    });
  },
});

export const disconnect = mutation({
  args: { id: v.id("integrations") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");
    
    const integration = await ctx.db.get(args.id);
    if (!integration || integration.userId !== user._id) {
      throw new Error("Integration not found");
    }
    
    await ctx.db.patch(args.id, { isActive: false });
  },
});