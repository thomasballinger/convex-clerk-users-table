import { ReactNode, StrictMode } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import LoginPage from "./LoginPage";
import {
  ConvexReactClient,
  Authenticated,
  Unauthenticated,
  useQuery,
} from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { api } from "../convex/_generated/api";
import SigningUpPage from "./SigningUp";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

function WaitForClerkUserData(props: {
  children: JSX.Element;
  loading: JSX.Element;
}) {
  const [loginStatus, user] = useQuery(api.users.userLoginStatus) || [
    "Loading",
    null,
  ];

  // used for the side effect of keeping the current user loaded
  useQuery(api.users.currentUser);
  if (loginStatus !== "Logged In") {
    return props.loading; // waiting for user row
  }
  return props.children;
}

ReactDOM.render(
  <StrictMode>
    <ClerkProvider
      // Replace this with your Clerk Publishable Key
      // or with `{import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}`
      // and configure VITE_CLERK_PUBLISHABLE_KEY in your .env.local
      publishableKey="pk_test_c3Ryb25nLWhvcm5ldC03LmNsZXJrLmFjY291bnRzLmRldiQ"
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {/* Authenticated is for having a JWT token from Clerk */}
        <Authenticated>
          {/* WaitForClerkUserData is for Clerk data from a webhook */}
          <WaitForClerkUserData loading={<SigningUpPage />}>
            <App />
          </WaitForClerkUserData>
        </Authenticated>
        <Unauthenticated>
          <LoginPage />
        </Unauthenticated>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>,
  document.getElementById("root")
);
