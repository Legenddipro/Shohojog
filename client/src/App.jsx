import React, { Fragment, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Home_Customer from "./routes/Home_Customer";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Registration from "./routes/Registration";
import Home_seller from "./routes/Home_seller";
import SellerDetails from "./routes/SellerDetails";
import SellerProducts from  "./routes/seller_products";
import ProductDetails from "./routes/ProductDetails";
import My_Profile from "./routes/MyProfile";
import Home_Employee from "./routes/Home_Employee";
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
    try {
      const response = await fetch("http://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: { jwtToken: localStorage.token },
      });

      const parseRes = await response.json();

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    isAuth();
  }, []);

  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Cart" element={<Home />} />
          <Route
            path="/Home_Customer"
            element={
              isAuthenticated ? (
                <Home_Customer setAuth={setAuth} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/Home_Employee"
            element={
              isAuthenticated ? (
                <Home_Employee setAuth={setAuth} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/Home_seller"
            element={
              isAuthenticated ? (
                <Home_seller setAuth={setAuth} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/login"
            element={<Login setAuth={setAuth} />} // Pass setUserType to Login
          />
          <Route
            path="/registration"
            element={
              !isAuthenticated ? (
                <Registration setAuth={setAuth} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/seller/getSeller" element={< SellerDetails />} />
            // TO GET SELLER PRODUCTS
            <Route path="/seller-products" element={<  SellerProducts/>} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/My_Profile" element={<My_Profile />} />
        </Routes>
      </Router>
    </Fragment>
  );
};

export default App;
