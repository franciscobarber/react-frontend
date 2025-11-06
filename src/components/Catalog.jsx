import React, { useEffect, useState } from 'react';
import { useCart } from '../components/CartContext';
import { getProducts } from '../services/apiClient';

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(err => {
        console.error("Error fetching catalog:", err);
        setError('Failed to load products. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading products...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h2>Catalog</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} - ${p.price}
            <button onClick={() => addToCart(p.id, 1)}>Add to Cart</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
