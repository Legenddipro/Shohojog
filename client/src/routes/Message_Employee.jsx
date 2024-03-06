// Message_Employee.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Message_Courier_Card from "./Message_Courier_Card"; // Import Message_Courier_Card component
import "./Message_Employee.css"; // Import CSS file

const Message_Employee = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchCourierOrders = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(`http://localhost:5000/courier/courier-orders/${userId}`);
        const data = await response.json();

        if (response.ok) {
          setOrders(data);
        } else {
          console.error("Error fetching courier orders:", data.message);
        }
      } catch (error) {
        console.error("Error fetching courier orders:", error);
      }
    };

    fetchCourierOrders();
  }, [orders]);

  const handlePaymentReceived = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:5000/courier/on-payment-received/${orderId}`, {
        method: "PUT",
      });

      if (response.ok) {
        console.log("Payment received successfully for order ID:", orderId);
        // You can update the UI or perform additional actions here
      } else {
        console.error("Error handling payment:", response.statusText);
      }
    } catch (error) {
      console.error("Error handling payment:", error);
    }
  };

  return (
    <div className="message-employee-container">
      <div className="title-bar">
        <div className="title-section">
          <h1 className="title">Messages</h1>
        </div>
        <div className="options">
          <Link to="/Home_Employee" className="go-back-option">
            Go Back
          </Link>
        </div>
      </div>
      <div className="message-content">
        <h2>Courier Confirmed Orders</h2>
        <div className="message-courier-card-container">
          {orders.map((order) => (
            <Message_Courier_Card key={order.order_id} order={order} onPaymentReceived={handlePaymentReceived} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Message_Employee;

