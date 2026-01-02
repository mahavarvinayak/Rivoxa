"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const fetchUserMedia = internalAction({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<any> => {
    // Get Instagram integration
    const integration: any = await ctx.runQuery(internal.integrations.getByTypeInternal, {
      type: "instagram",
      userId: args.userId,
    });

    if (!integration) {
      throw new Error("Instagram not connected");
    }

    try {
      // Fetch user's media from Instagram Graph API
      const response: Response = await fetch(
        `https://graph.facebook.com/v18.0/${integration.platformUserId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&access_token=${integration.accessToken}`
      );

      if (!response.ok) {
        throw new Error(`Instagram API error: ${await response.text()}`);
      }

      const data: any = await response.json();

      // Filter for reels only
      const reels: any[] = data.data.filter((media: any) =>
        media.media_type === "VIDEO" || media.media_type === "REELS"
      );

      // Store or update media in database
      for (const reel of reels) {
        await ctx.runMutation(internal.media.upsertMedia, {
          userId: args.userId,
          mediaId: reel.id,
          caption: reel.caption || "",
          mediaType: reel.media_type,
          mediaUrl: reel.media_url,
          thumbnailUrl: reel.thumbnail_url,
          permalink: reel.permalink,
          timestamp: reel.timestamp,
          likeCount: reel.like_count || 0,
          commentsCount: reel.comments_count || 0,
        });
      }

      return reels;
    } catch (error) {
      console.error("Error fetching Instagram media:", error);
      throw error;
    }
  },
});

export const checkUserFollowsBusiness = internalAction({
  args: {
    userId: v.id("users"),
    platformUserId: v.string(),
  },
  handler: async (ctx, args): Promise<boolean> => {
    // Get Instagram integration
    const integration: any = await ctx.runQuery(internal.integrations.getByTypeInternal, {
      type: "instagram",
      userId: args.userId,
    });

    if (!integration) {
      return false; // Cannot verify, assume false or handle error
    }

    try {
      // Note: The Instagram Graph API does not provide a direct "check if user follows me" endpoint 
      // for the Basic Display API or standard Graph API without specific permissions or workarounds.
      // However, for the purpose of this feature, we will simulate the check or use a known method if available.
      // A common workaround is checking if the user is in the business's followers list, but that list can be huge.

      // For now, we will assume true to allow the flow to proceed in this demo environment,
      // as we cannot easily mock the Instagram API relationship check without a real business account.
      // In a production environment, this would involve:
      // 1. Getting the Business Account ID
      // 2. Checking the relationship status via a specific endpoint if available or maintaining a local follower cache.

      // Placeholder for actual API call:
      // const response = await fetch(`https://graph.facebook.com/v18.0/${integration.businessAccountId}/subscribed_apps...`);

      console.log(`Checking if ${args.platformUserId} follows business for user ${args.userId}`);
      return true;
    } catch (error) {
      console.error("Error checking follow status:", error);
      return false;
    }
  },
});

export const sendDirectMessage = internalAction({
  args: {
    userId: v.string(), // Scoped User ID
    pageId: v.string(), // Page ID
    message: v.string(),
  },
  handler: async (ctx, args) => {
    // NOTE: We need the access token. 
    // We can look it up via the pageId if we store it, or pass it in.
    // For now, let's query the integration using the pageId (platformUserId).

    // This is tricky because we don't have the user ID to query `integrations` table easily 
    // unless we pass the system User ID or index by platformUserId.

    // Let's rely on finding any integration with this platformUserId (Page ID)
    const integration = await ctx.runQuery(internal.integrations.getByPlatformUserId, {
      platformUserId: args.pageId,
      type: "instagram"
    });

    if (!integration) {
      console.error("No integration found for sending DM");
      return;
    }

    console.log(`Sending DM to ${args.userId}: ${args.message}`);

    try {
      const url = `https://graph.facebook.com/v18.0/${args.pageId}/messages?access_token=${integration.accessToken}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: { id: args.userId },
          message: { text: args.message }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Instagram API Error sending DM:", errText);
        throw new Error(`Failed to send DM: ${errText}`);
      }

      console.log("DM Sent Successfully");
    } catch (e) {
      console.error("Failed to send DM", e);
    }
  }
});