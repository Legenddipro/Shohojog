// Import necessary modules
//Arian
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ReturnOrdersHistory = () => {
  // Define state to hold return orders history
  const [returnOrdersHistory, setReturnOrdersHistory] = useState([]);

  // Fetch return orders history from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/customer_care/return_orders_history')
      .then(response => {
        setReturnOrdersHistory(response.data);
      })
      .catch(error => {
        console.error('Error fetching return orders history:', error);
      });
  }, []);

  return (
    <div className="return-orders-history">
      <h2>Return Orders History</h2>
      <ul>
        {returnOrdersHistory.map(order => (
          <li key={order.return_id}>
            Return ID: {order.return_id}, Return Date: {order.return_date}, Status: {order.status}, Complaint: {order.complaint}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReturnOrdersHistory;
