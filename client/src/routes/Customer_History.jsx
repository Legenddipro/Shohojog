import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Customer_History = () => {
  const [unratedOrders, setUnratedOrders] = useState([]);
  const [ratedOrders, setRatedOrders] = useState([]);
  const [showAllUnrated, setShowAllUnrated] = useState(false);
  const [showAllRated, setShowAllRated] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [reviewInputs, setReviewInputs] = useState({});
  const [ratingInputs, setRatingInputs] = useState({});
  const [complaintFormVisible, setComplaintFormVisible] = useState(false);
  const [complaint, setComplaint] = useState("");
  const [complaintOrderId, setComplaintOrderId] = useState(""); // New state to hold order ID
  const [returnOrders, setReturnOrders] = useState([]); // State to hold return orders
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve userId from local storage
    const userId = localStorage.getItem("userId");

    // Fetch unrated orders
    axios
      .get(`http://localhost:5000/customer/unrated_orders/${userId}`)
      .then((response) => {
        setUnratedOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching unrated orders:", error);
      });

    // Fetch rated orders
    axios
      .get(`http://localhost:5000/customer/rated_orders/${userId}`)
      .then((response) => {
        setRatedOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching rated orders:", error);
      });

    // Fetch return orders
    axios
      .get(`http://localhost:5000/customer/get_return_orders`)
      .then((response) => {
        setReturnOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching return orders:", error);
      });
  }, []);

  const goBack = () => {
    navigate("/home_customer"); // Navigate back to Home_Customer component
  };

  const handleShowAllUnrated = () => {
    setShowAllUnrated(true);
  };

  const handleShowAllRated = () => {
    setShowAllRated(true);
  };

  const handleShowLessUnrated = () => {
    setShowAllUnrated(false);
  };

  const handleShowLessRated = () => {
    setShowAllRated(false);
  };

  const rateOrder = (orderId) => {
    // Fetch order details and associated products
    axios
      .get(`http://localhost:5000/customer/order_products/${orderId}`)
      .then((response) => {
        setOrderDetails(response.data);
        console.log("Order details:", response.data);
        console.log("Order ID:", response.data[0].order_id);
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
      });
  };

  const handleReviewChange = (productId, value) => {
    setReviewInputs((prevState) => ({
      ...prevState,
      [productId]: value,
    }));
  };

  const handleRatingChange = (productId, value) => {
    setRatingInputs((prevState) => ({
      ...prevState,
      [productId]: value,
    }));
  };

  const postReviewAndRating = (orderId, productId, review, rating) => {
    // Post review and rating for the specified product in the order
    axios
      .post(`http://localhost:5000/customer/order_review`, {
        orderId,
        productId,
        review,
        rating,
      })
      .then((response) => {
        console.log(response.data);
        // Update product details and disable input fields
        const updatedOrderDetails = orderDetails.map((product) => {
          if (product.product_id === productId) {
            return {
              ...product,
              review: review,
              rating: rating,
            };
          }
          return product;
        });
        setOrderDetails(updatedOrderDetails);

        // Disable the review and rating input fields for the corresponding product
        setReviewInputs((prevState) => ({
          ...prevState,
          [productId]: true,
        }));
        setRatingInputs((prevState) => ({
          ...prevState,
          [productId]: true,
        }));
      })
      .catch((error) => {
        console.error("Error posting review and rating:", error);
      });
  };

  const handleComplaintChange = (event) => {
    setComplaint(event.target.value);
  };

  const handleComplaintSubmit = () => {
    console.log("Complaint submitted:", complaint);
    axios
      .post(`http://localhost:5000/customer/return-order/${complaintOrderId}`, {
        complaint: complaint
      })
      .then((response) => {
        console.log(response.data);
        setComplaintFormVisible(false);
      })
      .catch((error) => {
        console.error("Error submitting complaint:", error);
      });
  };

  const handleComplaintCancel = () => {
    // Cancel the complaint form
    setComplaintFormVisible(false);
  };

  const showComplaintForm = (orderId) => {
    // Show the complaint form
    setComplaintFormVisible(true);
    setComplaintOrderId(orderId); // Hold onto the orderId for submission
  };

  // Function to check if the order is already present in the return orders
  const isOrderInReturnOrders = (orderId) => {
    return returnOrders.some((order) => order.order_id === orderId);
  };

  return (
    <div>
      <div className="title-bar">
        <div className="title-section">
          <h1 className="title">Shohojog</h1>
        </div>
        <div className="options">
          <button className="option" onClick={goBack}>
            Go Back
          </button>
        </div>
      </div>

      <div className="orders">
        <div className="unrated-orders">
          <h2>Unrated Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Payment Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {unratedOrders
                .slice(0, showAllUnrated ? unratedOrders.length : 5)
                .map((order) => (
                  <tr key={order.order_id}>
                    <td>{order.order_id}</td>
                    <td>{order.order_date}</td>
                    <td>{order.payment_date}</td>
                    <td>
                      <button onClick={() => rateOrder(order.order_id)}>
                        Rate Us
                      </button>
                      <button
                        onClick={() =>
                          showComplaintForm(order.order_id)
                        }
                        disabled={isOrderInReturnOrders(order.order_id)} // Disable if order is already in return orders
                      >
                        Return Order
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!showAllUnrated && (
            <button onClick={handleShowAllUnrated}>Show More</button>
          )}
          {showAllUnrated && (
            <button onClick={handleShowLessUnrated}>Show Less</button>
          )}
        </div>

        <div className="rated-orders">
          <h2>Rated Orders</h2>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Payment Date</th>
              </tr>
            </thead>
            <tbody>
              {ratedOrders
                .slice(0, showAllRated ? ratedOrders.length : 5)
                .map((order) => (
                  <tr key={order.order_id}>
                    <td>{order.order_id}</td>
                    <td>{order.order_date}</td>
                    <td>{order.payment_date}</td>
                  </tr>
                ))}
            </tbody>
          </table>
          {!showAllRated && (
            <button onClick={handleShowAllRated}>Show More</button>
          )}
          {showAllRated && (
            <button onClick={handleShowLessRated}>Show Less</button>
          )}
        </div>
      </div>

      {orderDetails.length > 0 && (
        <div className="order-details">
          <h2>Order Details</h2>
          <p>Order ID: {orderDetails[0].order_id}</p>
          <p>Order Date: {orderDetails[0].order_date}</p>
          <p>Payment Date: {orderDetails[0].payment_date}</p>
          <h3>Products</h3>
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                {!orderDetails[0].review && <th>Review</th>}
                {!orderDetails[0].rating && <th>Rating</th>}
                {!orderDetails[0].review_time && <th>Review Time</th>}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.map((product) => (
                <tr key={product.product_id}>
                  <td>{product.product_id}</td>
                  <td>{product.product_name}</td>
                  <td>{product.quantity}</td>
                  <td>{product.price}</td>
                  {!product.review && (
                    <td>
                      <input
                        type="text"
                        placeholder="Enter review"
                        value={reviewInputs[product.product_id] || ""}
                        onChange={(e) =>
                          handleReviewChange(
                            product.product_id,
                            e.target.value
                          )
                        }
                      />
                    </td>
                  )}
                  {!product.rating && (
                    <td>
                      <select
                        value={ratingInputs[product.product_id] || ""}
                        onChange={(e) =>
                          handleRatingChange(
                            product.product_id,
                            parseInt(e.target.value)
                          )
                        }
                      >
                        <option value="">Rate Us (1 to 10)</option>
                        {[...Array(10)].map((_, index) => (
                          <option key={index + 1} value={index + 1}>
                            {index + 1}
                          </option>
                        ))}
                      </select>
                    </td>
                  )}
                  {!product.review_time && <td>{product.review_time}</td>}
                  <td>
                    <button
                      onClick={() =>
                        postReviewAndRating(
                          product.order_id,
                          product.product_id,
                          reviewInputs[product.product_id],
                          ratingInputs[product.product_id]
                        )
                      }
                    >
                      Rate Product
                    </button>
                    <button
                      onClick={() =>
                        showComplaintForm(product.order_id)
                      }
                      disabled={isOrderInReturnOrders(product.order_id)} // Disable if order is already in return orders
                    >
                      Return Order
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {complaintFormVisible && (
        <div className="complaint-form">
          <h2>Return Order Complaint Form</h2>
          <textarea
            placeholder="Enter your complaint here..."
            value={complaint}
            onChange={handleComplaintChange}
          ></textarea>
          <div>
            <button onClick={handleComplaintSubmit}>Submit</button>
            <button onClick={handleComplaintCancel}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customer_History;
