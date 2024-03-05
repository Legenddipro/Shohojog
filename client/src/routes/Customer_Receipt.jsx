import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './Customer_Receipt.css'; // Import the CSS file

const Customer_Receipt = () => {
  const [receiptData, setReceiptData] = useState(null);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate(); // Initialize the navigate function

  const fetchReceipt = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/customer/receipt/${userId}`);
      setReceiptData(response.data);
    } catch (error) {
      console.error('Error fetching receipt:', error);
    }
  };

  useEffect(() => {
    fetchReceipt();
  }, [userId]);

  const handleBuy = async () => {
    try {
      // Call the backend route to confirm the order
      const response = await axios.post(`http://localhost:5000/customer/confirm_order`, { user_id: userId });
      // Display an alert to the customer indicating the order confirmation
      alert('You will receive a message shortly from the seller. Please wait.');
      navigate('/Home_Customer');
    } catch (error) {
      console.error('Error confirming order:', error);
      alert('An error occurred while confirming the order. Please try again.'); // Show error message
    }
  };
  

  const handleCancel = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/customer/cancel_cart`, { user_id: userId });
      alert(response.data.message); // Show success message
      // Reload the receipt data after cancelling the cart
      fetchReceipt();
      // Navigate back to Home_Customer
      navigate('/Home_Customer');
    } catch (error) {
      console.error('Error cancelling cart:', error);
      alert('An error occurred while cancelling the cart. Please try again.'); // Show error message
    }
  };

  const handleEdit = () => {
    // Navigate back to the cart
    navigate('/cart');
  };

  const handleMoreShopping = () => {
    // Navigate back to Home_Customer
    navigate('/Home_Customer');
  };

  return (
    <div className="page-wrapper">
      <div className="title-bar">
        <h2>Billing and Payment</h2>
      </div>
      <div className="receipt-container">
        <h2>Receipt</h2>
        {receiptData ? (
          <div>
            <p>Order ID: {receiptData.order_id}</p>
            <ul>
              {receiptData.products.map((product, index) => (
                <li key={index}>
                  <div>
                    <strong>Product Name:</strong> {product.product_name}
                  </div>
                  <div>
                    <strong>Category:</strong> {product.product_category}
                  </div>
                  <div>
                    <strong>Seller:</strong> {product.company_name}
                  </div>
                  <div>
                    <strong>Quantity:</strong> {product.quantity}
                  </div>
                  <div>
                    <strong>Price:</strong> ${product.price}
                  </div>
                </li>
              ))}
            </ul>
            <p><strong>Total Price:</strong> ${receiptData.total_price}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <div className="buttons-container">
          <button className="button buy-button" onClick={handleBuy}>Buy</button>
          <button className="button cancel-button" onClick={handleCancel}>Cancel Cart</button> {/* Changed button text */}
          <button className="button edit-button" onClick={handleEdit}>Edit</button>
          <button className="button more-shopping-button" onClick={handleMoreShopping}>More Shopping</button>
        </div>
      </div>
    </div>
  );
};

export default Customer_Receipt;
