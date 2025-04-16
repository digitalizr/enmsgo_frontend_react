// API service for the Energy Management SaaS Platform
// This file serves as the central point for all API calls to the backend

import { getApiUrl } from "./url-helper"

// Base API URL - should be set from environment variables in production
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
//const API_BASE_URL = "https://api.enmsgo.com/api"

// Cache implementation
const apiCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper function to handle rate limited requests with exponential backoff
const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      
      // If we get rate limited (429), wait and retry
      if (response.status === 429) {
        console.log(`Rate limited (429). Attempt ${i + 1}/${retries}. Waiting ${delay}ms before retry.`);
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        continue;
      }
      
      return response;
    } catch (error) {
      console.error(`API request failed, attempt ${i + 1}/${retries}`, error);
      lastError = error;
      
      // For network errors, wait and retry
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
  
  throw lastError || new Error('Maximum retries reached');
}

// Enhanced helper function for handling API responses with retry logic
export const handleResponseWithRetry = async (response, retries = 3, initialBackoff = 1000) => {
  // Clone the response for error handling
  const responseClone = response.clone();
  
  // If response is rate limited (429)
  if (response.status === 429) {
    if (retries > 0) {
      // Calculate backoff with exponential delay and some randomness
      const backoff = initialBackoff * Math.pow(2, 3 - retries) * (0.9 + Math.random() * 0.2);
      console.log(`Rate limited. Retrying after ${backoff}ms. Attempts left: ${retries}`);
      
      // Wait for backoff period
      await new Promise(resolve => setTimeout(resolve, backoff));
      
      // Retry the request - we need to recreate it
      const originalRequest = response.url;
      const method = response.method;
      const headers = response.headers;
      
      const newResponse = await fetch(originalRequest, {
        method,
        headers,
        // Other request parameters would need to be reconstructed if needed
      });
      
      // Recursively retry with one fewer retry remaining
      return handleResponseWithRetry(newResponse, retries - 1, initialBackoff);
    } else {
      console.error("Maximum retries exceeded for rate-limited request");
    }
  }
  
  if (!response.ok) {
    let errorMessage = "An error occurred";

    try {
      const errorData = await responseClone.json();
      errorMessage = errorData.message || errorData.details || errorMessage;
    } catch (e) {
      // If the response is not JSON, use the status text
      errorMessage = response.statusText || errorMessage;
    }

    throw new Error(errorMessage);
  }

  return await response.json();
}

// Function to get from cache or fetch
export const cachedApiRequest = async (endpoint, options = {}) => {
  const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
  
  // Check if we have a valid cache entry
  if (apiCache.has(cacheKey)) {
    const { data, timestamp } = apiCache.get(cacheKey);
    
    // Return cached data if it's still valid
    if (Date.now() - timestamp < CACHE_TTL) {
      console.log(`Using cached data for ${endpoint}`);
      return data;
    }
  }
  
  try {
    // If not in cache or expired, make the API call
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await handleResponseWithRetry(response);
    
    // Cache the result
    apiCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
    
    return data;
  } catch (error) {
    console.error(`Error in cachedApiRequest for ${endpoint}:`, error);
    throw error;
  }
}

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

      return normalizeResponse(data)
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

// Helper function to normalize response formats
const normalizeResponse = (data) => {
  // If already in the right format, return it
  if (data && data.data) {
    return data;
  }
  
  // If it's an array, wrap it in data property
  if (Array.isArray(data)) {
    return { data };
  }
  
  // If it's an object but not in our format, wrap it
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    // Check if it's a single object that should be in an array
    if (data.id) {
      return { data: [data] };
    }
    return data;
  }
  
  // Return empty data as fallback
  return { data: [] };
}

// Helper function to get auth header
const authHeader = () => {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// Helper function for making API requests with error handling
const apiRequest = async (endpoint, method = "GET", body = null) => {
  try {
    const url = getApiUrl(endpoint)
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

    const response = await fetchWithRetry(url, options)

    // Check if response indicates unauthorized (token expired or invalid)
    if (response.status === 401 || response.status === 403) {
      console.log("Authentication error in API request, redirecting to login")
      // Clear auth data
      localStorage.removeItem("token")
      localStorage.removeItem("user")

      // Redirect to login page
      if (typeof window !== "undefined") {
        window.alert("Your session has expired. Please log in again.")
        window.location.href = "/signin"
        return null
      }
    }

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
  changePasswordFirstTime: async (params) => {
    try {
      const { userId, currentPassword, newPassword, token } = params
      console.log("Changing password for first-time login:", { userId, token: token ? "token-exists" : "no-token" })

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw errorData.message || "Failed to change password"
      }

      return await response.json()
    } catch (error) {
      console.error("Error in changePasswordFirstTime:", error)
      throw error
    }
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
      // Let's examine the user creation function to see if it's creating assignments

      // The create user function should not be creating any assignments
      // The issue is likely in how assignments are being displayed or filtered

      // Make sure we're using role_id, not role
      const userData = { ...data }

      // Check if password is empty and generate one if needed
      if (!userData.password || userData.password === "") {
        // Generate a random password if not provided
        const length = 12
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?"
        let password = ""
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.floor(Math.random() * charset.length))
          password += charset[randomIndex]
        }
        userData.password = password
      }

      // Log the data being sent
      console.log("Creating user with data:", userData)

      const response = await fetch(`${API_BASE_URL}/users`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify(userData),
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

      // Validate required fields
      if (!data.first_name || !data.last_name || !data.email) {
        throw new Error("First name, last name, and email are required")
      }

      // Ensure role_id is not undefined
      if (!data.role_id) {
        console.warn("Role ID is missing in update data, attempting to fetch current role")

        try {
          // Try to get the current user's role_id
          const currentUser = await usersAPI.getById(id)
          if (currentUser && currentUser.role_id) {
            data.role_id = currentUser.role_id
            console.log("Using current role_id:", data.role_id)
          } else {
            // If we can't get the current role, use a default admin role
            data.role_id = "615b2efa-ea1b-44b5-8753-04dc5cf29b84" // Default admin role
            console.log("Using default admin role_id")
          }
        } catch (roleError) {
          console.error("Error fetching current user role:", roleError)
          // Use a default admin role if we can't get the current role
          data.role_id = "615b2efa-ea1b-44b5-8753-04dc5cf29b84" // Default admin role
          console.log("Using default admin role_id after error")
        }
      }

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
        let errorMessage = "Failed to delete user"
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (e) {
          // If response is not JSON, use text instead
          const errorText = await response.text()
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      return { success: true, message: "User deleted successfully" }
    } catch (error) {
      console.error("Error in usersAPI.delete:", error)
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
      // Let's check the createUserCompanyRelationship function to ensure it's not creating assignments
      // Find the createUserCompanyRelationship function (around line 1400-1450)

      // Make sure the function is only creating the user-company relationship and not assignments
      // The function looks correct, so the issue is likely elsewhere
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

  bulkDelete: async (userIds) => {
    try {
      console.log(`Bulk deleting users: ${userIds.length} users`)
      const response = await fetch(`${API_BASE_URL}/users/bulk-delete`, {
        method: "POST",
        headers: { ...authHeader(), "Content-Type": "application/json" },
        body: JSON.stringify({ userIds }),
      })

      if (!response.ok) {
        let errorMessage = "Failed to delete users"
        try {
          const errorData = await response.json()
          errorMessage = errorData.message || errorData.error || errorMessage
        } catch (e) {
          // If response is not JSON, use text instead
          const errorText = await response.text()
          errorMessage = errorText || errorMessage
        }
        throw new Error(errorMessage)
      }

      return await response.json()
    } catch (error) {
      console.error("Error in usersAPI.bulkDelete:", error)
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
