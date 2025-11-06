import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Auth from './Auth';

const Header = () => {
    const { cart } = useCart();
    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <header className="app-header">
            <h1>My Retail App</h1>
            <nav>
                <Link to="/">Catalog</Link> | <Link to="/cart">Cart ({itemCount})</Link> | <Link to="/checkout">Checkout</Link>
            </nav>
            <Auth />
        </header>
    );
};

export default Header;