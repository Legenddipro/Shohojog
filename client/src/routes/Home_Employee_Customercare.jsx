import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Home_Employee_Customercare.css'; // Import CSS file for styling

const Home_Employee_Customercare = ({ setAuth }) => {
  const navigate = useNavigate();

  const logoutEmployee = () => {
    // Remove employee-related items from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("employeeType");
    localStorage.removeItem("userType");
    // Call setAuth to update authentication state
    setAuth(false);
    // Navigate to the login page
    navigate('/login');
  };

  const goToStatsPage = () => {
    // Navigate to the stats page
    navigate('/stats');
  };

  return (
    <div className="home-employee-customercare">
      <div className="title-bar">
        <div className="left-section">
          <h1>Shohojog Customer Care</h1>
        </div>
        <div className="right-section">
          <button onClick={goToStatsPage}>Stats</button>
          <button onClick={logoutEmployee}>Logout</button>
        </div>
      </div>
      <div className="content">
        <h1>Welcome, Employee!</h1>
        <p>This is the home page for employees.</p>
      </div>
    </div>
  );
};

export default Home_Employee_Customercare;

