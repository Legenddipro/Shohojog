import React, { useState, useEffect } from 'react';
import './Cart.css'; // Importing CSS file

const Cart = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchCartProducts();
  }, []);

  const fetchCartProducts = async () => {
    try {
      // Fetch products from backend based on userId in localStorage
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:5000/customer/orders/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const increaseQuantity = async (orderId, productId, oldQuantity) => {
    try {
      const newQuantity = oldQuantity + 1; // Increase quantity by 1
      const response = await fetch('http://localhost:5000/customer/update_quantity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId, productId, newQuantity })
      });
      if (!response.ok) {
        throw new Error('Failed to increase quantity');
      }
      fetchCartProducts(); // Fetch updated products after increasing quantity
    } catch (error) {
      console.error('Error increasing quantity:', error);
    }
  };  

  const decreaseQuantity = async (orderId, productId, oldQuantity) => {
    try {
      const newQuantity = oldQuantity - 1; // Decrease quantity by 1
      if (newQuantity < 1) return; // Ensure quantity doesn't become negative
      const response = await fetch('http://localhost:5000/customer/update_quantity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ orderId, productId, newQuantity })
      });
      if (!response.ok) {
        throw new Error('Failed to decrease quantity');
      }
      fetchCartProducts(); // Fetch updated products after decreasing quantity
    } catch (error) {
      console.error('Error decreasing quantity:', error);
    }
  };

  const goToReceiptPage = () => {
    // Logic to navigate to the receipt page
  };

  return (
    <div className="cart-container">
      <h2>Cart</h2>
      {products.map(product => (
        <div className="card" key={`${product.order_id}-${product.product_id}`}>
          <p>Name: {product.product_name}</p>
          <p>Price: Tk {product.price}</p>
          <p>Category: {product.product_category}</p>
          <p>Quantity: {product.quantity}</p>
          <button onClick={() => increaseQuantity(product.order_id, product.product_id, product.quantity)}>+</button>
          <button onClick={() => decreaseQuantity(product.order_id, product.product_id, product.quantity)}>-</button>
        </div>
      ))}
      <button onClick={goToReceiptPage}>Confirm</button>
    </div>
  );
};

export default Cart;
