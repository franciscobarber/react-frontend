import React, { useState, useEffect } from 'react';

function App() {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/products')
      .then(response => {
    const fetchCatalog = async () => {
      try {
        // Here is where the environment variable is used to construct the full URL.
        // It combines the base URL from your .env file with the specific API endpoint.
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/catalog7`;

        console.log(`Fetching data from: ${apiUrl}`);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error('Network response was not ok');
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setProducts(data))
      .catch(error => {
        console.error('There was a problem with your fetch operation:', error);
        setError(error.message);
      });
  }, []);

        const data = await response.json();
        setItems(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, []); // The empty dependency array ensures this runs only once when the component mounts.

  if (loading) return <p>Loading catalog...</p>;
  if (error) return <p>Error fetching data: {error}</p>;

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
      <h1>Catalog Items</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name} - ${item.price}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;