import React, { useState, useEffect } from 'react';
import './Message_Seller.css'; // Import the CSS file for styling
import Message_Seller_Card from './Message_Seller_Card'; // Import the Message_Seller_Card component

const Message_Seller = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, [orders]); // Empty dependency array to ensure the effect runs only once on mount

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
  
      console.log('Order confirmed successfully');
    } catch (error) {
      console.error('Error confirming order:', error);
      // Handle error if necessary
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
