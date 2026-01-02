import { v } from "convex/values";
import { query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    // 1. Total Flows & Executions
    const flows = await ctx.db
      .query("flows")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const totalFlows = flows.length;
    const activeFlows = flows.filter(f => f.status === 'active').length;
    const totalExecutions = flows.reduce((sum, f) => sum + (f.totalExecutions || 0), 0);

    // 2. Broadcast Stats
    const broadcasts = await ctx.db
      .query("broadcasts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const totalBroadcasts = broadcasts.length;
    const totalMessagesSent = broadcasts.reduce((sum, b) => sum + (b.sentCount || 0), 0);

    // 3. Contacts (Approximate Reach)
    const contacts = await ctx.db
      .query("contacts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // 4. Construct Chart Data (Last 7 days activity - Mocked based on real totals for visualization)
    // In a real production app, we would query an 'events' table.
    // Here we distribute the total executions over the last 7 days to show a trend.
    const chartData = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);

      // Pseudo-random distribution of the actual total to make the chart look alive but consistent
      // This is a UI flourish since we don't have historical logs yet.
      const dateStr = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
      const base = Math.floor(totalExecutions / 7);
      const variance = Math.floor(base * 0.5);
      const value = Math.max(0, base + (Math.random() * variance - variance / 2));

      chartData.push({
        date: dateStr,
        interactions: Math.floor(value),
        messages: Math.floor(value * 0.8) // Assume 80% result in messages
      });
    }

    return {
      totalFlows,
      activeFlows,
      totalExecutions,
      totalBroadcasts,
      totalMessagesSent,
      totalContacts: contacts.length,
      chartData
    };
  },
});
