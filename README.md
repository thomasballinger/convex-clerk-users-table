# Users and Authentication Example App

See it live at https://convex-clerk-users-table.vercel.app/

This example demonstrates how to add authentication and user settings to a basic chat
app. It uses [Clerk](https://clerk.dev/) for authentication.

Users are initially presented with a "Log In" button. After users log in, their
information is persisted to a `users` table. When users send messages, each
message is associated with the user that sent it. Users can change the color their
own messages are rendered in.

## Running the App

Because this app uses authentication, it requires a bit of an additional setup.

Follow these instructions https://docs.convex.dev/auth/clerk to set up Clerk with
Convex.

Additionally save your Clerk credentials in the .env file:

```
VITE_CLERK_PUBLISHABLE_KEY="<your publishable key>"
```

Next, from the Webhooks section of your Clerk instance dashboard, create an
endpoint.

Set the url to something like this (replace ardent-mammoth-732 with your own)
https://ardent-mammoth-732.convex.site/clerk-users-webhook

In Message Filtering, scroll down to select all user events.

Copy the Signing Secret (something like whsec_aB1cD2/eF3gH4...) into an
environment variable called CLERK_WEBHOOK_SECRET in the Convex dashboard
settings for your instance.

When a user signs up you should see logs from the HTTP handler
as well as a new row in the users table in the Convex dashboard.