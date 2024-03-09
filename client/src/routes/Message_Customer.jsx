// Message_Customer.jsx
//Arian
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Message_Customer.css"; // Import CSS file

const Message_Customer = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const receiverId = localStorage.getItem("userId");
      const response = await fetch(`http://localhost:5000/customer/fetch_messages?receiver_id=${receiverId}`);
      const data = await response.json();

      if (response.ok) {
        setMessages(data.messages);
      } else {
        console.error("Error fetching messages:", data.error);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  return (
    <div className="message-container">
      <div className="title-bar">
        <h1 className="message-header">Shohojog Messaging</h1>
        <Link to="/Home_Customer" className="go-back-button">
          Go Back
        </Link>
      </div>
      <div className="message-list">
        {messages.map((message) => (
          <div key={message.Message_id} className="message-card">
            <div className="message-info">
              <p className="message-sender">From: {message.sender_username}</p>
              <p className="message-time">{new Date(message.message_time).toLocaleString()}</p>
            </div>
            <p className="message-text">{message.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Message_Customer;
