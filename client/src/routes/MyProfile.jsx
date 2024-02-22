import React, { useState, useEffect } from 'react';

const MyProfile = () => {
  const [customerData, setCustomerData] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem('userId'); // Read user_id from localStorage
    if (!userId) {
      console.error('User ID not found in localStorage');
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
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchCustomerProfile();
  }, []);

  if (!customerData) return <div>Loading...</div>;

  return (
    <div>
      <h2>Customer Profile</h2>
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
  );
};

export default MyProfile;
