import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import AllProducts from './All_products';
import './Home_Seller.css'; 

const Home_seller = ({ setAuth }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
    localStorage.removeItem('userId');
    localStorage.removeItem('employeeType');
    setAuth(false);
  };

  return (
    <Fragment>
      <div className="title-bar">
        <h1>Shohojog</h1>
        <div className="navigation">
          <Link to="/seller/getSeller">MY PROFILE</Link>
          <Link to="/seller-products">MY PRODUCTS</Link>
          <Link to="/message_seller">MY MESSAGES</Link>
          <Link to="/Search_Products">SEARCH PRODUCTS</Link>
          <div className="logout-option">
            <button onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </div>
      <div className="content">
        <div>
          <AllProducts />
        </div>
      </div>
    </Fragment>
  );
};

export default Home_seller;
