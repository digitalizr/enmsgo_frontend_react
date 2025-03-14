// API service for the Energy Management SaaS Platform

// Base API URL - should be set from environment variables in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// Helper function for handling API responses
const handleResponse = async (response) => {
  const data = await response.json()

  if (!response.ok) {
    const error = (data && data.message) || response.statusText
    return Promise.reject(error)
  }

  return data
}

// Authentication API
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    return handleResponse(response)
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
    // Client-side logout - no API call needed
    localStorage.removeItem("user")
    localStorage.removeItem("token")
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
  },

  getToken: () => {
    return localStorage.getItem("token")
  },
}

// Helper function to get auth header
const authHeader = () => {
  const token = authAPI.getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// User API
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

  create: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    })
    return handleResponse(response)
  },

  update: async (id, userData) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(userData),
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

  manualResetPassword: async (id, password) => {
    const response = await fetch(`${API_BASE_URL}/users/${id}/manual-reset`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    return handleResponse(response)
  },

  validatePasswordToken: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
    return handleResponse(response)
  },

  setPassword: async (token, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/set-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    })
    return handleResponse(response)
  },
}

// Smart Meters API
export const smartMetersAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams()

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value)
      }
    }

    const response = await fetch(`${API_BASE_URL}/devices/smart-meters?${queryParams}`, {
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

  create: async (meterData) => {
    const response = await fetch(`${API_BASE_URL}/devices/smart-meters`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(meterData),
    })
    return handleResponse(response)
  },

  update: async (id, meterData) => {
    const response = await fetch(`${API_BASE_URL}/devices/smart-meters/${id}`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(meterData),
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
export const edgeGatewaysAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams()

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value)
      }
    }

    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways?${queryParams}`, {
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

  create: async (gatewayData) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(gatewayData),
    })
    return handleResponse(response)
  },

  update: async (id, gatewayData) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${id}`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(gatewayData),
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

  addIpAddress: async (gatewayId, ipData) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${gatewayId}/ip-addresses`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(ipData),
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

  updateSpecifications: async (gatewayId, specsData) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${gatewayId}/specifications`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(specsData),
    })
    return handleResponse(response)
  },

  getConnectionDetails: async (gatewayId) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${gatewayId}/connection`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  updateConnectionDetails: async (gatewayId, connectionData) => {
    const response = await fetch(`${API_BASE_URL}/devices/edge-gateways/${gatewayId}/connection`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(connectionData),
    })
    return handleResponse(response)
  },
}

// Device Models API
export const deviceModelsAPI = {
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams()

    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value)
      }
    }

    const response = await fetch(`${API_BASE_URL}/devices/models?${queryParams}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/devices/models/${id}`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },

  create: async (modelData) => {
    const response = await fetch(`${API_BASE_URL}/devices/models`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(modelData),
    })
    return handleResponse(response)
  },

  update: async (id, modelData) => {
    const response = await fetch(`${API_BASE_URL}/devices/models/${id}`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(modelData),
    })
    return handleResponse(response)
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/devices/models/${id}`, {
      method: "DELETE",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
}

// Companies API
export const companyAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/companies`, {
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

  create: async (companyData) => {
    const response = await fetch(`${API_BASE_URL}/companies`, {
      method: "POST",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(companyData),
    })
    return handleResponse(response)
  },

  update: async (id, companyData) => {
    const response = await fetch(`${API_BASE_URL}/companies/${id}`, {
      method: "PUT",
      headers: { ...authHeader(), "Content-Type": "application/json" },
      body: JSON.stringify(companyData),
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

  getDepartments: async (facilityId) => {
    const response = await fetch(`${API_BASE_URL}/facilities/${facilityId}/departments`, {
      method: "GET",
      headers: { ...authHeader(), "Content-Type": "application/json" },
    })
    return handleResponse(response)
  },
}

// Energy Data API
export const energyAPI = {
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

