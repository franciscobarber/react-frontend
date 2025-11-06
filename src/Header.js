import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './context/CartContext';

export default function Header() {
  const { cart } = useCart();
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

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
        </ul>
      </nav>
    </header>
  );
}