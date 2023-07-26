import { UserJSON } from "@clerk/backend";
import { query } from "./_generated/server";
import { userById } from "./users";

export default query(async (ctx) => {
  const messages = await ctx.db.query("messages").collect();
  return Promise.all(
    messages.map(async (message) => {
      // For each message in this channel, fetch the `User` who wrote it and
      // insert their name into the `author` field.
      const user = await userById(ctx, message.user);
      return {
        author: user ? `${user.clerkUser.first_name} ${user.clerkUser.last_name}` : "deleted user",
        color: user ? user.color : "black",
        ...message,
      };
    })
  );
});
