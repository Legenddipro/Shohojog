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
import SellerProducts from "./routes/seller_products";
import ProductDetails from "./routes/ProductDetails";
import My_Profile from "./routes/MyProfile";
import Home_Employee from "./routes/Home_Employee";
import Home_Employee_Customercare from "./routes/Home_Employee_Customercare";
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  async function isAuth() {
    try {
      console.log("Checking authentication status...");
      const response = await fetch("http://localhost:5000/auth/is-verify", {
        method: "GET",
        headers: { jwtToken: localStorage.token },
      });

      const parseRes = await response.json();

      console.log("Authentication status response:", parseRes);

      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error("Error while checking authentication:", err.message);
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
          <Route
            path="/Home_Customer"
            element={
              isAuthenticated &&
              localStorage.getItem("userType") === "customer" ? (
                <Home_Customer setAuth={setAuth} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/Home_Employee"
            element={
              isAuthenticated &&
              localStorage.getItem("userType") === "employee" ? (
                <Home_Employee setAuth={setAuth} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/Home_Employee_Customercare"
            element={
              isAuthenticated &&
              localStorage.getItem("userType") === "employee" &&
              localStorage.getItem("employeeType") === "customer_care" ? (
                <Home_Employee_Customercare setAuth={setAuth} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/Home_seller"
            element={
              isAuthenticated &&
              localStorage.getItem("userType") === "seller" ? (
                <Home_seller setAuth={setAuth} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login setAuth={setAuth} />
              ) : (
                (localStorage.getItem("userType") === "customer" && (
                  <Navigate to="/Home_Customer" />
                )) ||
                (localStorage.getItem("userType") === "seller" && (
                  <Navigate to="/Home_seller" />
                )) ||
                (localStorage.getItem("userType") === "employee" &&
                  // Check employee type
                  ((localStorage.getItem("employeeType") ===
                    "courier_service" && <Navigate to="/Home_Employee" />) ||
                    (localStorage.getItem("employeeType") ===
                      "customer_care" && (
                      <Navigate to="/Home_Employee_Customercare" />
                    )))) || <Navigate to="/error" />
              )
            }
          />
          <Route
            path="/registration"
            element={<Registration setAuth={setAuth} />}
          />
          <Route path="/seller/getSeller" element={<SellerDetails />} />
          // TO GET SELLER PRODUCTS
          <Route path="/seller-products" element={<SellerProducts />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/My_Profile" element={<My_Profile />} />
        </Routes>
      </Router>
    </Fragment>
  );
};

export default App;
