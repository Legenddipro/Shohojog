import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Top_Sold_Products = () => {
  const [topSoldProducts, setTopSoldProducts] = useState([]);

  useEffect(() => {
    const fetchTopSoldProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/customer_care/top_selled');
        setTopSoldProducts(response.data);
      } catch (error) {
        console.error('Error fetching top sold products:', error);
      }
    };

    fetchTopSoldProducts();
  }, []);

  return (
    <div>
      <h1>Top Sold Products</h1>
      <table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Selling Quantity</th>
          </tr>
        </thead>
        <tbody>
          {topSoldProducts.map((product) => (
            <tr key={product.product_id}>
              <td>{product.product_id}</td>
              <td>{product.product_name}</td>
              <td>{product.selled_quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Top_Sold_Products;
