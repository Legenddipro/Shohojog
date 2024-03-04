// MyProfile.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyProfile.css'; // Import the CSS file for styling

const MyProfile = () => {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Read user_id from localStorage
    if (!userId) {
      setError('User ID not found in localStorage');
      setLoading(false);
      return;
    }

    const fetchCustomerProfile = async () => {
      try {
        const response = await fetch(`http://localhost:5000/customer/get_customer/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch customer");
        }
        const data = await response.json();
        setCustomerData(data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching customer data');
        setLoading(false);
        console.error('Error:', error);
      }
    };

    fetchCustomerProfile();
  }, []);

  const goBack = () => {
    navigate('/Home_Customer'); // Navigate back to the home page
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
          <button className="option" onClick={goBack}>Go Back</button> {/* Go Back button */}
        </div>
      </div>

      {/* Profile Information */}
      <div className="my-profile-container">
        <div className="profile-info">
          <h2 className="profile-heading">Customer Profile</h2>
          <p>User ID: {customerData.user_id}</p>
          <p>First Name: {customerData.first_name}</p>
          <p>Middle Name: {customerData.middle_name}</p>
          <p>Last Name: {customerData.last_name}</p>
          <p>User Name: {customerData.user_name}</p>
          <p>Contact No: {customerData.contact_no}</p>
          <p>Email: {customerData.e_mail}</p>
          <p>Location Postal Code: {customerData.location_pst_code}</p>
          <p>User Type: {customerData.user_type}</p>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
