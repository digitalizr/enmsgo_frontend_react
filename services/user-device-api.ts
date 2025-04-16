// User-Device API
import { authHeader } from "./apiConfig"
import { handleResponseWithRetry, cachedApiRequest } from "./api" 

//const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"
const API_BASE_URL = "https://api.enmsgo.com/api"

// Cache for user company relationships to avoid repeated API calls
const userCompanyCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Exponential backoff retry logic
const handleResponseWithRetry = async (response, retries = 3, initialBackoff = 1000) => {
  if (response.ok) {
    return await response.json();
  }
  
  // If we've run out of retries, throw an error
  if (retries === 0) {
    const errorText = await response.text();
    throw new Error(`API request failed with status ${response.status}: ${errorText}`);
  }
  
  // If this is a rate limit error (429), back off and retry
  if (response.status === 429) {
    const backoff = initialBackoff * Math.pow(2, 3 - retries);
    console.log(`Rate limit hit. Backing off for ${backoff}ms before retry.`);
    await new Promise(resolve => setTimeout(resolve, backoff));
    
    // Make a new request after backoff
    const newResponse = await fetch(response.url, {
      method: response.method,
      headers: response.headers,
      body: response.bodyUsed ? null : await response.clone().text()
    });
    
    return handleResponseWithRetry(newResponse, retries - 1, initialBackoff);
  }
  
  // For other errors, just throw
  const errorText = await response.text();
  throw new Error(`API request failed with status ${response.status}: ${errorText}`);
};

// Utility function to batch API requests
const batchRequests = async (items, batchSize, requestFn) => {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(requestFn));
    results.push(...batchResults);
    
    // Add a small delay between batches to avoid overwhelming the API
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
  return results;
};

export const userDeviceAPI = {
  // Get all edge gateways assigned to a user
  getUserEdgeGateways: async (userId) => {
    try {
      if (!userId) {
        console.warn("No userId provided to getUserEdgeGateways")
        return { data: [] }
      }

      return await cachedApiRequest(`/users/${userId}/edge-gateways`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      });
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

      return await cachedApiRequest(`/users/${userId}/smart-meters`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      });
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

      return await handleResponseWithRetry(response)
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

      return await handleResponseWithRetry(response)
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

      // Invalidate cache after a successful remove operation
      userCompanyCache.delete(userId);
      
      return await handleResponseWithRetry(response)
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

      // Invalidate cache after a successful remove operation
      userCompanyCache.delete(userId);
      
      return await handleResponseWithRetry(response)
    } catch (error) {
      console.error("Error in userDeviceAPI.removeSmartMeterFromUser:", error)
      throw error
    }
  },
  
  // Get cached user company relationships or fetch if not in cache
  getUserCompanyRelationships: async (userId) => {
    try {
      if (!userId) {
        console.warn("No userId provided to getUserCompanyRelationships")
        return { data: [] }
      }
      
      // Check if we have a valid cache entry
      if (userCompanyCache.has(userId)) {
        const { data, timestamp } = userCompanyCache.get(userId);
        
        // Return cached data if it's still valid
        if (Date.now() - timestamp < CACHE_TTL) {
          console.log(`Using cached company data for user ${userId}`);
          return data;
        }
      }
      
      // If not in cache or expired, make the API call
      console.log(`Fetching company information for user: ${userId}`);
      const response = await fetch(`${API_BASE_URL}/user-companies/${userId}`, {
        method: "GET",
        headers: { ...authHeader(), "Content-Type": "application/json" },
      });
      
      const data = await handleResponseWithRetry(response);
      
      // Cache the result
      userCompanyCache.set(userId, {
        data,
        timestamp: Date.now()
      });
      
      return data;
    } catch (error) {
      console.error(`Error fetching companies for user ${userId}:`, error);
      return { data: [] };
    }
  },
  
  // Function to fetch multiple users' company relationships in batches
  getUserCompanyRelationshipsBatched: async (userIds, batchSize = 3) => {
    try {
      const userCompanyMap = {};
      
      // First check the cache for all users
      const uncachedUserIds = userIds.filter(userId => {
        const cachedData = userCompanyCache.get(userId);
        if (cachedData && (Date.now() - cachedData.timestamp < CACHE_TTL)) {
          userCompanyMap[userId] = cachedData.data;
          return false;
        }
        return true;
      });
      
      // If all users were in cache, return early
      if (uncachedUserIds.length === 0) {
        return userCompanyMap;
      }
      
      // Fetch relationships for uncached users in batches
      await batchRequests(
        uncachedUserIds,
        batchSize,
        async (userId) => {
          try {
            const response = await fetch(`${API_BASE_URL}/user-companies/${userId}`, {
              method: "GET",
              headers: { ...authHeader(), "Content-Type": "application/json" },
            });
            
            const data = await handleResponseWithRetry(response);
            
            // Cache and store the result
            userCompanyCache.set(userId, {
              data,
              timestamp: Date.now()
            });
            
            userCompanyMap[userId] = data;
            return { userId, success: true };
          } catch (error) {
            console.error(`Error fetching companies for user ${userId}:`, error);
            userCompanyMap[userId] = { data: [] };
            return { userId, success: false, error };
          }
        }
      );
      
      return userCompanyMap;
    } catch (error) {
      console.error("Error in batch fetching user companies:", error);
      return {};
    }
  }
}
