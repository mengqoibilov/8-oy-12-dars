import axios from "axios";

export const apiCall = async (
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  data?: any
) => {
  try {
    const response = await axios({
      method,
      url: endpoint,
      data,
      headers: { "Content-Type": "application/json" },
    });

    return response.data;
  } catch (error: any) {
    console.error("API Error:", error.response?.data || error.message);
    throw error;
  }
};


