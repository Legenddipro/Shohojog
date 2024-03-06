// Frontend
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom"; // Import Link component
import "./Customer_Card.css"; // Import CSS file

const Customer_Card = ({ productId, productName, price, category, stock }) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [quantity, setQuantity] = useState(null); // Initialize quantity with null

  useEffect(() => {
    fetchQuantity();
  }, []);

  const fetchQuantity = async () => {
    try {
      // Retrieve user ID from local storage
      const userId = localStorage.getItem("userId");
      if (!userId) {
        // Handle case when user ID is not found in local storage
        console.error("User ID not found in local storage");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/customer/get_cart_quantity?user_id=${userId}&product_id=${productId}`
      );
      const data = await response.json();
      console.log(data); // Log the response from the server
      // Update the quantity state with the fetched value
      setQuantity(data.quantity);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleAddToCart = async () => {
    if (quantity > 0) {
      // If quantity is greater than 0, change the button to "Added" and return
      return;
    }

    setIsAddingToCart(true);
    try {
      // Retrieve user ID from local storage
      const userId = localStorage.getItem("userId");
      if (!userId) {
        // Handle case when user ID is not found in local storage
        console.error("User ID not found in local storage");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/customer/add_to_cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId, // Use retrieved user ID
            product_id: productId,
          }),
        }
      );
      const data = await response.json();
      console.log(data); // Log the response from the server
      // Optionally, you can show a message or update the UI after successful addition to cart
      setTimeout(() => {
        setIsAddingToCart(false); // Reset isAddingToCart after 1 second
        setQuantity(1); // Set quantity to 1 after adding to cart
      }, 1000);
    } catch (error) {
      console.error("Error:", error);
      // Handle error, show error message, etc.
      setIsAddingToCart(false); // Reset isAddingToCart if an error occurs
    }
  };
  const handleRemoveFromCart = async () => {
    setIsAddingToCart(true);
    try {
      // Retrieve user ID from local storage
      const userId = localStorage.getItem("userId");
      if (!userId) {
        // Handle case when user ID is not found in local storage
        console.error("User ID not found in local storage");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/customer/remove_from_cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userId, // Use retrieved user ID
            product_id: productId,
          }),
        }
      );
      const data = await response.json();
      console.log(data); // Log the response from the server
      // Optionally, you can show a message or update the UI after successful removal from cart
      setIsAddingToCart(false); // Reset isAddingToCart after successful removal from cart
      setQuantity(0); // Set quantity to 0 after removing from cart
    } catch (error) {
      console.error("Error:", error);
      // Handle error, show error message, etc.
      setIsAddingToCart(false); // Reset isAddingToCart if an error occurs
    }
  };
  // Render null until quantity is fetched
  if (quantity === null) {
    return null;
  }

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
          <strong>Stock: </strong>
          {stock}
        </p>
      </div>

      {/* Button Container */}
      <div className="card__button-container">
        {/* View Details Button */}
        <Link
          to={`/product/${productId}`}
          className="card__btn card__btn--view-details"
        >
          View Details
        </Link>

        {/* Add to Cart Button or Out of Stock */}
        {quantity > 0 ? (
          <button className="card__btn card__btn--added" disabled>
            Added
          </button>
        ) : stock === 0 ? (
          <button className="card__btn card__btn--out-of-stock" disabled>
            Out of Stock
          </button>
        ) : (
          <button
            className="card__btn card__btn--add-to-cart"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? "Adding to Cart..." : "Add to Cart"}
          </button>
        )}

        {/* Remove from Cart Button */}
        {quantity > 0 && (
          <button
            className="card__btn card__btn--remove-from-cart"
            onClick={handleRemoveFromCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? "Removing from Cart..." : "Remove from Cart"}
          </button>
        )}
      </div>
    </div>
  );
};

Customer_Card.propTypes = {
  productId: PropTypes.number.isRequired,
  productName: PropTypes.string.isRequired,
  price: PropTypes.string.isRequired,
  category: PropTypes.string.isRequired,
  stock: PropTypes.number.isRequired,
};

export default Customer_Card;
