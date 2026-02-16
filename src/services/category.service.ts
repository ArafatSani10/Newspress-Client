export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const categoryService = {
  getAll: async (): Promise<{ data: Category[]; error: string | null }> => {
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to fetch categories");
      }

      return { 
        data: result.data, 
        error: null 
      };
    } catch (error: any) {
      return { 
        data: [], 
        error: error.message || "An unexpected error occurred" 
      };
    }
  }
};