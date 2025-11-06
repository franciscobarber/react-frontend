import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './components/CartContext';
import Auth from './components/Auth';

export default function Header() {
  const { cartItems } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/">Catalog</Link></li>
          <li>
            <Link to="/cart">
              Cart ({itemCount})
            </Link>
          </li>
          <li><Link to="/checkout">Checkout</Link></li>
          <li><Auth /></li>
        </ul>
      </nav>
    </header>
  );
}