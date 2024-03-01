// Card.jsx
import React from "react";
import PropTypes from "prop-types";
//import { FiShoppingCart } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

//import "./Card.css"; // Import CSS file for styling

const Card_seller = ({ productName, price, category, stock }) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    // Add to cart functionality
    console.log("Adding to cart...");
  };

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
        <p className="card__description"><strong>Stock: </strong>{stock}</p>
      </div>

      {/* Button Container */}
      <div className="card__button-container">
        {/* Add to Cart Button */}
        <button className="card__btn card__btn--add-to-cart" onClick={handleAddToCart}>
          {/* // <FiShoppingCart /> Add to Cart */}
        </button>

        {/* View Details Button */}
        <Link to="/edit_info_seller_products" className="card__btn card__btn--view-details">
          EDIT INFO
        </Link>
      </div>
    </div>
  );
};

Card_seller.propTypes = {
  productName: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  stock: PropTypes.number.isRequired
};

export default Card_seller;
