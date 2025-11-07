import React from 'react';
import { createOrder } from '../services/apiClient';
import { useAuth } from './AuthContext'; // Import useAuth
import { useCart } from './CartContext'; // Assuming you'll use the cart context

export default function Checkout() {
  const { userInfo, backendAccessToken, isAuthenticated } = useAuth();
  const { cartItems } = useCart(); // Assuming cartItems are needed for the order

  const handleCheckout = async () => {
    if (!isAuthenticated || !backendAccessToken) {
      alert('Please log in to place an order.');
      return;
    }
    const order = { customerName: userInfo?.userDetails || 'Guest', totalAmount: 1000, items: cartItems }; // Example order structure
    await createOrder(order, backendAccessToken).then(o => alert('Order created: ' + o.id));
  };

  return (
    <div>
      <h2>Checkout</h2> {/* Add disabled state to button */}
      <button onClick={handleCheckout} disabled={!isAuthenticated || !backendAccessToken || cartItems.length === 0}>
        Place Order
      </button>
    </div>
  );
}
