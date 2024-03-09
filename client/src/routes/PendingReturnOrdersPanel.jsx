import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PendingReturnOrdersPanel = () => {
  const [pendingReturnOrders, setPendingReturnOrders] = useState([]);
  const [returnDate, setReturnDate] = useState(""); // State to hold the return date

  useEffect(() => {
    // Fetch pending return orders
    axios.get('http://localhost:5000/customer_care/pending_return_orders')
      .then(response => {
        setPendingReturnOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching pending return orders:', error);
      });
  }, []);

  const handleApproveOrder = (orderId) => {
    // Validate return date
    if (!returnDate) {
      alert("Please enter the return date.");
      return;
    }
  
    // Retrieve customer care ID from local storage
    const customerCareId = localStorage.getItem("userId");
    console.log("Customer Care ID:", customerCareId);
  
    // Send approval request to backend
    axios.post('http://localhost:5000/customer_care/approve', {
      returnOrderId: orderId,
      customerCareId: customerCareId,
      returnDate: returnDate
    })
      .then(response => {
        console.log("Approval response:", response.data.message); // Log success message
        // Refresh pending return orders after approval
        axios.get('http://localhost:5000/customer_care/pending_return_orders')
          .then(response => {
            setPendingReturnOrders(response.data);
          })
          .catch(error => {
            console.error('Error fetching pending return orders after approval:', error);
          });
      })
      .catch(error => {
        console.error('Error approving return order:', error);
      });
  };
  

  const handleDenyOrder = (orderId) => {
    // Retrieve customer care ID from local storage
    const customerCareId = localStorage.getItem("userId");
  
    // Send denial request to backend
    axios.post('http://localhost:5000/customer_care/deny', {
      returnOrderId: orderId,
      customerCareId: customerCareId
    })
    .then(response => {
      console.log("Denial response:", response.data.message); // Log success message
      // Refresh pending return orders after denial
      axios.get('http://localhost:5000/customer_care/pending_return_orders')
        .then(response => {
          setPendingReturnOrders(response.data);
        })
        .catch(error => {
          console.error('Error fetching pending return orders after denial:', error);
        });
    })
    .catch(error => {
      console.error('Error denying return order:', error);
    });
  };
  

  return (
    <div className="pending-return-orders-panel">
      <h2>Pending Return Orders</h2>
      <ul>
        {pendingReturnOrders.map(order => (
          <li key={order.order_id}>
            Order ID: {order.order_id}, Customer: {order.customer_name},Complaint: {order.complaint} ,Status: {order.status}
            <input
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              required
            />
            <button onClick={() => handleApproveOrder(order.order_id)}>Approve</button>
            <button onClick={() => handleDenyOrder(order.order_id)}>Deny</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PendingReturnOrdersPanel;
