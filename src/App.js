import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CartProvider } from './components/CartContext';
import Header from './Header';
import ProductCatalog from './components/Catalog.jsx';
import Cart from './Cart';
import Checkout from './Checkout';
import Recommendations from './Recommendations';

function App() {
  return (
    <CartProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<ProductCatalog />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
          <Recommendations />
        </main>
      </Router>
    </CartProvider>
  );
}

export default App;