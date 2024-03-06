// Message_Courier_Card.jsx
import React from "react";
import "./Message_Courier_Card.css"; // Import CSS file

const Message_Courier_Card = ({ order, onPaymentReceived }) => {
  const handlePaymentReceived = () => {
    onPaymentReceived(order.order_id);
  };

  return (
    <div className="message-courier-card">
      <h3>Order ID: {order.order_id}</h3>
      <p>Order Date: {order.order_date}</p>
      <p>Status: {order.delivery_status}</p>
      <button onClick={handlePaymentReceived}>Pay</button>
      {/* Add more order details here if needed */}
    </div>
  );
};

export default Message_Courier_Card;



