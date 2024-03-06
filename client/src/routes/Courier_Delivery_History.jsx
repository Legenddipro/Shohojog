// Courier_Delivery_History.jsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Courier_Delivery_History.css"; // Import CSS file

const Courier_Delivery_History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchCourierHistory = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await fetch(
          `http://localhost:5000/courier/courier-orders-history/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setHistory(data);
        } else {
          console.error("Error fetching courier history:", data.message);
        }
      } catch (error) {
        console.error("Error fetching courier history:", error);
      }
    };

    fetchCourierHistory();
  }, []);

  return (
    <div className="courier-history-container">
      <div className="title-bar">
        <div className="title-section">
          <h1 className="title">Shohojog Delivery History</h1>
        </div>
        <div className="options">
          <Link to="/Home_Employee" className="go-back-option">
            Go Back
          </Link>
        </div>
      </div>
      <div className="history-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Payment Date</th>
              <th>Status</th>
              <th>Total Payment</th> {/* Add heading for Total Payment */}
            </tr>
          </thead>
          <tbody>
            {history.map((order) => (
              <tr key={order.order_id}>
                <td>{order.order_id}</td>
                <td>{order.payment_date}</td>
                <td>{order.delivery_status}</td>
                <td>{order.total_payment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

};

export default Courier_Delivery_History;

