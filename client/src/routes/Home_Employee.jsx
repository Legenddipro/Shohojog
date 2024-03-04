// Home_Employee.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home_Employee.css"; // Import CSS file

const Home_Employee = ({ setAuth }) => {
  const navigate = useNavigate();
  const [employeeInfo, setEmployeeInfo] = useState(null);

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
        // Inside the useEffect hook after setting the employeeInfo state
        console.log("Employee Info:", employeeInfo);

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

  return (
    <div className="home-employee-container">
      <div className="title-bar">
        <div className="title-section">
          <h1 className="title">Shohojog Courier Portal</h1>
        </div>
        <div className="options">
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
        {/* Scrollable section for available deliveries */}
        <h2>Available Deliveries</h2>
        {/* Add your content for available deliveries here */}
        <p>This section will contain the list of available deliveries.</p>
      </div>
    </div>
  );
};

export default Home_Employee;
