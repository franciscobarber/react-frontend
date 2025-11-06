const API_URL = process.env.REACT_APP_API_URL;

/**
 * Fetches the authentication token for the current user.
 * In a real-world scenario, you might want to cache this token.
 * @returns {Promise<string|null>} The auth token or null if not available.
 */
async function getAuthToken() {
    try {
        const response = await fetch('/.auth/me');
        const payload = await response.json();
        // The access_token is what you'd typically use as a Bearer token for your APIs
        return payload?.clientPrincipal?.accessToken;
    } catch (error) {
        console.error('Could not fetch user info or token.', error);
        return null;
    }
}

/**
 * Creates authenticated headers for API requests.
 * @returns {Promise<HeadersInit>}
 */
async function getAuthenticatedHeaders() {
    const headers = {
        'Content-Type': 'application/json',
    };
    const token = await getAuthToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

/**
 * A helper function to perform fetch requests.
 * @param {string} endpoint The API endpoint to call.
 * @param {RequestInit} options The fetch options.
 * @returns {Promise<any>} The JSON response.
 */
async function fetchApi(endpoint, options = {}) {
    const headers = await getAuthenticatedHeaders();
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...headers,
            ...options.headers,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API call failed with status ${response.status}: ${errorText}`);
    }

    // Handle cases with no content
    if (response.status === 204) {
        return null;
    }

    return response.json();
}

// --- API Functions ---

export const getProducts = () => fetchApi('/products');

// Cart API
export const getCart = () => fetchApi('/cart');
export const addToCart = (productId, quantity) => fetchApi('/cart', {
    method: 'POST',
    body: JSON.stringify({ productId, quantity }),
});
export const updateCartItem = (itemId, quantity) => fetchApi(`/cart/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
});
export const removeFromCart = (itemId) => fetchApi(`/cart/${itemId}`, {
    method: 'DELETE',
});

// Order API
export const createOrder = (orderDetails) => fetchApi('/orders', {
    method: 'POST',
    body: JSON.stringify(orderDetails),
});

// Payment API
export const processPayment = (paymentDetails) => fetchApi('/payments', {
    method: 'POST',
    body: JSON.stringify(paymentDetails),
});

// Recommendation API
export const getRecommendations = () => fetchApi('/recommendations');