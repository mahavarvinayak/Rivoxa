"use node";

import { v } from "convex/values";
import { internalAction, action } from "./_generated/server";
import { internal } from "./_generated/api";

export const getAuthUrl = action({
  args: {
    platform: v.string(),
  },
  handler: async (ctx, args) => {
    const appId = process.env.META_APP_ID;
    const siteUrl = process.env.SITE_URL;

    if (!appId) {
      throw new Error("META_APP_ID is not configured in environment variables");
    }

    if (!siteUrl) {
      throw new Error("SITE_URL is not configured in environment variables");
    }

    // Redirect to Frontend Callback Route
    const redirectUri = `${siteUrl}/auth/callback/${args.platform}`;

    const scope = args.platform === "instagram"
      ? "instagram_basic,instagram_manage_messages,instagram_manage_comments"
      : "whatsapp_business_management,whatsapp_business_messaging";

    // Force re-authentication to ensure we get a fresh code
    const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code`;

    return authUrl;
  },
});

export const completeInstagramAuth = action({
  args: {
    code: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await ctx.auth.getUserIdentity();

    if (!userId) {
      throw new Error("Not authenticated");
    }

    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    // Redirect URI must match exactly what was sent in getAuthUrl
    const redirectUri = `${process.env.SITE_URL}/auth/callback/instagram`;

    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&code=${args.code}&redirect_uri=${encodeURIComponent(redirectUri)}`
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error("Token Exchange Error:", errorData);
      throw new Error(`Failed to exchange code: ${errorData.error?.message || 'Unknown error'}`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user's Instagram Business Account
    const accountResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
    );

    if (!accountResponse.ok) {
      throw new Error("Failed to fetch Instagram account");
    }

    const accountData = await accountResponse.json();
    const pageId = accountData.data[0]?.id;

    if (!pageId) {
      throw new Error("No Instagram Business Account found. Please ensure you have a Facebook Page linked.");
    }

    // Get Instagram Business Account ID
    const igResponse = await fetch(
      `https://graph.facebook.com/v18.0/${pageId}?fields=instagram_business_account&access_token=${accessToken}`
    );

    const igData = await igResponse.json();
    const igAccountId = igData.instagram_business_account?.id;

    if (!igAccountId) {
      throw new Error("No Instagram Business Account linked to this Facebook Page.");
    }

    // Get Instagram username
    const profileResponse = await fetch(
      `https://graph.facebook.com/v18.0/${igAccountId}?fields=username&access_token=${accessToken}`
    );

    const profileData = await profileResponse.json();

    // Store integration
    await ctx.runMutation(internal.integrations.create, {
      type: "instagram",
      accessToken: accessToken,
      platformUserId: igAccountId,
      platformUsername: profileData.username,
      userId: userId.subject as any,
    });

    return { success: true };
  },
});

export const handleWhatsAppCallback = internalAction({
  args: {
    code: v.string(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;
    const redirectUri = `${process.env.SITE_URL}/api/oauth/callback/whatsapp`;

    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${appId}&client_secret=${appSecret}&code=${args.code}&redirect_uri=${encodeURIComponent(redirectUri)}`
    );

    if (!tokenResponse.ok) {
      throw new Error("Failed to exchange code for token");
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get WhatsApp Business Account
    const wabResponse = await fetch(
      `https://graph.facebook.com/v18.0/me/businesses?access_token=${accessToken}`
    );

    if (!wabResponse.ok) {
      throw new Error("Failed to fetch WhatsApp Business Account");
    }

    const wabData = await wabResponse.json();
    const businessId = wabData.data[0]?.id;

    if (!businessId) {
      throw new Error("No WhatsApp Business Account found");
    }

    // Get phone number ID
    const phoneResponse = await fetch(
      `https://graph.facebook.com/v18.0/${businessId}/phone_numbers?access_token=${accessToken}`
    );

    const phoneData = await phoneResponse.json();
    const phoneNumberId = phoneData.data[0]?.id;

    // Store integration
    await ctx.runMutation(internal.integrations.create, {
      type: "whatsapp",
      accessToken: accessToken,
      platformUserId: businessId,
      phoneNumberId: phoneNumberId,
      businessAccountId: businessId,
      userId: args.userId,
    });

    return { success: true };
  },
});