import React from 'react'
import { Route, Routes, Link } from "react-router-dom"
import Login from "../src/pages/Login/Login.jsx"
import Register from "../src/pages/Register/Register.jsx"
import Profile from "../src/pages/Profile/Profile.jsx"
import Product from "../src/pages/Product/Product.jsx"
import Cart from "../src/pages/Cart/Cart.jsx"
import Checkout from "../src/pages/Checkout/Checkout.jsx"
import Home from "../src/pages/Home/Home.jsx"
import Favourites from './pages/Favourites/Favourites.jsx'
import ForgetPassword from './pages/Login/ForgetPassword.jsx'
import NewPassword from './pages/Login/NewPassword.jsx'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/forget' element={<ForgetPassword/>}/>
        <Route path='/reset' element={<NewPassword/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/products' element={<Product/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/checkout' element={<Checkout/>}/>
        <Route path='/favorites' element={<Favourites/>}/>
      </Routes>
    </div>
  );
}

export default App