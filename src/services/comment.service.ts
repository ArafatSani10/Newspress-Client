export interface CommentUser {
    id: string;
    name: string;
    image?: string;
    role: string;
}

export interface Comment {
    id: string;
    text: string;
    postId: string;
    userId: string;
    parentId: string | null;
    user: CommentUser;
    post?: {
        title: string;
        slug: string;
    };
    news?: { title: string };
    replies?: Comment[];
    createdAt: string;
    updatedAt: string;
}

interface ServiceResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

interface FetchResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    error: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const commentService = {
    create: async (data: { text: string; postId: string; parentId?: string }): Promise<ServiceResponse<Comment>> => {
        try {
            const response = await fetch(`${API_URL}/comments`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include",
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to create comment");
            return { success: true, data: result, message: "Comment created successfully" };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Something went wrong";
            return { success: false, message: errorMessage };
        }
    },

    getAll: async (): Promise<FetchResponse<Comment[]>> => {
        try {
            const response = await fetch(`${API_URL}/comments`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                cache: "no-store",
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to fetch comments");
            return {
                success: true,
                data: result.data || result,
                error: null
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            return { success: false, data: [], error: errorMessage };
        }
    },

    getByPostId: async (postId: string): Promise<FetchResponse<Comment[]>> => {
        try {
            const response = await fetch(`${API_URL}/comments/post/${postId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to fetch comments");
            return { success: true, data: result, error: null };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
            return { success: false, data: [], error: errorMessage };
        }
    },

    update: async (commentId: string, text: string): Promise<ServiceResponse<Comment>> => {
        try {
            const response = await fetch(`${API_URL}/comments/${commentId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
                credentials: "include",
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to update comment");
            return { success: true, message: "Comment updated successfully" };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Something went wrong";
            return { success: false, message: errorMessage };
        }
    },

    delete: async (commentId: string): Promise<ServiceResponse<null>> => {
        try {
            const response = await fetch(`${API_URL}/comments/${commentId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Failed to delete comment");
            return { success: true, message: result.message || "Comment deleted successfully" };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Something went wrong";
            return { success: false, message: errorMessage };
        }
    }
};