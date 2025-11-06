import React from 'react';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cart, loading, updateItemQuantity, removeItemFromCart } = useCart();

    if (loading) {
        return <div>Loading cart...</div>;
    }

    if (!cart || cart.items.length === 0) {
        return <h2>Your cart is empty.</h2>;
    }

    return (
        <div>
            <h2>Shopping Cart</h2>
            <ul>
                {cart.items.map((item) => (
                    <li key={item.id}>
                        <p>{item.productName} - ${item.price.toFixed(2)}</p>
                        <p>
                            Quantity:
                            <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value, 10))}
                                min="1"
                            />
                        </p>
                        <button onClick={() => removeItemFromCart(item.id)}>Remove</button>
                    </li>
                ))}
            </ul>
            <h3>Total: ${cart.total.toFixed(2)}</h3>
            <button onClick={() => window.location.href = '/checkout'}>
                Proceed to Checkout
            </button>
        </div>
    );
};

export default Cart;