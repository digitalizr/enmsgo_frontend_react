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
export const api = {
  login: async (email: string, password: string) => {
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

