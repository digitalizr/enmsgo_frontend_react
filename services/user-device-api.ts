// User-Device API
import { authHeader } from "./apiConfig"

//const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
const API_BASE_URL = "https://api.enmsgo.com/api"
// Helper function for handling API responses with better error handling
const handleResponse = async (response) => {
  try {
    // Check if response is ok
    if (!response.ok) {
      // Try to parse error as JSON, but fallback to text if it's not valid JSON
      let errorMessage
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || `Error: ${response.status} ${response.statusText}`
      } catch (e) {
        // If JSON parsing fails, use text or status
        errorMessage = (await response.text()) || `Error: ${response.status} ${response.statusText}`
      }
      throw new Error(errorMessage)
    }

    // Try to parse response as JSON
    try {
      return await response.json()
    } catch (e) {
      // If JSON parsing fails, return empty data structure
      console.warn("Response is not valid JSON, returning empty data structure")
      return { data: [] }
    }
  } catch (error) {
    console.error("Error in handleResponse:", error)
    throw error
  }
}

export const userDeviceAPI = {
  // Get all edge gateways assigned to a user
  getUserEdgeGateways: async (userId) => {
    try {
      if (!userId) {
        console.warn("No userId provided to getUserEdgeGateways")
        return { data: [] }
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/edge-gateways`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      return await handleResponse(response)
    } catch (error) {
      console.error("Error in userDeviceAPI.getUserEdgeGateways:", error)
      // Return empty data instead of throwing to prevent UI errors
      return { data: [] }
    }
  },

  // Get all smart meters assigned to a user
  getUserSmartMeters: async (userId) => {
    try {
      if (!userId) {
        console.warn("No userId provided to getUserSmartMeters")
        return { data: [] }
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/smart-meters`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      return await handleResponse(response)
    } catch (error) {
      console.error("Error in userDeviceAPI.getUserSmartMeters:", error)
      // Return empty data instead of throwing to prevent UI errors
      return { data: [] }
    }
  },

  // Assign edge gateway to a user
  assignEdgeGatewayToUser: async (userId, data) => {
    try {
      if (!userId) {
        throw new Error("User ID is required")
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/edge-gateways`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      return await handleResponse(response)
    } catch (error) {
      console.error("Error in userDeviceAPI.assignEdgeGatewayToUser:", error)
      throw error
    }
  },

  // Assign smart meter to a user
  assignSmartMeterToUser: async (userId, data) => {
    try {
      if (!userId) {
        throw new Error("User ID is required")
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/smart-meters`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      return await handleResponse(response)
    } catch (error) {
      console.error("Error in userDeviceAPI.assignSmartMeterToUser:", error)
      throw error
    }
  },

  // Remove edge gateway assignment from a user
  removeEdgeGatewayFromUser: async (userId, gatewayId) => {
    try {
      if (!userId || !gatewayId) {
        throw new Error("User ID and Gateway ID are required")
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/edge-gateways/${gatewayId}`, {
        method: "DELETE",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      return await handleResponse(response)
    } catch (error) {
      console.error("Error in userDeviceAPI.removeEdgeGatewayFromUser:", error)
      throw error
    }
  },

  // Remove smart meter assignment from a user
  removeSmartMeterFromUser: async (userId, meterId) => {
    try {
      if (!userId || !meterId) {
        throw new Error("User ID and Meter ID are required")
      }

      const response = await fetch(`${API_BASE_URL}/users/${userId}/smart-meters/${meterId}`, {
        method: "DELETE",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      return await handleResponse(response)
    } catch (error) {
      console.error("Error in userDeviceAPI.removeSmartMeterFromUser:", error)
      throw error
    }
  },
}
