import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home_Employee.css"; // Import CSS file
import DeliveryCard from "./DeliveryCard"; // Import DeliveryCard component

const Home_Employee = ({ setAuth }) => {
  const navigate = useNavigate();
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [availableDeliveries, setAvailableDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeInfo = async () => {
      try {
        // Fetch user ID from local storage
        const userId = localStorage.getItem("userId");

        // Fetch courier information using user ID
        const response = await fetch(
          `http://localhost:5000/courier/courier-info/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setEmployeeInfo(data);
        } else {
          console.error("Error fetching courier information:", data.message);
        }
      } catch (error) {
        console.error("Error fetching courier information:", error);
      }
    };

    fetchEmployeeInfo();
  }, []);

  useEffect(() => {
    const fetchAvailableDeliveries = async () => {
      try {
        // Fetch user ID from local storage
        const userId = localStorage.getItem("userId");

        // Fetch available deliveries for the courier
        const response = await fetch(
          `http://localhost:5000/courier/orders/${userId}`
        );
        const data = await response.json();

        if (response.ok) {
          setAvailableDeliveries(data);
          setLoading(false);
        } else {
          console.error("Error fetching available deliveries:", data.message);
        }
      } catch (error) {
        console.error("Error fetching available deliveries:", error);
      }
    };

    fetchAvailableDeliveries();
  }, []);

  const logoutEmployee = () => {
    // Remove employee-related items from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("employeeType");
    localStorage.removeItem("userType");
    // Call setAuth to update authentication state
    setAuth(false);
    // Navigate to the login page
    navigate("/login");
  };

  const handleConfirmDelivery = async (orderId) => {
    try {
      // Fetch user ID from local storage
      const userId = localStorage.getItem("userId");

      // Make a PUT request to the backend API to confirm the delivery
      const response = await fetch(
        `http://localhost:5000/courier/confirm-delivery/${orderId}/${userId}`,
        {
          method: "PUT",
        }
      );

      if (response.ok) {
        // Refresh available deliveries after confirming the delivery
        const updatedDeliveries = availableDeliveries.filter(
          (delivery) => delivery.order_id !== orderId
        );
        setAvailableDeliveries(updatedDeliveries);
        console.log("Delivery confirmed successfully");
      } else {
        console.error("Error confirming delivery:", response.statusText);
      }
    } catch (error) {
      console.error("Error confirming delivery:", error);
    }
  };

  return (
    <div className="home-employee-container">
      <div className="title-bar">
        <div className="title-section">
          <h1 className="title">Shohojog Courier Portal</h1>
        </div>
        <div className="options">
          <button
            className="option history-option"
            onClick={() => navigate("/history")}
          >
            History
          </button>
          <button
            className="option messages-option"
            onClick={() => navigate("/message_employee")}
          >
            Messages
          </button>
          <button className="option logout-option" onClick={logoutEmployee}>
            Log out
          </button>
        </div>
      </div>
      <div className="employee-info">
        {employeeInfo ? (
          <div className="info-container">
            <h2>Welcome, Employee!</h2>
            <div>
              <p>
                Name: {employeeInfo[0].first_name} {employeeInfo[0].last_name}
              </p>
              <p>Email: {employeeInfo[0].e_mail}</p>
              <p>Vehicle Type: {employeeInfo[0].vehicle_type}</p>
              <p>Delivery Zone: {employeeInfo[0].town}</p>
            </div>
          </div>
        ) : (
          <p>Loading employee information...</p>
        )}
      </div>
      <div className="available-deliveries">
        <h2>Available Deliveries</h2>
        {loading ? (
          <p>Loading available deliveries...</p>
        ) : (
          <div className="delivery-list">
            {availableDeliveries.map((delivery) => (
              <DeliveryCard
                key={delivery.order_id}
                delivery={delivery}
                onConfirm={handleConfirmDelivery}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home_Employee;
