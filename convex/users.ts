import {
  internalMutation,
  internalQuery,
  mutation,
  query,
  QueryCtx,
} from "./_generated/server";

import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { UserJSON } from "@clerk/backend";

/**
 * Whether the current user is fully logged in, including having their information
 * synced from Clerk via webhook.
 *
 * Like all Convex queries, errors on expired Clerk token.
 */
export const userLoginStatus = query(
  async (
    ctx
  ): Promise<
    | ["No JWT Token", null]
    | ["No Clerk User", null]
    | ["Logged In", Doc<"users">]
  > => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      // no JWT token, user hasn't completed login flow yet
      return ["No JWT Token", null];
    }
    const user = await getCurrentUser(ctx);
    if (user === null) {
      // If Clerk has not told us about this user we're still waiting for the
      // webhook notification.
      return ["No Clerk User", null];
    }
    return ["Logged In", user];
  }
);

/** The current user, containing user preferences and Clerk user info */
export const currentUser = query((ctx: QueryCtx) => getCurrentUser(ctx));

/** Get user by Clerk use id (AKA "subject" on auth)  */
export const getUser = internalQuery({
  args: { subject: v.string() },
  async handler(ctx, args): Promise<Doc<"users"> | null> {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUser.id", args.subject))
      .unique();
  },
});

/** Update */
export const updateOrCreateUser = internalMutation({
  args: { clerkUser: v.any() },
  async handler(ctx, { clerkUser }: { clerkUser: UserJSON }) {
    const userRecord = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUser.id", clerkUser.id))
      .unique();

    if (userRecord === null) {
      const colors = ["red", "green", "blue"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      await ctx.db.insert("users", { clerkUser, color });
    } else {
      await ctx.db.patch(userRecord._id, { clerkUser });
    }
  },
});

export const deleteUser = internalMutation({
  args: { id: v.string() },
  async handler(ctx, { id }) {
    const userRecord = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkUser.id", id))
      .unique();

    if (userRecord === null) {
      console.warn("can't delete user, does not exist", id);
    } else {
      await ctx.db.delete(userRecord._id);
    }
  },
});

export const setColor = mutation({
  args: { color: v.string() },
  handler: async (ctx, { color }) => {
    const user = await mustGetCurrentUser(ctx);
    ctx.db.patch(user._id, { color });
  },
});

// Helpers

async function getCurrentUser(ctx: QueryCtx): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) {
    return null;
  }
  return await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkUser.id", identity.subject))
    .unique();
}

export async function mustGetCurrentUser(ctx: QueryCtx): Promise<Doc<"users">> {
  const userRecord = await getCurrentUser(ctx);
  if (!userRecord) throw new Error("Can't get current user");
  return userRecord;
}
