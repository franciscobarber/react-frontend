const API_BASE_URL = process.env.REACT_APP_BACKEND_API_URL || "https://retail-app-erfrfcaehdbqa0db.canadacentral-01.azurewebsites.net";

async function callApi(endpoint, method, data, accessToken) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorMessage}`);
  }

  return response.json();
}

export async function getProducts() {
  return callApi('/api/catalog', 'GET');
}

export async function fetchCart(cartId) {
  return callApi(`/api/cart/${cartId}`, 'GET');
}

export async function addToCart(item, cartId) {
  return callApi(`/api/cart/${cartId}/items`, 'POST', item);
}

export async function createOrder(orderData, accessToken) {
  return callApi('/api/order', 'POST', orderData, accessToken);
}