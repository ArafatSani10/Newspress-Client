export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const categoryService = {
  create: async (name: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/categories/create-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to create category");
      }

      return { success: true, message: result.message };
    } catch (error: any) {
      return { success: false, message: error.message || "Something went wrong" };
    }
  },

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
  },

  update: async (id: string, data: { name: string }): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/categories/update-category/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to update category");
      }

      return { success: true, message: result.message };
    } catch (error: any) {
      return { success: false, message: error.message || "Something went wrong" };
    }
  },

  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`${API_URL}/categories/delete-category/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to delete category");
      }

      return { success: true, message: result.message };
    } catch (error: any) {
      return { success: false, message: error.message || "Something went wrong" };
    }
  }
};