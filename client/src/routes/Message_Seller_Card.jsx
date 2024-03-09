//Arian
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './Message_Seller_Card.css'; // Import CSS file

const Message_Seller_Card = ({ orderid, products, onAccept }) => {
  const [pickupDate, setPickupDate] = useState(""); // State for pickup date
  
  

  const handleConfirmPickup = () => {
    // Pass order ID and pickup date to the parent component
    onAccept(orderid, pickupDate);
  };

  return (
    <div className="message-seller-card">
      {/* Order Information */}
      <div className="order-info">
        <h2>Order: #{orderid}</h2> {/* Display the order ID */}
      </div>

      {/* Product Information */}
      <div className="product-info">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div key={product.productId}>
              <h3>{product.productName}</h3>
              <p>Category: {product.category}</p>
              <p>Quantity: {product.quantity}</p>
            </div>
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>

      {/* Pickup Date Input */}
      <div className="pickup-section">
        <label htmlFor="pickup-date">Pickup Date:</label>
        <input
          id="pickup-date"
          type="date"
          value={pickupDate}
          onChange={(e) => setPickupDate(e.target.value)}
          className="pickup-date-input"
        />
      </div>

      {/* Confirm Pickup Button */}
      <div className="actions">
        <button className="confirm-pickup-button" onClick={handleConfirmPickup}>
          Confirm Pickup
        </button>
      </div>
    </div>
  );
};

Message_Seller_Card.propTypes = {
  orderid: PropTypes.number.isRequired,
  products: PropTypes.arrayOf(
    PropTypes.shape({
      productId: PropTypes.number.isRequired,
      productName: PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  onAccept: PropTypes.func.isRequired,
};

export default Message_Seller_Card;
