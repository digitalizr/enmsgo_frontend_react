// API service for the Energy Management SaaS Platform
// This file serves as the central point for all API calls to the backend

// Base API URL - should be set from environment variables in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Helper function for handling API responses
const handleResponse = async (response) => {
  try {
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()

      if (!response.ok) {
        console.error("API Error Response:", data)
        const error = (data && (data.message || data.error)) || response.statusText
        return Promise.reject(error)
      }

      return data
    } else {
      // Handle non-JSON responses
      const text = await response.text()
      if (!response.ok) {
        console.error("API Error Response (non-JSON):", text)
        return Promise.reject(text || response.statusText)
      }

      return { message: text }
    }
  } catch (error) {
    console.error("Error parsing API response:", error)
    return Promise.reject("Failed to parse API response")
  }
}

// Helper function to get auth header
const authHeader = () => {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Helper function for making API requests with error handling
const apiRequest = async (endpoint, method = "GET", body = null) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    const headers = {
      ...authHeader(),
      "Content-Type": "application/json",
    }

    const options = {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    }

    console.log(`Making API request to ${url} with options:`, options)

    const response = await fetch(url, options)
    return await handleResponse(response)
  } catch (error) {
    console.error(`Error in apiRequest for ${endpoint}:`, error)
    throw error
  }
}

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw errorData.message || "Login failed"
      }

      const data = await response.json()

      console.log("API login response:", data)

      // If user doesn't need to change password, store the token and user in localStorage
      if (data.token && !data.user.requirePasswordChange) {
        localStorage.setItem("token", data.token)
        localStorage.setItem("user", JSON.stringify(data.user))
      }

      return data
    } catch (error) {
      console.error("API login error:", error)
      throw error
    }
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
    return handleResponse(response)
  },

  logout: async () => {
    // Client-side logout - clear localStorage
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("temp_token")
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  },

  getToken: () => {
    return localStorage.getItem("token")
  },

  // Validate password reset token (for email-based resets)
  validatePasswordToken: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
    return handleResponse(response)
  },

  // Reset password with token (for email-based resets)
  resetPassword: async (token, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    })
    return handleResponse(response)
  },

  // Change password for first-time login
  changePasswordFirstTime: async (userId, currentPassword, newPassword, token) => {
    const response = await fetch(`${API_BASE_URL}/auth/change-password-first-time`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId,
        currentPassword,
        newPassword,
      }),
    })
    return handleResponse(response)
  },

  // Request password reset (for forgotten passwords)
  requestPasswordReset: async (email) => {
    const response = await fetch(`${API_BASE_URL}/auth/request-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    return handleResponse(response)
  },
}

// Smart Meters API
export const smartMetersAPI = {
  getAll: async (params = {}) => {
    try {
      // Filter out undefined or empty parameters
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== ""),
      )

      const queryString = new URLSearchParams(filteredParams).toString()
      const response = await fetch(`${API_BASE_URL}/devices/smart-meters?${queryString}`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response text:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          console.error("Error parsing error response:", e)
          throw new Error(`Failed to fetch smart meters: ${errorText}`)
        }

        console.error("Server error response:", errorData)
        throw new Error(errorData.message || errorData.details || "Failed to fetch smart meters")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in smartMetersAPI.getAll:", error)
      throw error
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/smart-meters/${id}`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response text:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          console.error("Error parsing error response:", e)
          throw new Error(`Failed to fetch smart meter: ${errorText}`)
        }

        console.error("Server error response:", errorData)
        throw new Error(errorData.message || errorData.details || "Failed to fetch smart meter")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in smartMetersAPI.getById:", error)
      throw error
    }
  },

  create: async (data) => {
    try {
      console.log("Creating smart meter with data:", data)
      const response = await fetch(`${API_BASE_URL}/devices/smart-meters`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response text:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          console.error("Error parsing error response:", e)
          throw new Error(`Failed to create smart meter: ${errorText}`)
        }

        console.error("Server error response:", errorData)
        throw new Error(errorData.message || errorData.details || "Failed to create smart meter")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in smartMetersAPI.create:", error)
      throw error
    }
  },

  update: async (id, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/smart-meters/${id}`, {
        method: "PUT",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response text:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          console.error("Error parsing error response:", e)
          throw new Error(`Failed to update smart meter: ${errorText}`)
        }

        console.error("Server error response:", errorData)
        throw new Error(errorData.message || errorData.details || "Failed to update smart meter")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in smartMetersAPI.update:", error)
      throw error
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/smart-meters/${id}`, {
        method: "DELETE",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response text:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          console.error("Error parsing error response:", e)
          throw new Error(`Failed to delete smart meter: ${errorText}`)
        }

        console.error("Server error response:", errorData)
        throw new Error(errorData.message || errorData.details || "Failed to delete smart meter")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in smartMetersAPI.delete:", error)
      throw error
    }
  },
}

// Edge Gateways API
export const edgeGatewaysAPI = {
  getAll: async (params = {}) => {
    try {
      // Filter out undefined or empty parameters
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([_, value]) => value !== undefined && value !== ""),
      )

      const queryString = new URLSearchParams(filteredParams).toString()
      const response = await fetch(`${API_BASE_URL}/devices/edge-gateways?${queryString}`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      console.log("Fetching edge gateways with params:", filteredParams) // Debugging log

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData) // Debugging log
        throw new Error(errorData.message || "Failed to fetch edge gateways")
      }

      const data = await response.json()
      console.log("Edge Gateways API Response:", data) // Debugging log
      return data
    } catch (error) {
      console.error("Error in edgeGatewaysAPI.getAll:", error) // Debugging log
      throw error
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${id}`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      console.log(`Fetching edge gateway with ID: ${id}`) // Debugging log

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData) // Debugging log
        throw new Error(errorData.message || "Failed to fetch edge gateway")
      }

      const data = await response.json()
      console.log("Edge Gateway API Response:", data) // Debugging log
      return data
    } catch (error) {
      console.error("Error in edgeGatewaysAPI.getById:", error) // Debugging log
      throw error
    }
  },

  create: async (data) => {
    try {
      console.log("Creating edge gateway with data:", data) // Debugging log

      const response = await fetch(`${API_BASE_URL}/devices/edge-gateways`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData) // Debugging log
        throw new Error(errorData.message || "Failed to create edge gateway")
      }

      const responseData = await response.json()
      console.log("Edge Gateway Created:", responseData) // Debugging log
      return responseData
    } catch (error) {
      console.error("Error in edgeGatewaysAPI.create:", error) // Debugging log
      throw error
    }
  },

  update: async (id, data) => {
    try {
      console.log(`Updating edge gateway with ID: ${id} and data:`, data) // Debugging log

      // Ensure status is not null
      const dataToSend = {
        ...data,
        status: data.status || "available",
      }

      const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${id}`, {
        method: "PUT",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(dataToSend),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response text:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          console.error("Error parsing error response:", e)
          throw new Error(`Failed to update edge gateway: ${errorText}`)
        }

        console.error("Server error response:", errorData)
        throw new Error(errorData.message || errorData.details || "Failed to update edge gateway")
      }

      const responseData = await response.json()
      console.log("Edge Gateway Updated:", responseData) // Debugging log
      return responseData
    } catch (error) {
      console.error("Error in edgeGatewaysAPI.update:", error) // Debugging log
      throw error
    }
  },

  delete: async (id) => {
    try {
      console.log(`Deleting edge gateway with ID: ${id}`) // Debugging log

      const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${id}`, {
        method: "DELETE",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData) // Debugging log
        throw new Error(errorData.message || "Failed to delete edge gateway")
      }

      console.log("Edge Gateway Deleted Successfully") // Debugging log
      return { success: true }
    } catch (error) {
      console.error("Error in edgeGatewaysAPI.delete:", error) // Debugging log
      throw error
    }
  },

  getIpAddresses: async (gatewayId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${gatewayId}/ip-addresses`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to fetch IP addresses")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in edgeGatewaysAPI.getIpAddresses:", error)
      throw error
    }
  },

  addIpAddress: async (gatewayId, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${gatewayId}/ip-addresses`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to add IP address")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in edgeGatewaysAPI.addIpAddress:", error)
      throw error
    }
  },

  removeIpAddress: async (gatewayId, ipId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${gatewayId}/ip-addresses/${ipId}`, {
        method: "DELETE",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to remove IP address")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in edgeGatewaysAPI.removeIpAddress:", error)
      throw error
    }
  },

  getSpecifications: async (gatewayId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${gatewayId}/specifications`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to fetch specifications")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in edgeGatewaysAPI.getSpecifications:", error)
      throw error
    }
  },

  updateSpecifications: async (gatewayId, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${gatewayId}/specifications`, {
        method: "PUT",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to update specifications")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in edgeGatewaysAPI.updateSpecifications:", error)
      throw error
    }
  },

  getConnectionDetails: async (gatewayId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${gatewayId}/connection-details`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to fetch connection details")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in edgeGatewaysAPI.getConnectionDetails:", error)
      throw error
    }
  },

  updateConnectionDetails: async (gatewayId, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${gatewayId}/connection-details`, {
        method: "PUT",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to update connection details")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in edgeGatewaysAPI.updateConnectionDetails:", error)
      throw error
    }
  },
}

// Companies API
export const companiesAPI = {
  getAll: async (params = {}) => {
    try {
      console.log("Fetching all companies")
      const queryString = new URLSearchParams(params).toString()
      const response = await fetch(`${API_BASE_URL}/companies?${queryString}`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to fetch companies")
      }

      const data = await response.json()
      console.log("Raw companies API response:", data)

      // Return directly if it's an array, otherwise extract data property
      return data
    } catch (error) {
      console.error("Error in companiesAPI.getAll:", error)
      throw error
    }
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  create: async (data) => {
    try {
      const token = authAPI.getToken()
      if (!token) {
        throw new Error("Authentication required")
      }

      console.log("Creating company with token:", token.substring(0, 10) + "...") // Log partial token for debugging
      console.log("Company data being sent:", data) // Log the data being sent

      // Ensure required fields are present
      if (!data.name || !data.contact_name || !data.contact_email) {
        throw new Error("Company name, contact name, and contact email are required")
      }

      const response = await fetch(`${API_BASE_URL}/companies`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData) // Log the full error response
        throw new Error(errorData.message || "Failed to create company")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in companiesAPI.create:", error)
      throw error
    }
  },

  update: async (id, data) => {
    try {
      const token = authAPI.getToken()
      if (!token) {
        throw new Error("Authentication required")
      }

      console.log("Updating company with ID:", id)
      console.log("Company data being sent:", data)

      const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to update company")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in companiesAPI.update:", error)
      throw error
    }
  },

  delete: async (id) => {
    try {
      const token = authAPI.getToken()
      if (!token) {
        throw new Error("Authentication required")
      }

      console.log("Deleting company with ID:", id)

      const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to delete company")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in companiesAPI.delete:", error)
      throw error
    }
  },

  getFacilities: async (companyId) => {
    try {
      console.log(`Fetching facilities for company ID: ${companyId}`)
      const response = await fetch(`${API_BASE_URL}/companies/${companyId}/facilities`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      // Handle rate limiting
      if (response.status === 429) {
        console.warn("Rate limit exceeded when fetching facilities. Please try again later.")
        return { data: [] }
      }

      if (!response.ok) {
        // Try to parse as JSON, but handle case where it's not JSON
        let errorMessage = "Failed to fetch facilities"
        try {
          const errorData = await response.json()
          console.error("Server error response:", errorData)
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          console.error("Error parsing error response:", e)
          const errorText = await response.text()
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      // Try to parse the response as JSON
      let data
      try {
        data = await response.json()
        console.log("Raw facilities API response:", data)
      } catch (e) {
        console.error("Error parsing JSON response:", e)
        return { data: [] }
      }

      // Normalize the response format
      if (Array.isArray(data)) {
        return { data }
      } else if (data && data.data) {
        return data
      } else {
        console.error("Unexpected response format:", data)
        return { data: [] }
      }
    } catch (error) {
      console.error("Error in companiesAPI.getFacilities:", error)
      // Return empty data instead of throwing to prevent UI errors
      return { data: [] }
    }
  },

  createFacility: async (companyId, data) => {
    try {
      console.log("Creating facility with data:", data)
      console.log("For company ID:", companyId)

      const token = authAPI.getToken()
      if (!token) {
        throw new Error("Authentication required")
      }

      // Validate required fields
      if (!data.name) {
        throw new Error("Facility name is required")
      }

      // Make sure we're using the correct API URL
      const url = `${API_BASE_URL}/companies/${companyId}/facilities`
      console.log("API URL:", url)

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response:", errorText)

        // Try to parse as JSON, but handle case where it's not JSON
        let errorMessage = "Failed to create facility"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          console.error("Error parsing error response:", e)
          errorMessage = errorText || errorMessage
        }

        throw new Error(errorMessage)
      }

      const responseData = await response.json()
      return responseData
    } catch (error) {
      console.error("Error in companiesAPI.createFacility:", error)
      throw error
    }
  },

  createDepartment: async (facilityId, data) => {
    try {
      console.log("Creating department with data:", data)
      console.log("For facility ID:", facilityId)

      const token = authAPI.getToken()
      if (!token) {
        throw new Error("Authentication required")
      }

      // Validate required fields
      if (!data.name) {
        throw new Error("Department name is required")
      }

      const response = await fetch(`${API_BASE_URL}/facilities/${facilityId}/departments`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response:", errorText)

        // Try to parse as JSON, but handle case where it's not JSON
        let errorMessage = "Failed to create department"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          console.error("Error parsing error response:", e)
          errorMessage = errorText || errorMessage
        }

        throw new Error(errorMessage)
      }

      const responseData = await response.json()
      return responseData
    } catch (error) {
      console.error("Error in companiesAPI.createDepartment:", error)
      throw error
    }
  },

  updateFacility: async (companyId, facilityId, data) => {
    try {
      console.log("Updating facility with data:", data)
      console.log("For company ID:", companyId)
      console.log("Facility ID:", facilityId)

      const token = authAPI.getToken()
      if (!token) {
        throw new Error("Authentication required")
      }

      // Validate required fields
      if (!data.name) {
        throw new Error("Facility name is required")
      }

      const response = await fetch(`${API_BASE_URL}/companies/${companyId}/facilities/${facilityId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response:", errorText)

        // Try to parse as JSON, but handle case where it's not JSON
        let errorMessage = "Failed to update facility"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          console.error("Error parsing error response:", e)
          errorMessage = errorText || errorMessage
        }

        throw new Error(errorMessage)
      }

      const responseData = await response.json()
      return responseData
    } catch (error) {
      console.error("Error in companiesAPI.updateFacility:", error)
      throw error
    }
  },

  deleteFacility: async (companyId, facilityId) => {
    try {
      console.log("Deleting facility with ID:", facilityId)
      console.log("For company ID:", companyId)

      const token = authAPI.getToken()
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`${API_BASE_URL}/companies/${companyId}/facilities/${facilityId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response:", errorText)

        // Try to parse as JSON, but handle case where it's not JSON
        let errorMessage = "Failed to delete facility"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          console.error("Error parsing error response:", e)
          errorMessage = errorText || errorMessage
        }

        throw new Error(errorMessage)
      }

      return { success: true }
    } catch (error) {
      console.error("Error in companiesAPI.deleteFacility:", error)
      throw error
    }
  },

  updateDepartment: async (facilityId, departmentId, data) => {
    try {
      console.log("Updating department with data:", data)
      console.log("For facility ID:", facilityId)
      console.log("Department ID:", departmentId)

      const token = authAPI.getToken()
      if (!token) {
        throw new Error("Authentication required")
      }

      // Validate required fields
      if (!data.name) {
        throw new Error("Department name is required")
      }

      const response = await fetch(`${API_BASE_URL}/facilities/${facilityId}/departments/${departmentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response:", errorText)

        // Try to parse as JSON, but handle case where it's not JSON
        let errorMessage = "Failed to update department"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          console.error("Error parsing error response:", e)
          errorMessage = errorText || errorMessage
        }

        throw new Error(errorMessage)
      }

      const responseData = await response.json()
      return responseData
    } catch (error) {
      console.error("Error in companiesAPI.updateDepartment:", error)
      throw error
    }
  },

  deleteDepartment: async (facilityId, departmentId) => {
    try {
      console.log("Deleting department with ID:", departmentId)
      console.log("For facility ID:", facilityId)

      const token = authAPI.getToken()
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`${API_BASE_URL}/facilities/${facilityId}/departments/${departmentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response:", errorText)

        // Try to parse as JSON, but handle case where it's not JSON
        let errorMessage = "Failed to delete department"
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          console.error("Error parsing error response:", e)
          errorMessage = errorText || errorMessage
        }

        throw new Error(errorMessage)
      }

      return { success: true }
    } catch (error) {
      console.error("Error in companiesAPI.deleteDepartment:", error)
      throw error
    }
  },

  getDepartments: async (facilityId) => {
    try {
      console.log(`Fetching departments for facility ID: ${facilityId}`)
      const response = await fetch(`${API_BASE_URL}/facilities/${facilityId}/departments`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      // Handle rate limiting
      if (response.status === 429) {
        console.warn("Rate limit exceeded when fetching departments. Please try again later.")
        return { data: [] }
      }

      if (!response.ok) {
        // Try to parse as JSON, but handle case where it's not JSON
        let errorMessage = "Failed to fetch departments"
        try {
          const errorData = await response.json()
          console.error("Server error response:", errorData)
          errorMessage = errorData.message || errorMessage
        } catch (e) {
          console.error("Error parsing error response:", e)
          const errorText = await response.text()
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      // Try to parse the response as JSON
      let data
      try {
        data = await response.json()
        console.log("Raw departments API response:", data)
      } catch (e) {
        console.error("Error parsing JSON response:", e)
        return { data: [] }
      }

      // Normalize the response format
      if (Array.isArray(data)) {
        return { data }
      } else if (data && data.data) {
        return data
      } else {
        console.error("Unexpected response format:", data)
        return { data: [] }
      }
    } catch (error) {
      console.error("Error in companiesAPI.getDepartments:", error)
      // Return empty data instead of throwing to prevent UI errors
      return { data: [] }
    }
  },
}

// Device Models API
export const deviceModelsAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await fetch(`${API_BASE_URL}/device-models?${queryString}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/device-models/${id}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/device-models`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/device-models/${id}`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/device-models/${id}`, {
      method: "DELETE",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
}

// Users API
export const usersAPI = {
  getAll: async () => {
    try {
      console.log("Fetching all users")
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || errorData.error || "Failed to fetch users")
      }

      const data = await response.json()
      console.log("Users API response:", data)
      return data
    } catch (error) {
      console.error("Error in usersAPI.getAll:", error)
      throw error
    }
  },

  getRoles: async () => {
    try {
      console.log("Fetching roles")
      const response = await fetch(`${API_BASE_URL}/roles`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || errorData.error || "Failed to fetch roles")
      }

      const data = await response.json()
      console.log("Roles API response:", data)
      return data
    } catch (error) {
      console.error("Error in usersAPI.getRoles:", error)
      throw error
    }
  },

  getById: async (id) => {
    try {
      console.log(`Fetching user with id: ${id}`)
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || errorData.error || "Failed to fetch user")
      }

      const data = await response.json()
      console.log("User API response:", data)
      return data
    } catch (error) {
      console.error("Error in usersAPI.getById:", error)
      throw error
    }
  },

  create: async (data) => {
    try {
      console.log("Creating user with data:", data)
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response text:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          console.error("Error parsing error response:", e)
          throw new Error(`Failed to create user: ${errorText}`)
        }

        throw new Error(errorData.message || errorData.error || "Failed to create user")
      }

      const result = await response.json()
      console.log("User created:", result)
      return result
    } catch (error) {
      console.error("Error in usersAPI.create:", error)
      throw error
    }
  },

  update: async (id, data) => {
    try {
      console.log(`Updating user with id: ${id}`)
      console.log("Update data:", data)

      const token = authAPI.getToken()
      if (!token) {
        throw new Error("Authentication required")
      }

      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response text:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          console.error("Error parsing error response:", e)
          throw new Error(`Failed to update user: ${errorText}`)
        }

        throw new Error(errorData.message || errorData.error || "Failed to update user")
      }

      const result = await response.json()
      console.log("User updated:", result)
      return result
    } catch (error) {
      console.error("Error in usersAPI.update:", error)
      throw error
    }
  },

  delete: async (id) => {
    try {
      console.log(`Deleting user with id: ${id}`)
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || errorData.error || "Failed to delete user")
      }

      const result = await response.json()
      console.log("User deleted:", result)
      return result
    } catch (error) {
      console.error("Error in usersAPI.delete:", error)
      throw error
    }
  },

  resetPassword: async (id) => {
    try {
      console.log(`Resetting password for user with id: ${id}`)
      const response = await fetch(`${API_BASE_URL}/users/${id}/reset-password`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || errorData.error || "Failed to reset password")
      }

      const result = await response.json()
      console.log("Password reset:", result)
      return result
    } catch (error) {
      console.error("Error in usersAPI.resetPassword:", error)
      throw error
    }
  },

  manualResetPassword: async (id, newPassword) => {
    try {
      console.log(`Manually resetting password for user with id: ${id}`)
      const response = await fetch(`${API_BASE_URL}/users/${id}/reset-password`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || errorData.error || "Failed to reset password")
      }

      const result = await response.json()
      console.log("Password manually reset:", result)
      return result
    } catch (error) {
      console.error("Error in usersAPI.manualResetPassword:", error)
      throw error
    }
  },

  // User-Company relationship methods
  createUserCompanyRelationship: async (data) => {
    try {
      console.log("Creating user-company relationship with data:", data)
      const response = await fetch(`${API_BASE_URL}/user-companies`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response text:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          console.error("Error parsing error response:", e)
          throw new Error(`Failed to create user-company relationship: ${errorText}`)
        }

        throw new Error(errorData.message || errorData.error || "Failed to create user-company relationship")
      }

      const result = await response.json()
      console.log("User-company relationship created:", result)
      return result
    } catch (error) {
      console.error("Error in usersAPI.createUserCompanyRelationship:", error)
      throw error
    }
  },

  getUserCompanyRelationships: async (userId) => {
    try {
      console.log(`Fetching user-company relationships for user id: ${userId}`)
      const response = await fetch(`${API_BASE_URL}/user-companies/${userId}`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || errorData.error || "Failed to fetch user-company relationships")
      }

      const result = await response.json()
      console.log("User-company relationships:", result)
      return result
    } catch (error) {
      console.error("Error in usersAPI.getUserCompanyRelationships:", error)
      throw error
    }
  },

  deleteUserCompanyRelationships: async (userId) => {
    try {
      console.log(`Deleting user-company relationships for user id: ${userId}`)
      const response = await fetch(`${API_BASE_URL}/user-companies/${userId}`, {
        method: "DELETE",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || errorData.error || "Failed to delete user-company relationships")
      }

      console.log("User-company relationships deleted")
      return { success: true }
    } catch (error) {
      console.error("Error in usersAPI.deleteUserCompanyRelationships:", error)
      throw error
    }
  },
}

// Assignments API
export const assignmentsAPI = {
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/assignments`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to fetch assignments")
      }

      const data = await response.json()
      // Ensure we return a consistent structure
      return { data: Array.isArray(data) ? data : data.data || [] }
    } catch (error) {
      console.error("Error in assignmentsAPI.getAll:", error)
      throw error
    }
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/assignments/${id}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/assignments`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/assignments/${id}`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/assignments/${id}`, {
      method: "DELETE",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  assignEdgeGateway: async (userId, gatewayId) => {
    try {
      console.log("Assigning edge gateway:", { userId, gatewayId })

      // First, get the user's company information
      const userResponse = await fetch(`${API_BASE_URL}/user-companies/${userId}`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!userResponse.ok) {
        const errorData = await userResponse.json()
        console.error("Error fetching user company data:", errorData)
        throw new Error(errorData.message || "Failed to get user company information")
      }

      const userCompanyData = await userResponse.json()
      console.log("User company data:", userCompanyData)

      if (!userCompanyData.data || userCompanyData.data.length === 0) {
        throw new Error("User is not associated with any company")
      }

      // Use the primary company or the first one in the list
      const primaryCompany = userCompanyData.data.find((rel) => rel.is_primary) || userCompanyData.data[0]
      console.log("Selected company for assignment:", primaryCompany)

      if (!primaryCompany.company || !primaryCompany.company.id) {
        throw new Error("Invalid company information")
      }

      // Now create the assignment with company_id instead of user_id
      const response = await fetch(`${API_BASE_URL}/assignments/assign-edge-gateway`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: primaryCompany.company.id,
          facilityId: primaryCompany.facility?.id || null,
          departmentId: primaryCompany.department?.id || null,
          gatewayId,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Error response from assign-edge-gateway:", errorData)
        throw new Error(errorData.message || "Failed to assign edge gateway")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in assignmentsAPI.assignEdgeGateway:", error)
      throw error
    }
  },
  assignSmartMeters: async (gatewayId, meterIds) => {
    try {
      console.log("Assigning smart meters:", { gatewayId, meterIds })
      const response = await fetch(`${API_BASE_URL}/assignments/assign-smart-meters`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ gatewayId, meterIds }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to assign smart meters")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in assignmentsAPI.assignSmartMeters:", error)
      throw error
    }
  },
  removeEdgeGateway: async (userId, gatewayId) => {
    try {
      console.log("Removing edge gateway:", { userId, gatewayId })

      // Make sure both parameters are provided
      if (!userId || !gatewayId) {
        throw new Error("User ID and Gateway ID are required")
      }

      const response = await fetch(`${API_BASE_URL}/assignments/remove-edge-gateway`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          gatewayId,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server error response text:", errorText)

        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch (e) {
          console.error("Error parsing error response:", e)
          throw new Error(`Failed to remove edge gateway: ${errorText}`)
        }

        throw new Error(errorData.message || "Failed to remove edge gateway")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in assignmentsAPI.removeEdgeGateway:", error)
      throw error
    }
  },
  removeSmartMeter: async (gatewayId, meterId) => {
    try {
      console.log("Removing smart meter:", { gatewayId, meterId })
      const response = await fetch(`${API_BASE_URL}/assignments/remove-smart-meter`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ gatewayId, meterId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to remove smart meter")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in assignmentsAPI.removeSmartMeter:", error)
      throw error
    }
  },
}

// Energy Data API
export const energyDataAPI = {
  getConsumption: async (meterId, startTime, endTime, interval) => {
    const params = new URLSearchParams({
      meterId,
      startTime,
      endTime,
      ...(interval && { interval }),
    })

    const response = await fetch(`${API_BASE_URL}/energy/consumption?${params}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  getAggregatedData: async (companyId, startTime, endTime, aggregationType, facilityId) => {
    const params = new URLSearchParams({
      companyId,
      startTime,
      endTime,
      aggregationType,
      ...(facilityId && { facilityId }),
    })

    const response = await fetch(`${API_BASE_URL}/energy/aggregated?${params}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  getCostAnalysis: async (companyId, startTime, endTime, facilityId) => {
    const params = new URLSearchParams({
      companyId,
      startTime,
      endTime,
      ...(facilityId && { facilityId }),
    })

    const response = await fetch(`${API_BASE_URL}/energy/cost-analysis?${params}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
}

// Analytics API
export const analyticsAPI = {
  getEnergyConsumption: async (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value)
    })

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ""
    return apiRequest(`/analytics/energy-consumption${query}`)
  },

  getCostAnalysis: async (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value)
    })

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ""
    return apiRequest(`/analytics/cost-analysis${query}`)
  },

  getDeviceStatistics: async () => {
    return apiRequest("/analytics/device-statistics")
  },

  getCompanyStatistics: async () => {
    return apiRequest("/analytics/company-statistics")
  },

  getUsageByIndustry: async () => {
    return apiRequest("/analytics/usage-by-industry")
  },

  getGrowthTrends: async (params = {}) => {
    const queryParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) queryParams.append(key, value)
    })

    const query = queryParams.toString() ? `?${queryParams.toString()}` : ""
    return apiRequest(`/analytics/growth-trends${query}`)
  },
}

// Billing API
export const billingAPI = {
  getInvoices: async () => {
    const response = await fetch(`${API_BASE_URL}/billing/invoices`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  getInvoiceById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/billing/invoices/${id}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  createInvoice: async (data) => {
    const response = await fetch(`${API_BASE_URL}/billing/invoices`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  updateInvoice: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/billing/invoices/${id}`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  deleteInvoice: async (id) => {
    const response = await fetch(`${API_BASE_URL}/billing/invoices/${id}`, {
      method: "DELETE",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
}

// Manufacturers API
export const manufacturersAPI = {
  getAll: async () => {
    try {
      console.log("Fetching all manufacturers")
      const response = await fetch(`${API_BASE_URL}/manufacturers`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to fetch manufacturers")
      }

      const data = await response.json()
      console.log("Raw manufacturers API response:", data)

      // Return directly if it's an array, otherwise extract data property
      if (Array.isArray(data)) {
        return data
      } else if (data && data.data) {
        return data.data
      } else {
        console.error("Unexpected response format:", data)
        return []
      }
    } catch (error) {
      console.error("Error in manufacturersAPI.getAll:", error)
      throw error
    }
  },

  // Update the getModels function to handle different response formats
  getModels: async (manufacturerId) => {
    try {
      console.log(`Fetching models for manufacturer ID: ${manufacturerId}`)

      const response = await fetch(`${API_BASE_URL}/manufacturers/${manufacturerId}/models`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || errorData.details || "Failed to fetch models")
      }

      const data = await response.json()
      console.log("Raw models API response:", data)

      // Normalize the response format
      if (Array.isArray(data)) {
        return data
      } else if (data && data.data) {
        return data.data
      } else if (data && Array.isArray(data.rows)) {
        return data.rows
      } else {
        console.error("Unexpected response format:", data)
        return []
      }
    } catch (error) {
      console.error("Error in manufacturersAPI.getModels:", error)
      throw error
    }
  },

  // Keep the rest of the manufacturersAPI methods unchanged
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/manufacturers/${id}`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to fetch manufacturer")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in manufacturersAPI.getById:", error)
      throw error
    }
  },

  create: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/manufacturers`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      return handleResponse(response)
    } catch (error) {
      console.error("Error in manufacturersAPI.create:", error)
      throw error
    }
  },

  update: async (id, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/manufacturers/${id}`, {
        method: "PUT",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      return handleResponse(response)
    } catch (error) {
      console.error("Error in manufacturersAPI.update:", error)
      throw error
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/manufacturers/${id}`, {
        method: "DELETE",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })
      return handleResponse(response)
    } catch (error) {
      console.error("Error in manufacturersAPI.delete:", error)
      throw error
    }
  },
}

