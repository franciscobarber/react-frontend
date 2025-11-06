import React, { useEffect, useState } from 'react';

async function fetchCatalog() {
  // The backend endpoint is at /api/catalog
  const response = await fetch('/api/catalog');
  if (!response.ok) {
    // This will be caught by the .catch() block
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCatalog()
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
        {products.map(p => <li key={p.id}>{p.name} - ${p.price}</li>)}
      </ul>
    </div>
  );
}
