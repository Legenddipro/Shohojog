import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import AllProducts from './All_products';
import './HomeSeller.css'; 
const Home_seller = ({ setAuth }) => {
  const handleLogout = () => {
    setAuth(false);
  };

  return (
    <Fragment>
      <div className="title-bar">
        <h1>Shohojog</h1>
        <div className="logout-option">
          <button onClick={handleLogout}>Log out</button>
        </div>
      </div>
      <div className="button-container">
        <Link to="/seller/getSeller">MY PROFILE</Link>
        {/* <Link to={`/product/${productId}`} className="card__btn card__btn--view-details"> Pass productId to URL */}
        <Link to="/seller-products">MY PRODUCTS</Link>
        <Link to="/seller-messages">MY MESSAGES</Link>
        <Link to="/search-products">Search Products</Link>
      </div>
      {/* </div> */}
      <div>
       <AllProducts />
       </div>
    </Fragment>
  );
};

export default Home_seller;