// API service for the Energy Management SaaS Platform

// Base API URL - should be set from environment variables in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

// Helper function for handling API responses
const handleResponse = async (response: Response) => {
  const data = await response.json()

  if (!response.ok) {
    const error = (data && data.message) || response.statusText
    return Promise.reject(error)
  }

  return data
}

// Authentication API
export const authApi = {
  async login(email: string, password: string) {
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

  register: async (userData: any) => {
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
  validatePasswordToken: async (token: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
    return handleResponse(response)
  },

  // Reset password with token (for email-based resets)
  resetPassword: async (token: string, newPassword: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    })
    return handleResponse(response)
  },

  // Change password for first-time login
  changePasswordFirstTime: async (userId: string, currentPassword: string, newPassword: string, token: string) => {
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
  requestPasswordReset: async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/request-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    return handleResponse(response)
  },
}

// Helper function to get auth header
const authHeader = () => {
  const token = authApi.getToken()
  if (!token) {
    console.warn("No auth token found")
    return {}
  }
  return { Authorization: `Bearer ${token}` }
}

// Smart Meters API
export const smartMeterApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/devices/smart-meters`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/devices/smart-meters/${id}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  create: async (meterData: any) => {
    const response = await fetch(`${API_BASE_URL}/devices/smart-meters`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(meterData),
    })
    return handleResponse(response)
  },

  update: async (id: string, meterData: any) => {
    const response = await fetch(`${API_BASE_URL}/devices/smart-meters/${id}`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(meterData),
    })
    return handleResponse(response)
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/devices/smart-meters/${id}`, {
      method: "DELETE",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
}

// Edge Gateways API
export const edgeGatewayApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${id}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  create: async (gatewayData: any) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(gatewayData),
    })
    return handleResponse(response)
  },

  update: async (id: string, gatewayData: any) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${id}`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(gatewayData),
    })
    return handleResponse(response)
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${id}`, {
      method: "DELETE",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
}

// Companies API
export const companyApi = {
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
      console.error("Error in companyApi.getAll:", error)
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
      const token = authApi.getToken()
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
      console.error("Error in companyApi.create:", error)
      throw error
    }
  },

  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
      method: "DELETE",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
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

      const token = authApi.getToken()
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
      console.error("Error in companyApi.createFacility:", error)
      throw error
    }
  },

  createDepartment: async (facilityId, data) => {
    try {
      console.log("Creating department with data:", data)
      console.log("For facility ID:", facilityId)

      const token = authApi.getToken()
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
      console.error("Error in companyApi.createDepartment:", error)
      throw error
    }
  },
}

// Energy Data API
export const energyApi = {
  getConsumption: async (meterId: string, startTime: string, endTime: string, interval?: string) => {
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

  getAggregatedData: async (
    companyId: string,
    startTime: string,
    endTime: string,
    aggregationType: string,
    facilityId?: string,
  ) => {
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

  getCostAnalysis: async (companyId: string, startTime: string, endTime: string, facilityId?: string) => {
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

// Alerts API
export const alertApi = {
  getAll: async (filters?: any) => {
    const params = new URLSearchParams(filters)

    const response = await fetch(`${API_BASE_URL}/alerts?${params}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/alerts/${id}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  acknowledge: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/alerts/${id}/acknowledge`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  resolve: async (id: string, notes?: string) => {
    const response = await fetch(`${API_BASE_URL}/alerts/${id}/resolve`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    })
    return handleResponse(response)
  },

  getRules: async () => {
    const response = await fetch(`${API_BASE_URL}/alerts/rules`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  createRule: async (ruleData: any) => {
    const response = await fetch(`${API_BASE_URL}/alerts/rules`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(ruleData),
    })
    return handleResponse(response)
  },
}

// AI Insights API
export const aiApi = {
  getRecommendations: async (companyId: string, facilityId?: string) => {
    const params = new URLSearchParams({
      companyId,
      ...(facilityId && { facilityId }),
    })

    const response = await fetch(`${API_BASE_URL}/ai/recommendations?${params}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  getPredictions: async (meterId: string, horizon: string) => {
    const params = new URLSearchParams({
      meterId,
      horizon,
    })

    const response = await fetch(`${API_BASE_URL}/ai/predictions?${params}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  getAnomalyDetection: async (meterId: string, startTime: string, endTime: string) => {
    const params = new URLSearchParams({
      meterId,
      startTime,
      endTime,
    })

    const response = await fetch(`${API_BASE_URL}/ai/anomalies?${params}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
}

// Reports API
export const reportApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/reports/${id}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  generate: async (reportData: any) => {
    const response = await fetch(`${API_BASE_URL}/reports/generate`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(reportData),
    })
    return handleResponse(response)
  },

  download: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/reports/${id}/download`, {
      method: "GET",
      headers: { ...authHeader() },
    })

    if (!response.ok) {
      const error = await response.text()
      return Promise.reject(error)
    }

    return response.blob()
  },

  getTemplates: async () => {
    const response = await fetch(`${API_BASE_URL}/reports/templates`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
}

// Users API
export const userApi = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  getById: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  create: async (userData: any) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
    return handleResponse(response)
  },

  update: async (id: string, userData: any) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
    return handleResponse(response)
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
}

