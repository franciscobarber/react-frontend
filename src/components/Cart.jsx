import React from 'react';
import { useCart } from '../components/CartContext';

export default function Cart() {
  const { cartItems } = useCart();

  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 && <p>Your cart is empty.</p>}
      <ul>
        {cartItems.map(c => (
          <li key={c.id}>{c.productName} - Qty: {c.quantity}</li>
        ))}
      </ul>
    </div>
  );
}
