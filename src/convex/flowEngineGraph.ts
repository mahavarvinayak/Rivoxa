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
