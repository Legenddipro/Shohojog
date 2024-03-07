import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css'; // Importing CSS file

const Cart = () => {
  const navigate = useNavigate(); // Navigate to different routes
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
      alert('Error increasing quantity');
    }
  };  
  
  const decreaseQuantity = async (orderId, productId, oldQuantity) => {
    try {
      const newQuantity = oldQuantity - 1; // Decrease quantity by 1
      if (newQuantity <= 0) {
        // If new quantity is less than or equal to 0, remove the product from the cart
        await removeProductFromCart(orderId, productId);
      } else {
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
      }
    } catch (error) {
      console.error('Error decreasing quantity:', error);
      alert('Error decreasing quantity');
    }
  };
  

  const removeProductFromCart = async (orderId, productId) => {
    try {
      const response = await fetch('http://localhost:5000/customer/remove_from_cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: localStorage.getItem('userId'), product_id: productId })
      });
      if (!response.ok) {
        throw new Error('Failed to remove product from cart');
      }
      fetchCartProducts(); // Fetch updated products after removing product from cart
    } catch (error) {
      console.error('Error removing product from cart:', error);
    }
  };

  const goToReceiptPage = () => {
    navigate('/receipt'); // Navigate to receipt page
  };

  return (
    <div className="cart-container">
      <div className="cart-overlay"></div> {/* Add overlay for blur effect */}
      <div className="cart-content">
        <h1 className="cart-title">Shopping Cart</h1>
        <div className="cart-list">
          {products.map(product => (
            <div className="card" key={`${product.order_id}-${product.product_id}`}>
              <div className="product-info">
                <p className="product-name">{product.product_name}</p>
                <p className="product-price">Price: Tk {product.price}</p>
                <p className="product-category">Category: {product.product_category}</p>
                <p className="product-quantity">Quantity: {product.quantity}</p>
                <p className="product-stock">Available Stock: {product.stock - product.quantity}</p>
              </div>
              <div className="quantity-buttons">
                <button onClick={() => increaseQuantity(product.order_id, product.product_id, product.quantity)}>+</button>
                <button onClick={() => decreaseQuantity(product.order_id, product.product_id, product.quantity)}>-</button>
              </div>
            </div>
          ))}
        </div>
        <button className="confirm-button" onClick={goToReceiptPage}>Confirm Order</button>
      </div>
    </div>
  );
};

export default Cart;
