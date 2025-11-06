import React, { useEffect, useState } from 'react';
import { fetchCatalog } from '../../frontend/services/apiClient';

export default function Catalog() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchCatalog().then(setProducts);
  }, []);

  return (
    <div>
      <h2>Catalog</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>{p.name} - ${p.price}</li>
        ))}
      </ul>
    </div>
  );
}
