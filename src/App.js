import React, { useState, useEffect } from 'react';

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        // Here is where the environment variable is used to construct the full URL.
        // It combines the base URL from your .env file with the specific API endpoint.
        const apiUrl = `${process.env.REACT_APP_API_URL}/api/catalog`;

        console.log(`Fetching data from: ${apiUrl}`);

        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

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