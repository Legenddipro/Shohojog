//Home-Customer.jsx
import React, { Fragment, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import All_products_Customer from './All_products_Customer';
import Cart from './Cart';
import './Home_Customer.css'; 

const Home_Customer = ({ setAuth }) => {
  const navigate = useNavigate();
  const [isCartOpen, setIsCartOpen] = useState(false); // State to track if the cart is open

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen); // Toggle the state of the cart
  };

  const logout = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userType");
    setAuth(false);
    navigate('/login');
  };
  
  return (
    <Fragment>
      {/* Fixed title bar */}
      <div className="title-bar">
        <div className="title-section">
          <h1 className="title">Shohojog</h1> {/* Shohojog title */}
        </div>
        <div className="options">
          <button className="option" onClick={() => navigate('/messaging')}>Messaging</button>
          <button className="option" onClick={() => navigate('/my_Profile')}>My Profile</button>
          <button className="option cart-option" onClick={toggleCart}>
            <span className="cart-icon">🛒</span> My Cart
          </button> {/* Toggle cart visibility */}
          {/* Button to navigate to Customer History */}
          <Link to="/customer_history" className="option">
            History
          </Link>
          <button className="option logout-option" onClick={(e) => logout(e)}>Log out</button>
        </div>
      </div>
      <div className="content-container">
        {/* Render All_products_Customer component */}
        <All_products_Customer />
        {/* Render Cart component conditionally if isCartOpen is true */}
        {isCartOpen && <Cart />}
      </div>
    </Fragment>
  )
};

export default Home_Customer;


