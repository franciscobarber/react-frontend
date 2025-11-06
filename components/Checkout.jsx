import React from 'react';
import { createOrder } from '../services/apiClient';

export default function Checkout() {
  const handleCheckout = () => {
    const order = { customerName: 'John Doe', totalAmount: 1000 };
    createOrder(order).then(o => alert('Order created: ' + o.id));
  };

  return (
    <div>
      <h2>Checkout</h2>
      <button onClick={handleCheckout}>Place Order</button>
    </div>
  );
}
