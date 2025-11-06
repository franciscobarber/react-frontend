import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Header';
import ProductCatalog from './components/Catalog.jsx';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import Recommendations from './components/Recommendations';


import ProtectedRoute from './components/ProtectedRoute';
import { CartProvider } from './components/CartContext';
import { AuthProvider } from './components/AuthContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<ProductCatalog />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={
                <ProtectedRoute><Checkout /></ProtectedRoute>
              } />
            </Routes>
            <Recommendations />
          </main>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;