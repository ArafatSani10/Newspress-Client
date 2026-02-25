import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_BASE_URL = "https://newspress-server-beta.vercel.app/api/auth";

export const userService = {
  getSession: async function () {
    try {
      if (typeof window === "undefined") {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const cookieHeader = cookieStore
          .getAll()
          .map((c) => `${c.name}=${c.value}`)
          .join("; ");

        const res = await fetch(`${AUTH_BASE_URL}/get-session`, {
          headers: {
            cookie: cookieHeader,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });

        if (!res.ok) {
          return { data: null, error: { message: "Session is missing.." } };
        }

        const session = await res.json();

        if (!session || !session.user) {
          return { data: null, error: { message: "Session is missing.." } };
        }

        return { data: session, error: null };
      }

      // Client-side: use authClient as normal
      const { data: session, error } = await authClient.getSession();

      if (error || !session) {
        return {
          data: null,
          error: { message: error?.message || "Session is missing.." },
        };
      }
      return { data: session, error: null };
    } catch (err) {
      console.error("Session error:", err);
      return { data: null, error: { message: "Something Went Wrong" } };
    }
  },

  register: async function (userData: {
    email: string;
    name: string;
    password: string;
    image?: string;
  }) {
    return await authClient.signUp.email({
      email: userData.email,
      password: userData.password,
      name: userData.name,
      callbackURL: "/login",
    });
  },

  login: async function (credentials: { email: string; password: string }) {
    return await authClient.signIn.email({
      email: credentials.email,
      password: credentials.password,
      callbackURL: "/",
    });
  },

  logout: async function () {
    return await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          window.location.href = "/login";
        },
      },
    });
  },

  getAll: async function () {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const result = await response.json();
      return result;
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },
  updateRole: async function (userId: string, role: string) {
    try {
      const response = await fetch(`${API_URL}/users/update-role/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
        credentials: "include",
      });
      const result = await response.json();
      return result;
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  },
};