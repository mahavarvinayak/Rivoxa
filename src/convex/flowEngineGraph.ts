import { v } from "convex/values";
import { internalMutation, internalQuery, MutationCtx, QueryCtx } from "./_generated/server";
import { internal } from "./_generated/api";

// Helper to find the next node(s) connected to the current node
export const getNextNodes = async (ctx: QueryCtx, flowId: any, currentNodeId: string) => {
    const flow = await ctx.db.get(flowId);
    if (!flow || !(flow as any).edges) return [];

    // Find edges where source is the current node
    const edges = (flow as any).edges.filter((edge: any) => edge.source === currentNodeId);

    // Return the target node IDs
    return edges.map((edge: any) => {
        // Find the node object for the target ID
        return (flow as any).nodes.find((node: any) => node.id === edge.target);
    }).filter(Boolean);
};

// The core execution function
export const executeNode = internalMutation({
    args: {
        flowId: v.id("flows"),
        nodeId: v.string(),
        context: v.any(), // Passes user data, last message, etc.
    },
    handler: async (ctx, args) => {
        const flow = await ctx.db.get(args.flowId);
        if (!flow || !(flow as any).nodes) return;

        const node = (flow as any).nodes.find((n: any) => n.id === args.nodeId);
        if (!node) return;

        console.log(`Executing Node [${node.type}]: ${node.id}`, node.data);

        // 1. EXECUTE ACTION
        if (node.type === 'action') {
            const actionType = node.data.actionType;
            const config = node.data.config;

            if (actionType === 'send_dm') {
                // Call the unified message sender
                await ctx.scheduler.runAfter(0, internal.instagram.sendDirectMessage, {
                    userId: args.context.userId, // The end user's ID (e.g. Instagram Scope ID)
                    message: config.message,
                    pageId: args.context.pageId,
                });
                console.log(`Sent DM: ${config.message}`);
            } else if (actionType === 'delay') {
                // Determine delay in milliseconds
                let ms = 0;
                const duration = config.duration || 1;
                if (config.unit === 'minutes') ms = duration * 60 * 1000;
                else if (config.unit === 'hours') ms = duration * 60 * 60 * 1000;
                else if (config.unit === 'days') ms = duration * 24 * 60 * 60 * 1000;

                // Stop execution here, schedule the NEXT node after delay
                const nextNodes = await getNextNodes(ctx, args.flowId, args.nodeId);
                if (nextNodes.length > 0) {
                    // Scheduling the continuation
                    await ctx.scheduler.runAfter(ms, internal.flowEngineGraph.executeNode, {
                        flowId: args.flowId,
                        nodeId: nextNodes[0].id,
                        context: args.context,
                    });
                    return; // EXIT, do not continue immediately
                }
            } else if (actionType === 'condition') {
                // CONDITIONAL LOGIC EXECUTION
                const variable = config.variable || 'message_text';
                const operator = config.operator || 'contains';
                const value = config.value?.toLowerCase() || '';

                // 1. Resolve Variable
                let actualValue = '';
                if (variable === 'message_text') actualValue = (args.context.message || '').toLowerCase();
                else if (variable === 'user_tag') actualValue = (args.context.tags || []).join(',').toLowerCase();
                else if (variable === 'follower_count') actualValue = args.context.followerCount || 0;
                else if (variable === 'is_follower') actualValue = args.context.isFollower ? 'true' : 'false';

                // 2. Evaluate Condition
                let result = false;
                if (operator === 'equals') result = actualValue == value;
                else if (operator === 'contains') result = actualValue.includes(value);
                else if (operator === 'starts_with') result = actualValue.toString().startsWith(value);
                else if (operator === 'greater_than') result = Number(actualValue) > Number(value);
                else if (operator === 'less_than') result = Number(actualValue) < Number(value);

                console.log(`Condition Checked: ${variable} (${actualValue}) ${operator} ${value} = ${result}`);

                // 3. Find Next Node based on Result Handle
                const targetHandle = result ? 'true' : 'false';

                // Custom logic to find specific edge handle
                // We access the raw flow object to check edge handles
                const edges = (flow as any).edges.filter((edge: any) =>
                    edge.source === args.nodeId && edge.sourceHandle === targetHandle
                );

                const nextNodeIds = edges.map((e: any) => e.target);

                if (nextNodeIds.length > 0) {
                    await ctx.scheduler.runAfter(0, internal.flowEngineGraph.executeNode, {
                        flowId: args.flowId,
                        nodeId: nextNodeIds[0], // Follow the first matching path
                        context: args.context,
                    });
                }
                return; // EXIT, handled branching manually
            } else if (actionType === 'add_tag') {
                // ADD TAG LOGIC
                // We need to find the specific contact and update them
                // This assumes contacts table exists and uses platformUserId
                const tagName = config.tag;
                if (tagName) {
                    const contact = await ctx.db.query("contacts")
                        .withIndex("by_platform_user", (q) => q.eq("platformUserId", args.context.userId))
                        .first();

                    if (contact) {
                        const currentTags = contact.tags || [];
                        if (!currentTags.includes(tagName)) {
                            await ctx.db.patch(contact._id, { tags: [...currentTags, tagName] });
                        }
                    }
                }
                console.log(`Added Tag: ${tagName}`);

            } else if (actionType === 'collect_email') {
                // COLLECT EMAIL LOGIC
                const prompt = config.message || "Please share your email address";

                await ctx.scheduler.runAfter(0, internal.instagram.sendDirectMessage, {
                    userId: args.context.userId,
                    message: prompt,
                    pageId: args.context.pageId,
                });
                console.log(`Sent Email Prompt: ${prompt}`);
            } else if (actionType === 'time_window') {
                // TIME WINDOW Logic
                // Check if current time is within range
                const now = new Date();
                // Basic implementation: Parse HH:MM and compare
                // A better approach would use a library for timezone support
                const currentHour = now.getUTCHours();
                const currentMin = now.getUTCMinutes();
                // For MVP, simplistic check ignoring timezone complexity or assume Inputs are UTC
                // TODO: Add proper timezone offset handling if needed

                // Let's assume user inputs are in UTC for now to simplify
                const [startH, startM] = (config.startTime || "09:00").split(':').map(Number);
                const [endH, endM] = (config.endTime || "17:00").split(':').map(Number);

                const currentTotal = currentHour * 60 + currentMin;
                const startTotal = startH * 60 + startM;
                const endTotal = endH * 60 + endM;

                const isOpen = currentTotal >= startTotal && currentTotal <= endTotal;
                const nextHandle = isOpen ? 'true' : 'false';

                // Custom logic to find specific edge handle for branching
                const edges = (flow as any).edges.filter((edge: any) =>
                    edge.source === args.nodeId && edge.sourceHandle === nextHandle
                );
                const nextNodeIds = edges.map((e: any) => e.target);

                if (nextNodeIds.length > 0) {
                    await ctx.scheduler.runAfter(0, internal.flowEngineGraph.executeNode, {
                        flowId: args.flowId,
                        nodeId: nextNodeIds[0],
                        context: args.context
                    });
                }
                return; // EXIT, handled branching manually

            } else if (actionType === 'randomizer') {
                // RANDOMIZER Logic
                const percentage = config.percentage || 50;
                const r = Math.random() * 100;
                const isPathA = r < percentage;

                const nextHandle = isPathA ? 'true' : 'false';

                // Custom logic to find specific edge handle for branching
                const edges = (flow as any).edges.filter((edge: any) =>
                    edge.source === args.nodeId && edge.sourceHandle === nextHandle
                );
                const nextNodeIds = edges.map((e: any) => e.target);

                if (nextNodeIds.length > 0) {
                    await ctx.scheduler.runAfter(0, internal.flowEngineGraph.executeNode, {
                        flowId: args.flowId,
                        nodeId: nextNodeIds[0],
                        context: args.context
                    });
                }
                return; // EXIT, handled branching manually

            } else if (actionType === 'sentiment') {
                // SENTIMENT CHECK Logic (Free, Local)
                const target = config.targetSentiment || 'negative';
                const msg = (args.context.message || "").toLowerCase();

                // Simple keyword lists (English)
                const negativeWords = ["bad", "hate", "angry", "worst", "slow", "scam", "stupid", "useless", "broken", "fail", "terrible", "horrible", "refund", "cancel"];
                const positiveWords = ["good", "love", "awesome", "great", "fast", "thanks", "helpful", "amazing", "happy", "best", "excellent", "working"];
                const urgentWords = ["help", "urgent", "emergency", "stuck", "call", "agent", "human", "support", "asap"];

                let detected = 'neutral';
                if (urgentWords.some(w => msg.includes(w))) detected = 'urgent';
                else if (negativeWords.some(w => msg.includes(w))) detected = 'negative';
                else if (positiveWords.some(w => msg.includes(w))) detected = 'positive';

                // Check if detected matches target (e.g. if looking for 'negative' and we found 'negative', go true)
                // Or if looking for 'urgent' etc.
                const isMatch = detected === target;

                console.log(`Sentiment: "${msg}" -> Detected: ${detected} (Target: ${target}) => Match: ${isMatch}`);

                const nextHandle = isMatch ? 'true' : 'false';
                // Custom logic to find specific edge handle for branching
                const edges = (flow as any).edges.filter((edge: any) =>
                    edge.source === args.nodeId && edge.sourceHandle === nextHandle
                );
                const nextNodeIds = edges.map((e: any) => e.target);

                if (nextNodeIds.length > 0) {
                    await ctx.scheduler.runAfter(0, internal.flowEngineGraph.executeNode, {
                        flowId: args.flowId,
                        nodeId: nextNodeIds[0],
                        context: args.context
                    });
                }
                return; // EXIT, handled branching manually

            } else if (actionType === 'webhook') {
                // WEBHOOK Logic (Fire and Forget)
                const url = config.url;
                const method = config.method || 'POST';
                const bodyRaw = config.body || "{}";

                // Basic variable substitution
                let body = bodyRaw
                    .replace("{{user_id}}", args.context.userId || "")
                    .replace("{{message}}", args.context.message || "")
                    .replace("{{name}}", args.context.name || "");

                // Schedule the external action
                await ctx.scheduler.runAfter(0, internal.actions.sendWebhook, {
                    url,
                    method,
                    body,
                });
                console.log(`Webhook Scheduled: ${method} ${url}`);

                // Flow continues to next node automatically below

            } else if (actionType === 'notify') {
                // NOTIFY ADMIN Logic
                const email = config.email;
                const message = config.message;
                console.log(`[NOTIFICATION] To: ${email}, Msg: ${message}`);
            }
        }

        // 2. CONTINUE TO NEXT NODE (Immediate)
        // If it wasn't a delay node that halted execution
        const nextNodes = await getNextNodes(ctx, args.flowId, args.nodeId);
        if (nextNodes.length > 0) {
            // For simple linear flows, just take the first. Branching requires condition evaluation.
            await ctx.scheduler.runAfter(0, internal.flowEngineGraph.executeNode, {
                flowId: args.flowId,
                nodeId: nextNodes[0].id,
                context: args.context,
            });
        } else {
            console.log("Flow End Reached.");
            // Update stats
            await ctx.db.patch(args.flowId, {
                successfulExecutions: (flow.successfulExecutions || 0) + 1
            });
        }
    }
});

// Entry point for triggers
export const startFlow = internalMutation({
    args: {
        flowId: v.id("flows"),
        triggerType: v.string(),
        context: v.any(),
    },
    handler: async (ctx, args) => {
        const flow = await ctx.db.get(args.flowId);
        if (!flow || !(flow as any).nodes) return;

        // Find the start node for this trigger type
        // In our visual builder, the trigger node is the entry point.
        const startNode = (flow as any).nodes.find((n: any) =>
            n.type === 'trigger' &&
            n.data.triggerType === args.triggerType
        );

        if (startNode) {
            console.log(`Starting Flow ${flow.name} at node ${startNode.id}`);
            await ctx.db.patch(args.flowId, {
                totalExecutions: (flow.totalExecutions || 0) + 1
            });

            // Start execution at the node connected to the trigger
            // Or execute the trigger node itself (usually a no-op, just passes through)
            const nextNodes = await getNextNodes(ctx, args.flowId, startNode.id);
            if (nextNodes.length > 0) {
                await ctx.scheduler.runAfter(0, internal.flowEngineGraph.executeNode, {
                    flowId: args.flowId,
                    nodeId: nextNodes[0].id,
                    context: args.context,
                });
            }
        }
    }
});
