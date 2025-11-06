import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import * as api from '../services/api';

const Checkout = () => {
    const { cart } = useCart();
    const [status, setStatus] = useState('');

    const handlePurchase = async () => {
        if (cart.items.length === 0) {
            setStatus('Your cart is empty.');
            return;
        }

        try {
            setStatus('Creating order...');
            const order = await api.createOrder({ cartId: cart.id /* ...other details */ });

            setStatus('Processing payment...');
            await api.processPayment({ orderId: order.id, amount: cart.total });

            setStatus('Purchase successful! Thank you for your order.');
            // Here you would typically clear the cart
        } catch (error) {
            setStatus(`Purchase failed: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Checkout</h2>
            <p>Review your order and complete the purchase.</p>
            <h3>Total: ${cart.total.toFixed(2)}</h3>
            <button onClick={handlePurchase}>Complete Purchase</button>
            {status && <p>{status}</p>}
        </div>
    );
};

export default Checkout;