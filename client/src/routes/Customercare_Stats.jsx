//Prachu & Arian

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Customercare_Stats.css"; // Import CSS file for styling

const Customercare_Stats = () => {
  const [topSoldProducts, setTopSoldProducts] = useState([]);
  const [showTopSoldProducts, setShowTopSoldProducts] = useState(false);
  const [customerHistory, setCustomerHistory] = useState([]);
  const [showCustomerHistory, setShowCustomerHistory] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [topSoldProductsBetweenDates, setTopSoldProductsBetweenDates] =
    useState([]);
  const [showTopSoldProductsBetweenDates, setShowTopSoldProductsBetweenDates] =
    useState(false);
  const [startDate_seller, setStartDate_seller] = useState("");
  const [endDate_seller, setEndDate_seller] = useState("");
  const [topSellerBetweenDates, setTopSellerBetweenDates] = useState([]);
  const [showTopSellerBetweenDates, setShowTopSellerBetweenDates] =
    useState(false);
  const [topRatedProducts, setTopRatedProducts] = useState([]);
  const [showTopRatedProducts, setShowTopRatedProducts] = useState(false);
  const [topOrdersWithMostProducts, setTopOrdersWithMostProducts] = useState(
    []
  );
  const [showTopOrdersWithMostProducts, setShowTopOrdersWithMostProducts] =
    useState(false);

  useEffect(() => {
    fetchTopSoldProducts();
  }, []);

  const fetchTopSoldProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/customer_care/top_selled"
      );
      setTopSoldProducts(response.data);
      setShowTopSoldProducts(!showTopSoldProducts);
    } catch (error) {
      console.error("Error fetching top sold products:", error);
    }
  };
  const fetchTopRatedProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/customer_care/top_rated_products"
      );
      setTopRatedProducts(response.data);
      console.log(response.data);
      setShowTopRatedProducts(!showTopRatedProducts); // Show the top rated products section
    } catch (error) {
      console.error("Error fetching top rated products:", error);
    }
  };

  const fetchTopOrdersWithMostProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/customer_care/top_orders_with_most_products"
      );
      setTopOrdersWithMostProducts(response.data);
      setShowTopOrdersWithMostProducts(!showTopOrdersWithMostProducts); // Show the top orders with most products section
    } catch (error) {
      console.error("Error fetching top orders with most products:", error);
    }
  };

  const fetchCustomerHistory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/customer_care/customer_order_history"
      );
      setCustomerHistory(response.data);
      setShowCustomerHistory(!showCustomerHistory); // Toggle customer history display
    } catch (error) {
      console.error("Error fetching customer history:", error);
    }
  };

  const fetchTopSoldBetweenDates = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/customer_care/top_sold_between_dates",
        { start_date: startDate, end_date: endDate }
      );
      setTopSoldProductsBetweenDates(response.data);
      setShowTopSoldProductsBetweenDates(!showTopSoldProductsBetweenDates); // Show the top sold products between dates
    } catch (error) {
      console.error("Error fetching top sold products between dates:", error);
    }
  };

  const fetchTopSellerBetweenDates = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/customer_care/top_seller_btwn_dates",
        { start_date: startDate_seller, end_date: endDate_seller }
      );
      setTopSellerBetweenDates(response.data);
      setShowTopSellerBetweenDates(!showTopSellerBetweenDates); // Show the top sold products between dates
    } catch (error) {
      console.error("Error fetching top seller between dates:", error);
    }
  };

  return (
    <div className="customercare-stats-container">
      {/* Sidebar with Navigation Buttons */}
      <div className="sidebar">
        <button className="nav-button" onClick={fetchTopSoldProducts}>
          {showTopSoldProducts
            ? "Hide Top Sold Products"
            : "Show Top Sold Products"}
        </button>
        <button className="nav-button" onClick={fetchCustomerHistory}>
          {showCustomerHistory ? "Hide Top Customer" : "See Top Customer"}
        </button>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button className="nav-button" onClick={fetchTopSoldBetweenDates}>
          {showTopSoldProductsBetweenDates ? "Hide Products" : "Show Products"}
        </button>

        <input
          type="date"
          value={startDate_seller}
          onChange={(e) => setStartDate_seller(e.target.value)}
        />
        <input
          type="date"
          value={endDate_seller}
          onChange={(e) => setEndDate_seller(e.target.value)}
        />
        <button className="nav-button" onClick={fetchTopSellerBetweenDates}>
          {showTopSellerBetweenDates ? "Hide Seller" : "Show Seller"}
        </button>
        <button className="nav-button" onClick={fetchTopRatedProducts}>
          {showTopRatedProducts
            ? "Hide Top Rated Products"
            : "Show Top Rated Products"}
        </button>
        <button className="nav-button" onClick={fetchTopOrdersWithMostProducts}>
          {showTopOrdersWithMostProducts
            ? "Hide Top Orders"
            : "Show Top Orders"}
        </button>
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
            <h2>All-Time Top Sold Products</h2>
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

        {showTopSoldProductsBetweenDates && (
          <div className="top-products-between-dates-section">
            <h2>Top Sold Products Between Dates</h2>
            <table>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {topSoldProductsBetweenDates.map((product) => (
                  <tr key={product.product_id}>
                    <td>{product.product_id}</td>
                    <td>{product.product_name1}</td>
                    <td>{product.selled_quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showCustomerHistory && customerHistory.length > 0 && (
          <div className="customer-history-section">
            <h2>Top Customers</h2>
            <table>
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Total Products Ordered</th>
                </tr>
              </thead>
              <tbody>
                {customerHistory.map((customer) => (
                  <tr key={customer.user_id}>
                    <td>{customer.customer_name}</td>
                    <td>{customer.total_products_ordered}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {showTopSellerBetweenDates && (
          <div className="top-seller-between-dates-section">
            <h2>Top Seller Between Dates</h2>
            <table>
              <thead>
                <tr>
                  <th>Seller Name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {topSellerBetweenDates.map((seller) => (
                  <tr key={seller.seller_id}>
                    <td>{seller.seller_name}</td>
                    <td>{seller.sold_quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showTopRatedProducts && (
          <div className="top-rated-products-section">
            <h2>Top Rated Products</h2>
            <table>
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Overall Rating</th>
                </tr>
              </thead>
              <tbody>
                {topRatedProducts.map((product) => (
                  <tr key={product.product_id}>
                    <td>{product.product_id}</td>
                    <td>{product.product_name}</td>
                    <td>{product.overall_rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showTopOrdersWithMostProducts && (
          <div className="top-orders-section">
            <h2>Top Orders with Most Products</h2>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Total Products</th>
                </tr>
              </thead>
              <tbody>
                {topOrdersWithMostProducts.map((order) => (
                  <tr key={order.order_id}>
                    <td>{order.order_id}</td>
                    <td>{order.total_products}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Customercare_Stats;
