import { query } from "./_generated/server";

export const check = query({
    args: {},
    handler: async () => {
        console.log("✅ Health check running!");
        return "Backend is healthy";
    },
});
