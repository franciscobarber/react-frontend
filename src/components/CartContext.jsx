import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { addToCart as apiAddToCart, fetchCart } from '../services/apiClient';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

function getCartId() {
    let cartId = localStorage.getItem('cartId');
    if (!cartId) {
        cartId = crypto.randomUUID();
        localStorage.setItem('cartId', cartId);
    }
    return cartId;
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);
    const [cartId] = useState(getCartId());

    const refreshCart = useCallback(async () => {
        try {
            const items = await fetchCart(cartId);
            setCartItems(items);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
            // Handle error appropriately in a real app
        }
    }, [cartId]);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const addToCart = async (productId, quantity) => {
        await apiAddToCart({ productId, quantity }, cartId);
        await refreshCart(); // Re-fetch the cart to update the state
    };

    const value = { cartItems, addToCart, refreshCart };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}