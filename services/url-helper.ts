// Helper function to ensure all API URLs use the same base URL
export const getApiUrl = (endpoint: string): string => {
    // Base API URL from environment or fallback
    const API_BASE_URL = "https://api.enmsgo.com/api"
    //const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
  
    // Remove any leading slashes from the endpoint
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint.substring(1) : endpoint
  
    // Return the full URL
    return `${API_BASE_URL}/${cleanEndpoint}`
  }
  
  