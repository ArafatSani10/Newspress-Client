import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://newspress-server-beta.vercel.app/api/auth",
  fetchOptions: {
    credentials: "include",
  },
});

export const { useSession, signIn, signOut, signUp } = authClient;
