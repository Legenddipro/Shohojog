import React, { Fragment } from 'react';
import AllProducts from './All_products'; // Import the AllProducts component
import { Link } from 'react-router-dom'; // Import Link for routing

const Home = ({ setAuth }) => {
  return (
    <Fragment>
      {/* Title Bar */}
      <div className="title-bar">
        <h1>Shohojog</h1>
        <div className="login-option">
          <Link to="/login">Log in</Link>
        </div>
      </div>

      {/* All Products */}
      <AllProducts /> {/* Render the AllProducts component */}
    </Fragment>
  );
};

export default Home;

