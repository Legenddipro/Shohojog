import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import './Message_Seller.css'; // Import the CSS file for styling
import Message_Seller_Card from './Message_Seller_Card'; // Import the Message_Seller_Card component

const Message_Seller = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  useEffect(() => {
    // Function to fetch seller orders from the backend
    const fetchSellerOrders = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:5000/seller/sellerOrders/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch seller orders');
        }
        const data = await response.json();
        setOrders(data);
        setLoading(false); // Set loading to false when data is fetched successfully
      } catch (error) {
        console.error('Error fetching seller orders:', error);
        setError(error.message); // Set error message in case of error
        setLoading(false); // Set loading to false even in case of error
      }
    };
    // Initial fetch
    fetchSellerOrders();
    // Interval for periodic fetch (every 30 seconds)
    const intervalId = setInterval(fetchSellerOrders, 30000);
    // Cleanup function to clear interval on component unmount
    return () => clearInterval(intervalId);
  }, [orders]); // Re-run effect when orders change

  const handleConfirmation = async (orderid, pickupDate) => {
    try {
      const response = await fetch('http://localhost:5000/seller/confirmOrder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderid, pickupDate })
      });
  
      if (!response.ok) {
        throw new Error('Failed to confirm order');
      }
  
      const responseData = await response.json();
      console.log('Response Data:', responseData); // Log response data to verify
  
      // Check if any product status requires restocking
      let restockingNeeded = false;
      if (Array.isArray(responseData.updatedProducts)) {
        restockingNeeded = responseData.updatedProducts.some(product => product.status === 'Restocking needed');
      }
  
      if (restockingNeeded) {
        console.log('Navigation triggered'); // Log navigation trigger
        // Display message to restock the products
        alert('Please restock the products of the order to confirm the order.');
        // Redirect to edit info page for restocking
        navigate(`/seller-products`);
        return;
      }
  
      console.log('Order confirmed successfully');
    } catch (error) {
      console.error('Error confirming order:', error);
    }
  };
  
  
  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  if (error) {
    return <div>Error: {error}</div>; // Show error message if fetching data fails
  }

  return (
    <div className="message-seller-container">
      {/* Title Bar */}
      <div className="title-bar">
        <div className="title-section">
          <h1 className="title">Shohojog</h1> {/* Shohojog title */}
        </div>
        <div className="navigation">
          <button className="go-back-button" onClick={() => window.history.back()}>Go Back</button>
        </div>
      </div>

      {/* Orders */}
      <div className="orders">
        {orders.length > 0 ? (
          orders.map(order => (
            <Message_Seller_Card
              key={order.orderid}
              orderid={order.orderid}
              products={order.products}
              onAccept={handleConfirmation}
            />
          ))
        ) : (
          <div>No New Messages</div>
        )}
      </div>
    </div>
  );
};

export default Message_Seller;
