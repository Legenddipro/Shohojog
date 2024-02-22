import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const SellerDetails = () => {
  const [seller, setSeller] = useState(null);
  const { userId } = useParams();
  const id = localStorage.getItem('userId');

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const response = await fetch(`http://localhost:5000/seller/getSeller/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch seller");
        }
        const jsonData = await response.json();
        console.log(jsonData);
        setSeller(jsonData);
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchSeller();
  }, [userId, id]);

  if (!seller) return <div>Loading...</div>;

  return (
    <div>
      <h2>Seller Details</h2>
      <p>TIN: {seller.tin}</p>
      <p>Website: {seller.website}</p>
      <p>Factory Address: {seller.factory_address}</p>
      <p>Office Address: {seller.office_address}</p>
    </div>
  );
};

export default SellerDetails;
