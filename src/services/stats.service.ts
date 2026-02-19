const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const statsService = {
  getSummary: async () => {
    try {
      const response = await fetch(`${API_URL}/stats/summary`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", 
        cache: "no-store",
      });

      const result = await response.json();
      return result;
    } catch (error: any) {
      return { success: false, data: null, message: error.message };
    }
  }
};