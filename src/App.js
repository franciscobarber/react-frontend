import React, { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setProducts(data))
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        setError(error.message);
      });
  }, []);

  return (
    <div>
      <h1>Retail Demo Frontend</h1>
      <h2>Products</h2>
      {error && <p>Error fetching products: {error}</p>}
      {products.length > 0 ? (
        <ul>
          {products.map((product) => (
            <li key={product.id}>{product.name} - ${product.price}</li>
          ))}
        </ul>
      ) : (
        !error && <p>Loading products...</p>
      )}
    </div>
  );
}

export default App;