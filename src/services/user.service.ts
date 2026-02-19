import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const userService = {
    getSession: async function () {
        try {
            let fetchOptions = {};
            if (typeof window === "undefined") {
                const { headers } = await import("next/headers");
                fetchOptions = { headers: await headers() };
            }

            const { data: session, error } = await authClient.getSession({ fetchOptions });

            if (error || !session) {
                return { data: null, error: { message: error?.message || "Session is missing.." } };
            }
            return { data: session, error: null };
        } catch (err) {
            console.error("Session error:", err);
            return { data: null, error: { message: "Something Went Wrong" } };
        }
    },

    register: async function (userData: { email: string; name: string; password: string }) {
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
    }
};