import React from 'react';
import { useNavigate } from 'react-router-dom';

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

  return (
    <div>
      <h1>Welcome, Employee!</h1>
      <p>This is the home page for employees.</p>
      <button onClick={logoutEmployee}>Logout</button>
    </div>
  );
};

export default Home_Employee_Customercare;
