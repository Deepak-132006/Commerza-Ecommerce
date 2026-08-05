import React from "react";
import { Route, Routes, Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "../src/pages/Login/Login.jsx";
import Register from "../src/pages/Register/Register.jsx";
import Profile from "../src/pages/Profile/Profile.jsx";
import Product from "../src/pages/Product/Product.jsx";
import Cart from "../src/pages/Cart/Cart.jsx";
import Checkout from "../src/pages/Checkout/Checkout.jsx";
import Home from "../src/pages/Home/Home.jsx";
import Order from "./pages/Order/Order.jsx";
import MyOrders from "./pages/MyOrders/MyOrders.jsx";
import Favourites from "./pages/Favourites/Favourites.jsx";
import ForgetPassword from "./pages/Login/ForgetPassword.jsx";
import NewPassword from "./pages/Login/NewPassword.jsx";
import ProtectedRoutes from "./services/ProtectedRoutes.jsx";

const App = () => {
  return (
    <div>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget" element={<ForgetPassword />} />
        <Route path="/reset" element={<NewPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/products" element={<Product />} />
        <Route
          path="/products/category/:categoryId"
          element={
            <ProtectedRoutes>
              <Product />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoutes>
              <Cart />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoutes>
              <Checkout />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/orders/:orderId"
          element={
            <ProtectedRoutes>
              <Order />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/favorites"
          element={
            <ProtectedRoutes>
              <Favourites />
            </ProtectedRoutes>
          }
        />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoutes>
              <MyOrders />
            </ProtectedRoutes>
          }
        />
      </Routes>
    </div>
  );
};

export default App;
