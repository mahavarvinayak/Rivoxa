import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { getCurrentUser } from "./users";
import { integrationTypeValidator } from "./schema";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    return await ctx.db
      .query("broadcasts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    message: v.string(),
    platform: integrationTypeValidator,
    targetAudience: v.optional(v.object({
      tags: v.optional(v.array(v.string())),
      segments: v.optional(v.array(v.string())),
      excludeTags: v.optional(v.array(v.string())),
    })),
    scheduledFor: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    return await ctx.db.insert("broadcasts", {
      userId: user._id,
      name: args.name,
      message: args.message,
      platform: args.platform,
      targetAudience: args.targetAudience,
      scheduledFor: args.scheduledFor,
      status: args.scheduledFor ? "scheduled" : "draft",
      totalRecipients: 0,
      sentCount: 0,
      deliveredCount: 0,
      failedCount: 0,
      openedCount: 0,
      clickedCount: 0,
    });
  },
});

// Start sending the broadcast
export const send = mutation({
  args: { id: v.id("broadcasts") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const broadcast = await ctx.db.get(args.id);
    if (!broadcast || broadcast.userId !== user._id) {
      throw new Error("Broadcast not found");
    }

    await ctx.db.patch(args.id, { status: "sending" });

    // Get eligible contacts (simplified: all contacts for platform)
    // In real app: apply targetAudience filters
    const contacts = await ctx.db
      .query("contacts")
      .withIndex("by_user_and_platform", (q) =>
        q.eq("userId", broadcast.userId).eq("platform", broadcast.platform)
      )
      .collect();

    if (contacts.length === 0) {
      await ctx.db.patch(args.id, { status: "completed", totalRecipients: 0 });
      return;
    }

    await ctx.db.patch(args.id, { totalRecipients: contacts.length });

    // Schedule the batch processing
    await ctx.scheduler.runAfter(0, internal.broadcasts.processBatch, {
      broadcastId: args.id,
      contactIds: contacts.map(c => c._id),
      startIndex: 0,
    });
  },
});

// Process a batch of contacts recursively
export const processBatch = internalMutation({
  args: {
    broadcastId: v.id("broadcasts"),
    contactIds: v.array(v.id("contacts")),
    startIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const broadcast = await ctx.db.get(args.broadcastId);
    if (!broadcast) return;

    // Fetch integration once to get Page ID
    const integration = await ctx.db
      .query("integrations")
      .withIndex("by_user_and_type", (q) =>
        q.eq("userId", broadcast.userId).eq("type", broadcast.platform)
      )
      .first();

    if (!integration) {
      await ctx.db.patch(args.broadcastId, { status: "failed" });
      return;
    }

    const BATCH_SIZE = 5; // Conservative batch size
    const DELAY_BETWEEN_MS = 5000; // 5 seconds delay to be very safe
    const endIndex = Math.min(args.startIndex + BATCH_SIZE, args.contactIds.length);

    for (let i = args.startIndex; i < endIndex; i++) {
      const contactId = args.contactIds[i];
      const contact = await ctx.db.get(contactId);

      if (contact && contact.platformUserId) {
        // Stagger messages in this batch
        const delay = (i - args.startIndex) * DELAY_BETWEEN_MS;

        await ctx.scheduler.runAfter(delay, internal.instagram.sendDirectMessage, {
          userId: contact.platformUserId, // Recipient PSID
          pageId: integration.platformUserId, // Sender Page ID
          message: broadcast.message
        });
      }
    }

    // Update progress
    const sentCount = (broadcast.sentCount || 0) + (endIndex - args.startIndex);
    await ctx.db.patch(args.broadcastId, { sentCount });

    // Schedule next batch
    if (endIndex < args.contactIds.length) {
      const nextBatchDelay = BATCH_SIZE * DELAY_BETWEEN_MS;
      await ctx.scheduler.runAfter(nextBatchDelay, internal.broadcasts.processBatch, {
        broadcastId: args.broadcastId,
        contactIds: args.contactIds,
        startIndex: endIndex,
      });
    } else {
      await ctx.db.patch(args.broadcastId, { status: "completed" });
    }
  },
});
