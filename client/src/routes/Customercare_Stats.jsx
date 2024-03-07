import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Customercare_Stats.css'; // Import CSS file for styling

const Customercare_Stats = () => {
  const [topSoldProducts, setTopSoldProducts] = useState([]);
  const [showTopSoldProducts, setShowTopSoldProducts] = useState(false);

  useEffect(() => {
    fetchTopSoldProducts();
  }, []);

  const fetchTopSoldProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/customer_care/top_selled');
      setTopSoldProducts(response.data);
    } catch (error) {
      console.error('Error fetching top sold products:', error);
    }
  };

  const toggleTopSoldProducts = () => {
    setShowTopSoldProducts(!showTopSoldProducts);
  };

  return (
    <div className="customercare-stats-container">
      {/* Sidebar with Navigation Buttons */}
      <div className="sidebar">
        <button className="nav-button" onClick={toggleTopSoldProducts}>
          {showTopSoldProducts ? 'Hide Top Sold Products' : 'Show Top Sold Products'}
        </button>
        <Link to="/customer_history" className="nav-button">
          Search Customer History
        </Link>
        <Link to="/top_products" className="nav-button">
          View Top Products
        </Link>
        <Link to="/top_customers" className="nav-button">
          Top Customers
        </Link>
        <Link to="/top_sellers" className="nav-button">
          Seller with the Most Profit
        </Link>
      </div>

      {/* Content Section */}
      <div className="content">
        {/* Title Bar */}
        <div className="title-bar">
          <div className="title-section">
            <h1 className="title">Shohojog Customer Care</h1>
          </div>
          <div className="options">
            {/* Go Back Button */}
            <Link to="/Home_Employee_Customercare" className="go-back-option">
              Go Back
            </Link>
          </div>
        </div>

        {showTopSoldProducts && (
          <div className="top-products-section">
            <h2>Top Sold Products</h2>
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
        )}
        {/* Add Bar Graph here if desired */}
      </div>
    </div>
  );
};

export default Customercare_Stats;


