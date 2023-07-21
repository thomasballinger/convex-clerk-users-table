import { UserJSON } from "@clerk/backend";
import { query } from "./_generated/server";

export default query(async ({ db }) => {
  const messages = await db.query("messages").collect();
  return Promise.all(
    messages.map(async (message) => {
      // For each message in this channel, fetch the `User` who wrote it and
      // insert their name into the `author` field.
      const user = await db.get(message.user);
      return {
        author: user ? `${user.clerkUser.first_name} ${user.clerkUser.last_name}` : "deleted user",
        color: user ? user.color : "black",
        ...message,
      };
    })
  );
});
