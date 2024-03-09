import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyProfile.css"; // Import the CSS file for styling

const MyProfile = () => {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchProductName, setSearchProductName] = useState("");
  const [searchProductCategory, setSearchProductCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRate, setMinRate] = useState("");
  const [maxRate, setMaxRate] = useState("");
  const [searchedProducts, setSearchedProducts] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId"); // Read user_id from localStorage
    if (!userId) {
      setError("User ID not found in localStorage");
      setLoading(false);
      return;
    }

    const fetchCustomerProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/customer/get_customer/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch customer");
        }
        const data = await response.json();
        setCustomerData(data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching customer data");
        setLoading(false);
        console.error("Error:", error);
      }
    };

    fetchCustomerProfile();
  }, []);

  const goBack = () => {
    navigate("/Home_Customer"); // Navigate back to the home page
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/search_product_with_order/${searchOrderId}?productName=${searchProductName}&productCategory=${searchProductCategory}&minPrice=${minPrice}&maxPrice=${maxPrice}&minRate=${minRate}&maxRate=${maxRate}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      const data = await response.json();
      setSearchedProducts(data);
    } catch (error) {
      console.error("Error:", error);
      // Handle error, display error message, etc.
    }
  };

  if (loading) {
    return <div className="loading-text">Loading...</div>;
  }

  if (error) {
    return <div className="error-text">{error}</div>;
  }

  return (
    <div>
      {/* Title Bar */}
      <div className="title-bar">
        <div className="title-section">
          <h1 className="title">Shohojog</h1> {/* Shohojog title */}
        </div>
        <div className="options">
          <button className="option" onClick={goBack}>
            Go Back
          </button>{" "}
          {/* Go Back button */}
        </div>
      </div>

      {/* Profile Information */}
      <div className="my-profile-container">
        <div className="profile-info">
          <h2 className="profile-heading">Customer Profile</h2>
          {/* Display customer profile information */}
          <p>
            Full Name:{" "}
            {`${customerData.first_name} ${
              customerData.middle_name ? customerData.middle_name + " " : ""
            }${customerData.last_name}`}
          </p>
          <p>User Name: {customerData.user_name}</p>
          <p>Contact No: {customerData.contact_no}</p>
          <p>Email: {customerData.e_mail}</p>
          <p>Location Postal Code: {customerData.location_pst_code}</p>
          <p>User Type: {customerData.user_type}</p>
        </div>

        {/* Search Criteria */}
        <div className="search-criteria">
          <input
            type="text"
            placeholder="Order ID"
            value={searchOrderId}
            onChange={(e) => setSearchOrderId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Product Name"
            value={searchProductName}
            onChange={(e) => setSearchProductName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Product Category"
            value={searchProductCategory}
            onChange={(e) => setSearchProductCategory(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min Rate"
            value={minRate}
            onChange={(e) => setMinRate(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Rate"
            value={maxRate}
            onChange={(e) => setMaxRate(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>

        {/* Display Searched Products */}
        {searchedProducts.length > 0 && (
          <div className="searched-products">
            <h3>Searched Products</h3>
            <ul>
              {searchedProducts.map((product) => (
                <li key={product.product_id}>{product.product_name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
