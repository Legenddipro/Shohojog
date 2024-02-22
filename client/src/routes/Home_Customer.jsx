import React, { Fragment } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import All_products_Customer from './All_products_Customer'; // Import the All_Products_Customer component

const Home_Customer = ({ setAuth }) => {
  const navigate = useNavigate(); // Initialize navigate function

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
    navigate('/login'); // Navigate back to login page
  };
  
  return (
    <Fragment>
      {/* Title Bar */}
      <div className="title-bar">
        <h1>Shohojog</h1>
        <div className="logout-option">
          <button onClick={(e) => logout(e)}>Log out</button>
        </div>
        <div className="options">
          {/* Add links for messaging, my profile, and my cart */}
          <button onClick={() => navigate('/messaging')}>Messaging</button>
          <button onClick={() => navigate('/my_Profile')}>My Profile</button>
          <button onClick={() => navigate('/my-cart')}>My Cart</button>
        </div>
      </div>
      <All_products_Customer />
    </Fragment>
  );
};

export default Home_Customer;
