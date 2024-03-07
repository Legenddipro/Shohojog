import React from "react";
import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";

const Card_seller = ({ productName, price, category, stock, productId, status, delete_status }) => {
  const navigate = useNavigate();

  const handleRestock = () => {
    // Redirect to the edit info page for restocking
    navigate(`/edit_info_seller_products/${productId}`);
  };

  const handleBringBack = async () => {
    try {
      const response = await fetch(`http://localhost:5000/product/bring_back_product/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ delete_status: 'available' }), // Update delete_status to 'available'
      });
  
      if (response.ok) {
        console.log('Product brought back successfully');
        // You can update the UI to remove the product from the unavailable list
        // For simplicity, you can reload the page to fetch the updated product list
        window.location.reload();
      } else {
        throw new Error('Failed to bring back product');
      }
    } catch (error) {
      console.error('Error bringing back product:', error);
    }
  };

  const priceValue = typeof price === 'string' ? parseFloat(price) : price;
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
        {/* Render appropriate button based on status and delete_status */}
        {status === 'Out of stock' || status === 'Restocking needed' ? (
          // Render "Restock" button if status is 'Out of stock' or 'Restock'
          <button onClick={handleRestock} className="card__btn card__btn--restock">
            RESTOCK
          </button>
        ) : delete_status === 'unavailable' ? (
          // Render "Bring Back" button if delete_status is 'unavailable'
          <button onClick={handleBringBack} className="card__btn card__btn--bring-back">
            BRING BACK
          </button>
        ) : (
          // Render "Edit Info" button otherwise
          <Link to={`/edit_info_seller_products/${productId}`} className="card__btn card__btn--view-details">
            EDIT INFO
          </Link>
        )}
      </div>
    </div>
  );
};

Card_seller.propTypes = {
  productName: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  stock: PropTypes.number.isRequired,
  status: PropTypes.string.isRequired,
  delete_status: PropTypes.string.isRequired,
};

export default Card_seller;
