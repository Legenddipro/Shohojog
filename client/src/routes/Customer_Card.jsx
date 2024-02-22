import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom"; // Import Link component

const Customer_Card = ({ productId, productName, price, category, status }) => {
  return (
    <div className="card">
      <div className="card__body">
        {/* Product Image */}
        <div className="card__image"></div>

        {/* Product Name */}
        <h5 className="card__title">{productName}</h5>

        {/* Product Price */}
        <p className="card__description">
          <strong>Price: </strong>
          Tk {price} 
        </p>

        {/* Product Category */}
        <p className="card__description">
          <strong>Category: </strong>
          {category}
        </p>

        {/* Product Status */}
        <p className="card__description">
          <strong>Status: </strong>
          {status}
        </p>
      </div>

      {/* Button Container */}
      <div className="card__button-container">
        {/* View Details Button */}
        <Link to={`/product/${productId}`} className="card__btn card__btn--view-details">
          View Details
        </Link>

        {/* Add to Cart Button */}
        <button className="card__btn card__btn--add-to-cart">Add to Cart</button>
      </div>
    </div>
  );
};

Customer_Card.propTypes = {
  productId: PropTypes.number.isRequired,
  productName: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
};

export default Customer_Card;
