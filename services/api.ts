// API service for the Energy Management SaaS Platform
// This file serves as the central point for all API calls to the backend

// Base API URL - should be set from environment variables in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

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

// Authentication API
export const authApi = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    const data = await handleResponse(response)

    // If user doesn't need to change password, store the token and user in localStorage
    if (data.token && !data.user.requirePasswordChange) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
    }

    return data
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
export const smartMeterApi = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await fetch(`${API_BASE_URL}/devices/smart-meters?${queryString}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/devices/smart-meters/${id}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/devices/smart-meters`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/devices/smart-meters/${id}`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/devices/smart-meters/${id}`, {
      method: "DELETE",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
}

// Edge Gateways API
export const edgeGatewayApi = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways?${queryString}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${id}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },
  update: async (id, data) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${id}`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${id}`, {
      method: "DELETE",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  getIpAddresses: async (gatewayId) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${gatewayId}/ip-addresses`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  addIpAddress: async (gatewayId, data) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${gatewayId}/ip-addresses`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },
  removeIpAddress: async (gatewayId, ipId) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${gatewayId}/ip-addresses/${ipId}`, {
      method: "DELETE",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  getSpecifications: async (gatewayId) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${gatewayId}/specifications`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  updateSpecifications: async (gatewayId, data) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${gatewayId}/specifications`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },
  getConnectionDetails: async (gatewayId) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${gatewayId}/connection-details`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  updateConnectionDetails: async (gatewayId, data) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${gatewayId}/connection-details`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },
}

// Companies API
export const companyAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString()
    const response = await fetch(`${API_BASE_URL}/companies?${queryString}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  create: async (data) => {
    const response = await fetch(`${API_BASE_URL}/companies`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
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
    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/facilities`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  createFacility: async (companyId, data) => {
    const response = await fetch(`${API_BASE_URL}/companies/${companyId}/facilities`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },
  getDepartments: async (facilityId) => {
    const response = await fetch(`${API_BASE_URL}/facilities/${facilityId}/departments`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
  createDepartment: async (facilityId, data) => {
    const response = await fetch(`${API_BASE_URL}/facilities/${facilityId}/departments`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return handleResponse(response)
  },
}

// Device Models API
export const deviceModelApi = {
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
export const userAPI = {
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
    const response = await fetch(`${API_BASE_URL}/users/${id}/manual-reset-password`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ newPassword }),
    })
    return handleResponse(response)
  },
}

// Assignments API
export const assignmentApi = {
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

