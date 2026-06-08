import React, { useState } from "react";
import Logo from "../assets/logo/Logo-LS-NoBG.png";
import Arrow from "../assets/icons/arrow.png";
import Favorites from "../assets/icons/love.png";
import Product from "../assets/icons/bag.png";
import Cart from "../assets/icons/cart.svg";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="relative">
      <div className={` ${!open ? 'bg-porcelain' : 'bg-white'}  duration-250 flex justify-between items-center p-6 `}>
        <div className="">
          <img src={Logo} className="w-35 -mt-2" alt="" />
        </div>
        <div
          className={`hamburger ${open ? "active" : ""} mr-2 lg:hidden`}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="hidden lg:flex gap-15">
          <div className="flex items-center gap-2">
            <img className="w-5 h-5" src={Product} alt="" />
            <p>Products</p>
          </div>
          <div className="flex items-center gap-2">
            <img className="w-6 h-6" src={Cart} alt="" />
            <p>Cart</p>
          </div>
          <div className="flex items-center gap-2">
            <img className="w-5 h-5" src={Favorites} alt="" />
            <p>Favorites</p>
          </div>
          <div className="w-full flex gap-5 justify-between items-center">
            <div
              className="w-full bg-soft-fawn rounded-sm text-porcelain duration-150 hover:text-olive-bark flex items-center justify-center cursor-pointer hover:scale-105"
              onClick={() => {
                navigate("/login");
              }}
            >
              <button className="font-sans text-[16px] py-1.5 cursor-pointer">
                Login
              </button>
            </div>

            <div
              className="w-full cursor-pointer border-olive-bark border-2 rounded-sm py-[5px] bg-cwhite flex items-center justify-center hover:bg-evergreen duration-150 hover:border-white hover:text-cwhite text-pacific-cyan hover:scale-105"
              onClick={() => navigate("/register")}
            >
              <button className="cursor-pointer font-sans text-[16px] ">
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`absolute left-0 top-full w-full h-fit bg-white z-50 
      transition-all duration-300 origin-top
      ${
        open
          ? "scale-y-100 opacity-100"
          : "scale-y-0 opacity-0 pointer-events-none"
      } lg:hidden`}
      >
        <div>
          <div className="hover:-translate-y-1.5 duration-150 mt-5">
            <div className="py-6 px-8 flex justify-between items-center cursor-pointer hover:text-olive-bark">
              <p className="font-sans text-[18px]">Products</p>
              <img src={Arrow} className="w-3" alt="" />
            </div>
            <div className="w-[90%] md:w-[93%] h-[1px] ml-8 bg-gray-300"></div>
          </div>

          <div className="hover:-translate-y-1.5 duration-150">
            <div className="py-6 px-8 flex justify-between items-center cursor-pointer hover:-translate-y-1.5 duration-150 hover:text-olive-bark">
              <p className="font-sans text-[18px]">Cart</p>
              <img src={Arrow} className="w-3" alt="" />
            </div>
            <div className="w-[90%] md:w-[93%] h-[1px] ml-8 bg-gray-300"></div>
          </div>

          <div className="hover:-translate-y-1.5 duration-150">
            <div className="py-6 px-8 flex justify-between items-center cursor-pointer hover:-translate-y-1.5 duration-150 hover:text-olive-bark">
              <p className="font-sans text-[18px]">Favorites</p>
              <img src={Arrow} className="w-3" alt="" />
            </div>
            <div className="w-[90%] md:w-[93%] h-[1px] ml-8 bg-gray-300"></div>
          </div>
        </div>

        <div className="flex justify-center items-center mt-75 mb-15">
          <div className="w-full px-8 flex gap-5 justify-between items-center">
            <div
              className="w-full bg-soft-fawn rounded-sm text-porcelain duration-150 hover:text-olive-bark flex items-center justify-center cursor-pointer hover:scale-105"
              onClick={() => {
                navigate("/login");
              }}
            >
              <button className="font-sans text-[16px] py-3">Login</button>
            </div>

            <div
              className="w-full cursor-pointer border-olive-bark border-2 rounded-sm py-3 bg-cwhite flex items-center justify-center hover:bg-evergreen duration-150 hover:border-white hover:text-cwhite text-pacific-cyan hover:scale-105"
              onClick={() => navigate("/register")}
            >
              <button className="font-sans text-[16px]">Register</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
