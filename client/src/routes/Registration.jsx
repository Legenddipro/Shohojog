import React, { Fragment, useState, useEffect } from 'react';
import './Registration.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Registration = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    user_name: '',
    user_password: '',
    contact_no: '',
    e_mail: '',
    location_pst_code: '',
    street: '',
    area: '',
    town: '',
    user_type: '',
    TIN: '',
    Website: '',
    factory_address: '',
    office_address: '',
    salary: '',
    employee_type: '',
    delivery_pst_code: '', // New field for delivery postal code
    vehicle_type: '' // New field for vehicle type
  });

  const [pstCodes, setPstCodes] = useState([]); // State to store available postal codes

  useEffect(() => {
    // Fetch available postal codes when component mounts
    fetchPstCodes();
  }, []);

  const fetchPstCodes = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/locations');
      const data = await response.json();
      setPstCodes(data);
    } catch (error) {
      console.error('Error fetching postal codes:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message);
        window.location.href = '/login';
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  const renderAdditionalFields = () => {
    if (formData.user_type === 'seller') {
      return (
        <Fragment>
          <input className="registration-input" type="text" name="TIN" placeholder="TIN" onChange={handleChange} value={formData.TIN} required />
          <input className="registration-input" type="text" name="Website" placeholder="Website" onChange={handleChange} value={formData.Website} />
          <input className="registration-input" type="text" name="factory_address" placeholder="Factory Address" onChange={handleChange} value={formData.factory_address} />
          <input className="registration-input" type="text" name="office_address" placeholder="Office Address" onChange={handleChange} value={formData.office_address} />
        </Fragment>
      );
    } else if (formData.user_type === 'employee') {
      return (
        <Fragment>
          <input className="registration-input" type="number" name="salary" placeholder="Salary" onChange={handleChange} value={formData.salary} required />
          <select className="registration-input" name="employee_type" onChange={handleChange} value={formData.employee_type} required>
            <option value="">Select Employee Type*</option>
            <option value="courier_service">Courier Service</option>
            <option value="customer_care">Customer Care</option>
          </select>
          {formData.employee_type === 'courier_service' && (
            <Fragment>
              <select className="registration-input" name="delivery_pst_code" onChange={handleChange} value={formData.delivery_pst_code} required>
                <option value="">Select Delivery Postal Code*</option>
                {pstCodes.map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
              <input className="registration-input" type="text" name="vehicle_type" placeholder="Vehicle Type" onChange={handleChange} value={formData.vehicle_type} />
            </Fragment>
          )}
        </Fragment>
      );
    }
    return null;
  };

  return (
    <Fragment>
      <div className="registration-container">
        <h2 className="registration-title">Create an Account</h2>
        <form className="registration-form" onSubmit={handleSubmit}>
          <input className="registration-input" type="text" name="first_name" placeholder="First Name*" onChange={handleChange} value={formData.first_name} required />
          <input className="registration-input" type="text" name="middle_name" placeholder="Middle Name" onChange={handleChange} value={formData.middle_name} />
          <input className="registration-input" type="text" name="last_name" placeholder="Last Name*" onChange={handleChange} value={formData.last_name} required />
          <input className="registration-input" type="text" name="user_name" placeholder="Username*" onChange={handleChange} value={formData.user_name} required />
          <input className="registration-input" type="password" name="user_password" placeholder="Password*" onChange={handleChange} value={formData.user_password} required />
          <input className="registration-input" type="text" name="contact_no" placeholder="Contact Number*" onChange={handleChange} value={formData.contact_no} required />
          <input className="registration-input" type="email" name="e_mail" placeholder="Email*" onChange={handleChange} value={formData.e_mail} required />
          <input className="registration-input" type="text" name="location_pst_code" placeholder="Location Postal Code*" onChange={handleChange} value={formData.location_pst_code} required />
          <input className="registration-input" type="text" name="street" placeholder="Street" onChange={handleChange} value={formData.street} required />
          <input className="registration-input" type="text" name="area" placeholder="Area" onChange={handleChange} value={formData.area} required />
          <input className="registration-input" type="text" name="town" placeholder="Town" onChange={handleChange} value={formData.town} required />
          <select className="registration-input" name="user_type" onChange={handleChange} value={formData.user_type} required>
            <option value="">Select User Type*</option>
            <option value="seller">Seller</option>
            <option value="customer">Customer</option>
            <option value="employee">Employee</option>
          </select>

          {renderAdditionalFields()}
          <button className="registration-button" type="submit">Register</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </Fragment>
  );
};

export default Registration;
