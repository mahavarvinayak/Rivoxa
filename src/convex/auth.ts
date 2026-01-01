// THIS FILE IS READ ONLY. Do not touch this file unless you are correctly adding a new auth provider in accordance to the vly auth documentation

import { convexAuth } from "@convex-dev/auth/server";
import { Anonymous } from "@convex-dev/auth/providers/Anonymous";
import { emailOtp } from "./auth/emailOtp";


export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [emailOtp, Anonymous],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      const user = await ctx.db.get(args.userId);
      // If user exists and doesn't have a planEndDate, initialize trial
      if (user && !user.planEndDate) {
        const sevenDaysFromNow = Date.now() + 7 * 24 * 60 * 60 * 1000;
        await ctx.db.patch(args.userId, {
          planType: "free",
          planEndDate: sevenDaysFromNow,
          lifetimeMessagesSent: 0,
        });
      }
    },
  },
});