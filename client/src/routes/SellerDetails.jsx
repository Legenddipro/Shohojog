//Prachurja
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SellerDetails.css'; // Import the CSS file for styling

const SellerDetailsPackage = () => {
  const [seller, setSeller] = useState(null);
  const { userId } = useParams();
  const id = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await fetch(`http://localhost:5000/seller/getSeller/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch seller");
        }
        const jsonData = await response.json();
        setSeller(jsonData);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchSeller();
  }, [userId, id]);

  const goBack = () => {
    navigate('/Home_Seller'); // Navigate back to the home page for sellers
  };

  if (!seller) return <div>Loading...</div>;

  return (
    <div className="seller-details-package-container">
      {/* Title Bar */}
      <div className="title-bar">
        <div className="title-section">
          <h1 className="title">Shohojog</h1> {/* Shohojog title */}
        </div>
        <div className="options">
          <button className="option" onClick={goBack}>Go Back</button> {/* Go Back button */}
        </div>
      </div>

      {/* Seller Details */}
      <div className="seller-details-container">
        <h2 className="seller-details-heading">Seller Details</h2>
        <p>TIN: {seller.tin}</p>
        <p>Website: {seller.website}</p>
        <p>Factory Address: {seller.factory_address}</p>
        <p>Office Address: {seller.office_address}</p>
      </div>
    </div>
  );
};

export default SellerDetailsPackage;
