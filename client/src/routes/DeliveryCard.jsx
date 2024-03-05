import React from "react";

const DeliveryCard = ({ delivery, onConfirm }) => {
  const handleConfirmClick = () => {
    // Call the onConfirm function with the delivery ID
    onConfirm(delivery.order_id);
  };

  return (
    <div className="delivery-card">
      <h3>Order ID: {delivery.order_id}</h3>
      <p>Order Date: {delivery.order_date}</p>
      <p>Delivery Status: {delivery.delivery_status}</p>
      <p>Delivery Date: {delivery.delivery_date}</p>
      <p>Pickup Date: {delivery.pickup_date}</p>
      <button onClick={handleConfirmClick}>Confirm Delivery</button>
    </div>
  );
};

export default DeliveryCard;
