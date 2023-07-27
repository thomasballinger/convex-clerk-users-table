# Users and Authentication Example App

See it live at https://convex-clerk-users-table.vercel.app/

This example demonstrates authentication and user settings on a basic chat app
with [Clerk](https://clerk.dev/).

Clerk webhooks are used to keep a users table updated, providing live updates on
user information; try changing one of your users' names in your Clerk dashboard
and watch up update live in the app.

## Running the App

Because this app uses authentication, it requires a bit of an additional setup.

Follow steps 1-4 of the instructions at https://docs.convex.dev/auth/clerk to set up Clerk with Convex.

As part of this process you will:

- create a Clerk account
- configure a JWT token
- change the domain property in convex/auth.config.js to the issuer URL from Cler
- change the publishableKey prop of the ClerkProvider component in main.tsx to the publishable key for your Clerk project.

Additionally save your Clerk credentials in the .env file:

```
VITE_CLERK_PUBLISHABLE_KEY="<your publishable key>"
```

Next create an endpoint in the Webhooks section of your Clerk instance dashboard.

Set the url to something like this (replace ardent-mammoth-732 with your own)
https://ardent-mammoth-732.convex.site/clerk-users-webhook

In Message Filtering, scroll down to select all user events.

Copy the Signing Secret (something like whsec_aB1cD2/eF3gH4...) into an
environment variable called CLERK_WEBHOOK_SECRET in the Convex dashboard
settings for your instance.

When a user signs up you should see logs from the HTTP handler
as well as a new row in the users table in the Convex dashboard.
