const API_URL = process.env.REACT_APP_API_URL || '';

// A helper function to handle fetch responses
async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`HTTP error! status: ${response.status}, message: ${error}`);
  }
  return response.json();
}

export async function getProducts() {
  const response = await fetch(`${API_URL}/api/catalog`);
  return handleResponse(response);
}

export async function fetchCart(cartId) {
  const response = await fetch(`${API_URL}/api/cart/${cartId}`);
  const cart = await handleResponse(response);
  return cart.items || []; // The API returns a cart object with an 'items' array
}

export async function addToCart(item, cartId) {
  const response = await fetch(`${API_URL}/api/cart/${cartId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  return handleResponse(response);
}

export async function createOrder(order) {
  // This endpoint doesn't exist yet on the backend, this is a placeholder
  console.log("Creating order:", order);
  // In a real implementation, you would make a POST request here.
  return Promise.resolve({ id: 'new-order-123', ...order });
}