import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { addToCart as apiAddToCart, fetchCart } from '../services/apiClient';

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    const refreshCart = useCallback(async () => {
        try {
            const items = await fetchCart();
            setCartItems(items);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
            // Handle error appropriately in a real app
        }
    }, []);

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    const addToCart = async (productId, quantity) => {
        await apiAddToCart({ productId, quantity });
        await refreshCart(); // Re-fetch the cart to update the state
    };

    const value = { cartItems, addToCart, refreshCart };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}