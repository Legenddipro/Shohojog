import React, { Fragment, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import All_products_Customer from './All_products_Customer';
import Cart from './Cart'; // Import the Cart component

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
      <div className="title-bar">
        <h1>Shohojog</h1>
        <div className="logout-option">
          <button onClick={(e) => logout(e)}>Log out</button>
        </div>
        <div className="options">
          <button onClick={() => navigate('/messaging')}>Messaging</button>
          <button onClick={() => navigate('/my_Profile')}>My Profile</button>
          <button onClick={toggleCart}>My Cart</button> {/* Toggle cart visibility */}
        </div>
      </div>
      {/* Conditionally render Cart component if isCartOpen is true */}
      {isCartOpen ? <Cart /> : <All_products_Customer />}
    </Fragment>
  );
};

export default Home_Customer;
