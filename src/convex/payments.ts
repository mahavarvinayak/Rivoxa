"use node";

import { v } from "convex/values";
import { internalAction, action } from "./_generated/server";
import { internal } from "./_generated/api";
import Razorpay from "razorpay";
import crypto from "crypto";
import { PLAN_TYPES } from "./schema";

function getRazorpayInstance() {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
}

export const createPaymentOrder = action({
  args: {
    planType: v.union(
      v.literal(PLAN_TYPES.PRO),
      v.literal(PLAN_TYPES.ULTIMATE),
      v.literal(PLAN_TYPES.BUSINESS)
    ),
  },
  handler: async (ctx, args): Promise<{
    orderId: string;
    amount: number;
    currency: string;
    keyId: string | undefined;
  }> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user: any = await ctx.runQuery(internal.users.getCurrentUserInternal);
    if (!user) throw new Error("User not found");

    const amounts: Record<string, number> = {
      [PLAN_TYPES.PRO]: 499,
      [PLAN_TYPES.ULTIMATE]: 999,
      [PLAN_TYPES.BUSINESS]: 1999,
    };

    const amount = amounts[args.planType];
    if (!amount) throw new Error("Invalid plan type");

    const options: any = {
      amount: amount * 100, // Convert to paise (INR)
      currency: "INR",
      receipt: `plan_${args.planType}_${user._id}`,
      payment_capture: 1,
      notes: {
        userId: user._id,
        planType: args.planType,
        email: user.email || "",
      },
    };

    const razorpay = getRazorpayInstance();
    const order: any = await razorpay.orders.create(options);
    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    };
  },
});

export const verifyPayment = action({
  args: {
    orderId: v.string(),
    paymentId: v.string(),
    signature: v.string(),
    planType: v.union(
      v.literal(PLAN_TYPES.PRO),
      v.literal(PLAN_TYPES.ULTIMATE),
      v.literal(PLAN_TYPES.BUSINESS)
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.runQuery(internal.users.getCurrentUserInternal);
    if (!user) throw new Error("User not found");

    // Verify signature
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
    hmac.update(args.orderId + "|" + args.paymentId);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== args.signature) {
      return { verified: false, error: "Invalid signature" };
    }

    // Update user plan
    await ctx.runMutation(internal.payments_mutations.updateUserPlanMutation, {
      userId: user._id,
      planType: args.planType,
      planStartDate: Date.now(),
      planEndDate: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      razorpayOrderId: args.orderId,
      razorpayPaymentId: args.paymentId,
      lastPaymentDate: Date.now(),
    });

    return { verified: true };
  },
});