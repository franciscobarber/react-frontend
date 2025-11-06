import React, { useEffect, useState } from 'react';
import { fetchCart, addToCart } from '../../../frontend/services/apiClient';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    fetchCart().then(setCartItems);
  }, []);

  const handleAdd = () => {
    const newItem = { productName: 'Laptop', quantity: 1 };
    addToCart(newItem).then(() => fetchCart().then(setCartItems));
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      <button onClick={handleAdd}>Add Laptop</button>
      <ul>
        {cartItems.map(c => (
          <li key={c.id}>{c.productName} - Qty: {c.quantity}</li>
        ))}
      </ul>
    </div>
  );
}
