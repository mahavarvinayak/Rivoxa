"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { triggerTypeValidator } from "./schema";

export const executeFlows = internalAction({
  args: {
    userId: v.id("users"),
    triggerType: triggerTypeValidator,
    context: v.any(),
  },
  handler: async (ctx, args) => {
    // Get all active flows for this user with matching trigger
    const flows = await ctx.runQuery(internal.flowEngine_queries.getActiveFlows, {
      userId: args.userId,
      triggerType: args.triggerType,
    });
    
    for (const flow of flows) {
      try {
        // Check if trigger conditions match
        const shouldExecute = await checkTriggerConditions(
          flow.trigger,
          args.context
        );
        
        if (!shouldExecute) continue;
        
        // Execute flow actions
        await executeFlowActions(ctx, flow, args.context);
        
        // Update flow statistics
        await ctx.runMutation(internal.flowEngine_queries.updateFlowStats, {
          flowId: flow._id,
          success: true,
        });
      } catch (error) {
        console.error(`Flow execution error for ${flow._id}:`, error);
        await ctx.runMutation(internal.flowEngine_queries.updateFlowStats, {
          flowId: flow._id,
          success: false,
        });
      }
    }
  },
});

async function checkTriggerConditions(trigger: any, context: any): Promise<boolean> {
  // Check if keywords match
  if (trigger.keywords && trigger.keywords.length > 0) {
    const text = context.text || context.message?.text || "";
    const hasKeyword = trigger.keywords.some((keyword: string) =>
      text.toLowerCase().includes(keyword.toLowerCase())
    );
    if (!hasKeyword) return false;
  }
  
  // Additional condition checks can be added here
  return true;
}

async function executeFlowActions(ctx: any, flow: any, context: any) {
  const integration = await ctx.runQuery(internal.flowEngine_queries.getIntegration, {
    userId: flow.userId,
    type: flow.trigger.type.includes("instagram") ? "instagram" : "whatsapp",
  });
  
  if (!integration) {
    throw new Error("Integration not found");
  }
  
  for (const action of flow.actions) {
    switch (action.type) {
      case "send_dm":
        await sendDirectMessage(ctx, integration, context, action.config);
        break;
      case "send_reply":
        await sendReply(ctx, integration, context, action.config);
        break;
      case "collect_email":
        await collectContactInfo(ctx, flow.userId, context, action.config);
        break;
      case "add_tag":
        await addContactTag(ctx, flow.userId, context, action.config);
        break;
      case "add_to_sequence":
        await addToSequence(ctx, flow.userId, context, action.config);
        break;
      case "condition":
        const conditionMet = await evaluateCondition(context, action.config);
        if (!conditionMet) {
          break; // Skip remaining actions if condition not met
        }
        break;
      case "delay":
        await new Promise(resolve => setTimeout(resolve, action.config.milliseconds || 1000));
        break;
      case "http_call":
        await makeHttpCall(action.config);
        break;
      default:
        console.log(`Unknown action type: ${action.type}`);
    }
  }
}

async function collectContactInfo(ctx: any, userId: any, context: any, config: any) {
  const platformUserId = context.senderId || context.from;
  const platform = context.platform || "instagram";
  
  await ctx.runMutation(internal.flowEngine_queries.upsertContact, {
    userId,
    platform,
    platformUserId,
    username: context.username,
    email: config.email,
    phone: config.phone,
    name: config.name,
  });
}

async function addContactTag(ctx: any, userId: any, context: any, config: any) {
  const platformUserId = context.senderId || context.from;
  const platform = context.platform || "instagram";
  
  await ctx.runMutation(internal.flowEngine_queries.addTagToContact, {
    userId,
    platform,
    platformUserId,
    tag: config.tag,
  });
}

async function addToSequence(ctx: any, userId: any, context: any, config: any) {
  const platformUserId = context.senderId || context.from;
  const platform = context.platform || "instagram";
  
  await ctx.runMutation(internal.flowEngine_queries.subscribeToSequence, {
    userId,
    platform,
    platformUserId,
    sequenceId: config.sequenceId,
  });
}

async function evaluateCondition(context: any, config: any): Promise<boolean> {
  const { field, operator, value } = config;
  const contextValue = context[field];
  
  switch (operator) {
    case "equals":
      return contextValue === value;
    case "contains":
      return String(contextValue).toLowerCase().includes(String(value).toLowerCase());
    case "greater_than":
      return Number(contextValue) > Number(value);
    case "less_than":
      return Number(contextValue) < Number(value);
    default:
      return true;
  }
}

async function makeHttpCall(config: any) {
  try {
    const response = await fetch(config.url, {
      method: config.method || "POST",
      headers: {
        "Content-Type": "application/json",
        ...(config.headers || {}),
      },
      body: config.body ? JSON.stringify(config.body) : undefined,
    });
    
    if (!response.ok) {
      console.error(`HTTP call failed: ${response.statusText}`);
    }
  } catch (error) {
    console.error("HTTP call error:", error);
  }
}

async function sendDirectMessage(ctx: any, integration: any, context: any, config: any) {
  const recipientId = context.senderId || context.from;
  const message = config.message || "Hello!";
  
  if (integration.type === "instagram") {
    await sendInstagramDM(integration.accessToken, recipientId, message);
  } else if (integration.type === "whatsapp") {
    await sendWhatsAppMessage(integration.accessToken, integration.phoneNumberId, recipientId, message);
  }
  
  // Log the message
  await ctx.runMutation(internal.flowEngine_queries.logMessage, {
    userId: integration.userId,
    platform: integration.type,
    recipientId,
    content: message,
    direction: "outbound",
  });
}

async function sendReply(ctx: any, integration: any, context: any, config: any) {
  const message = config.message || "Thank you!";
  
  if (integration.type === "instagram" && context.commentId) {
    await replyToInstagramComment(
      integration.accessToken,
      context.commentId,
      message
    );
  } else {
    await sendDirectMessage(ctx, integration, context, config);
  }
}

async function sendInstagramDM(accessToken: string, recipientId: string, message: string) {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/me/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: message },
        access_token: accessToken,
      }),
    }
  );
  
  if (!response.ok) {
    throw new Error(`Instagram API error: ${await response.text()}`);
  }
}

async function replyToInstagramComment(accessToken: string, commentId: string, message: string) {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${commentId}/replies`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        access_token: accessToken,
      }),
    }
  );
  
  if (!response.ok) {
    throw new Error(`Instagram API error: ${await response.text()}`);
  }
}

async function sendWhatsAppMessage(
  accessToken: string,
  phoneNumberId: string,
  recipientPhone: string,
  message: string
) {
  const response = await fetch(
    `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: recipientPhone,
        type: "text",
        text: { body: message },
      }),
    }
  );
  
  if (!response.ok) {
    throw new Error(`WhatsApp API error: ${await response.text()}`);
  }
}