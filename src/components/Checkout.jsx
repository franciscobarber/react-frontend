import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';
import { createOrder } from '../services/apiClient';

export default function Checkout() {
  const { cartItems, refreshCart, cartId } = useCart();
  const { backendAccessToken, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!isAuthenticated || !backendAccessToken) {
      alert('You must be logged in to place an order.');
      return;
    }

    const order = {
      cartId: cartId, // Pass the cartId to the backend
      orderItems: cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    try {
      const newOrder = await createOrder(order, backendAccessToken);
      alert(`Order created successfully! Order ID: ${newOrder.id}`);
      await refreshCart(cartId); // Re-fetch the cart, which is now empty
      navigate('/'); // Redirect to the homepage
    } catch (error) {
      console.error('Failed to create order:', error);
      alert('There was an issue placing your order. Please try again.');
    }
  };

  const isOrderable = isAuthenticated && cartItems.length > 0;

  return (
    <div>
      <h2>Checkout</h2>
      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map(item => (
            <li key={item.productId}>
              {item.productName} - Qty: {item.quantity}
            </li>
          ))}
        </ul>
      ) : (
        <p>Your cart is empty. Add items from the catalog to place an order.</p>
      )}
      <button onClick={handleCheckout} disabled={!isOrderable}>
        Place Order
      </button>
    </div>
  );
}