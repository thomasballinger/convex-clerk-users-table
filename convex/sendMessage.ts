import { v } from "convex/values";
import { mustGetCurrentUser } from "./users";
import { mutation } from "./_generated/server";

export default mutation({
  args: { body: v.string() },
  handler: async (ctx, { body }) => {
    const user = await mustGetCurrentUser(ctx);

    const message = { body, user: user._id };
    await ctx.db.insert("messages", message);
  },
});
