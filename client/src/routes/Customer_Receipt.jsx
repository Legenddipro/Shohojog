import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './Customer_Receipt.css'; // Import the CSS file

const Customer_Receipt = () => {
  const [receiptData, setReceiptData] = useState(null);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/customer/receipt/${userId}`);
        setReceiptData(response.data);
      } catch (error) {
        console.error('Error fetching receipt:', error);
      }
    };

    fetchReceipt();
  }, [userId]);

  const handleBuy = () => {
    // Dummy function for buy button
    alert('Buy button clicked');
  };

  const handleCancel = () => {
    // Dummy function for cancel button
    alert('Cancel button clicked');
  };

  const handleEdit = () => {
    // Navigate back to the cart
    navigate('/cart');
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
          <button className="button cancel-button" onClick={handleCancel}>Cancel</button>
          <button className="button edit-button" onClick={handleEdit}>Edit</button>
        </div>
      </div>
    </div>
  );
};

export default Customer_Receipt;
