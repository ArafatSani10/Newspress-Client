export interface News {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  featuredImage?: string;
  videoUrl?: string;
  viewCount: number;
  isBreaking: boolean;
  isFeatured: boolean;
  createdAt: string;
  categoryId: string; // শুধু আইডি
  category?: {      // পুরো ক্যাটাগরি অবজেক্ট (এটি যোগ করুন)
    id: string;
    name: string;
  };
  author?: {
    name: string;
    image?: string;
  };
}

export interface NewsResponse {
    success: boolean;
    message: string;
    data?: News;
}

export interface NewsListResponse {
    success: boolean;
    data: News[];
    message?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const newsService = {
    create: async (data: Partial<News>): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await fetch(`${API_URL}/news/create-news`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include",
            });
            const result: NewsResponse = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || "Failed to create news");
            return { success: true, message: result.message };
        } catch (error) {
            return { success: false, message: error instanceof Error ? error.message : "Something went wrong" };
        }
    },

    getAll: async (): Promise<{ data: News[]; error: string | null }> => {
        try {
            const response = await fetch(`${API_URL}/news`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
            });
            const result: NewsListResponse = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || "Failed to fetch news");
            return { data: result.data, error: null };
        } catch (error) {
            return { data: [], error: error instanceof Error ? error.message : "An unexpected error occurred" };
        }
    },

    getBySlug: async (slug: string): Promise<{ data: News | null; error: string | null }> => {
        try {
            const response = await fetch(`${API_URL}/news/slug/${slug}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
            });
            const result: NewsResponse = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || "Failed to fetch news details");
            return { data: result.data || null, error: null };
        } catch (error) {
            return { data: null, error: error instanceof Error ? error.message : "An unexpected error occurred" };
        }
    },

    update: async (id: string, data: Partial<News>): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await fetch(`${API_URL}/news/update-news/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include",
            });
            const result: NewsResponse = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || "Failed to update news");
            return { success: true, message: result.message };
        } catch (error) {
            return { success: false, message: error instanceof Error ? error.message : "Something went wrong" };
        }
    },

    delete: async (id: string): Promise<{ success: boolean; message: string }> => {
        try {
            const response = await fetch(`${API_URL}/news/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });
            const result: NewsResponse = await response.json();
            if (!response.ok || !result.success) throw new Error(result.message || "Failed to delete news");
            return { success: true, message: result.message };
        } catch (error) {
            return { success: false, message: error instanceof Error ? error.message : "Something went wrong" };
        }
    }
};