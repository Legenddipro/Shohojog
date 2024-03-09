// Card.jsx
//Arian
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom"; // Import Link component

const Card = ({ productId, productName, price, category, stock }) => { // Add productId prop
  return (
    <div className="card">
      <div className="card__body">
        {/* Product Image */}
        <div className="card__image"></div>

        {/* Product Name */}
        <h5 className="card__title">{productName}</h5>

        {/* Product Price */}
        <p className="card__description"><strong>Price: </strong>{price} Tk</p>

        {/* Product Category */}
        <p className="card__description"><strong>Category: </strong>{category}</p>

        {/* Product Status */}
        <p className="card__description"><strong>Stock </strong>{stock}</p>
      </div>

      {/* Button Container */}
      <div className="card__button-container">
        {/* View Details Button */}
        <Link to={`/product/${productId}`} className="card__btn card__btn--view-details"> {/* Pass productId to URL */}
          View Details
        </Link>
      </div>
    </div>
  );
};

Card.propTypes = {
  productId: PropTypes.number.isRequired, // Add productId prop type
  productName: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  stock: PropTypes.number.isRequired
};

export default Card;
