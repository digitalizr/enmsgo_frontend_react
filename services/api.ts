// API service for the Energy Management SaaS Platform
// This file serves as the central point for all API calls to the backend

// Base API URL - should be set from environment variables in production
//const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
const API_BASE_URL = "https://api.enmsgo.com"

// Helper function for handling API responses
const handleResponse = async (response) => {
  const data = await response.json()

  if (!response.ok) {
    const error = (data && data.message) || response.statusText
    return Promise.reject(error)
  }

  return data
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

    const response = await fetch(url, options)

    if (!response.ok) {
      const errorData = await response.json()
      console.error(`API request failed for ${endpoint}:`, errorData)
      throw new Error(errorData.message || `API request failed with status ${response.status}`)
    }

    return await response.json()
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
      const queryString = new URLSearchParams(params).toString()
      const response = await fetch(`${API_BASE_URL}/devices/smart-meters?${queryString}`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to fetch smart meters")
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
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to fetch smart meter")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in smartMetersAPI.getById:", error)
      throw error
    }
  },

  create: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/smart-meters`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to create smart meter")
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
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to update smart meter")
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
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to delete smart meter")
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
      const queryString = new URLSearchParams(params).toString()
      const response = await fetch(`${API_BASE_URL}/devices/edge-gateways?${queryString}`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to fetch edge gateways")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in edgeGatewaysAPI.getAll:", error)
      throw error
    }
  },

  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${id}`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to fetch edge gateway")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in edgeGatewaysAPI.getById:", error)
      throw error
    }
  },

  create: async (data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/edge-gateways`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to create edge gateway")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in edgeGatewaysAPI.create:", error)
      throw error
    }
  },

  update: async (id, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${id}`, {
        method: "PUT",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to update edge gateway")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in edgeGatewaysAPI.update:", error)
      throw error
    }
  },

  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${id}`, {
        method: "DELETE",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("Server error response:", errorData)
        throw new Error(errorData.message || "Failed to delete edge gateway")
      }

      return await response.json()
    } catch (error) {
      console.error("Error in edgeGatewaysAPI.delete:", error)
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
      const queryString = new URLSearchParams(params).toString()
      const response = await fetch(`${API_BASE_URL}/companies?${queryString}`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })

      const data = await handleResponse(response)
      return data // Return the data directly, not wrapped in another object
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
      const response = await fetch(`${API_BASE_URL}/companies/${companyId}/facilities`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      })
      return handleResponse(response)
    } catch (error) {
      console.error("Error fetching facilities:", error)
      throw error
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
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  resetPassword: async (id) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/reset-password`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  manualResetPassword: async (id, newPassword) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/reset-password`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    })
    return handleResponse(response)
  },
}

// Assignments API
export const assignmentsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/assignments`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
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
    const response = await fetch(`${API_BASE_URL}/assignments/assign-edge-gateway`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ userId, gatewayId }),
    })
    return handleResponse(response)
  },
  assignSmartMeters: async (gatewayId, meterIds) => {
    const response = await fetch(`${API_BASE_URL}/assignments/assign-smart-meters`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ gatewayId, meterIds }),
    })
    return handleResponse(response)
  },
  removeEdgeGateway: async (userId, gatewayId) => {
    const response = await fetch(`${API_BASE_URL}/assignments/remove-edge-gateway`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ userId, gatewayId }),
    })
    return handleResponse(response)
  },
  removeSmartMeter: async (gatewayId, meterId) => {
    const response = await fetch(`${API_BASE_URL}/assignments/remove-smart-meter`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ gatewayId, meterId }),
    })
    return handleResponse(response)
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
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  updateInvoice: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/billing/invoices/${id}`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
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

