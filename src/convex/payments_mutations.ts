import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

export const updateUserPlanMutation = internalMutation({
  args: {
    userId: v.id("users"),
    planType: v.union(v.literal("starter"), v.literal("pro")),
    planStartDate: v.number(),
    planEndDate: v.number(),
    razorpayOrderId: v.string(),
    razorpayPaymentId: v.string(),
    lastPaymentDate: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      planType: args.planType,
      planStartDate: args.planStartDate,
      planEndDate: args.planEndDate,
      razorpayOrderId: args.razorpayOrderId,
      razorpayPaymentId: args.razorpayPaymentId,
      lastPaymentDate: args.lastPaymentDate,
      messagesUsedToday: 0,
    });
  },
});