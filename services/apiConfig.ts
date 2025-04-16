// API configuration for the Energy Management SaaS Platform

// Base API URL - should be set from environment variables in production
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
//export const API_BASE_URL = "https://api.enmsgo.com/api"

// Helper function to get auth header
export const authHeader = () => {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Helper function for handling API responses
export const handleResponse = async (response) => {
  if (!response.ok) {
    let errorMessage = "An error occurred"

    try {
      const errorData = await response.json()
      errorMessage = errorData.message || errorData.details || errorMessage
    } catch (e) {
      // If the response is not JSON, use the status text
      errorMessage = response.statusText || errorMessage
    }

    throw new Error(errorMessage)
  }

  return await response.json()
}

