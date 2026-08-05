import React, { useContext, useEffect } from "react";
import Logo from "../assets/logo/Logo-LS-NoBG.png";
import Arrow from "../assets/icons/arrow.png";
import Favorites from "../assets/icons/love.png";
import Product from "../assets/icons/bag.png";
import Cart from "../assets/icons/cart.svg";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { MoreVertical, Package, LogOut } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/login");
  };

  const navLinks = [
    { label: "Products", icon: Product, path: "/products" },
    { label: "Cart", icon: Cart, path: "/cart" },
    { label: "Favorites", icon: Favorites, path: "/favorites" },
  ];

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <div className="relative">
      <div
        className={`${
          !open ? "bg-porcelain" : "bg-white"
        } duration-250 flex justify-between items-center p-6 lg:px-10 lg:py-4 lg:border-b lg:border-soft-fawn/25`}
      >
        {/* Logo */}
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <img src={Logo} className="w-35 -mt-2 lg:w-32 lg:mt-0" alt="" />
        </div>

        {/* Hamburger */}
        <div
          className={`hamburger ${open ? "active" : ""} mr-2 lg:hidden`}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => (
            <button
              key={link.path}
              onClick={() => navigate(link.path)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive(link.path)
                  ? "bg-cwhite text-hunter-green shadow-sm"
                  : "text-olive-bark hover:bg-cwhite/60 hover:text-evergreen"
              }`}
            >
              <img className="w-4 h-4" src={link.icon} alt="" />
              {link.label}
            </button>
          ))}

          <div className="w-px h-6 bg-soft-fawn/40 mx-2" />

          {isLoggedIn ? (
            <div className="relative group">
              <button className="p-2 rounded-full hover:bg-cwhite transition-all">
                <MoreVertical size={22} className="text-olive-bark" />
              </button>

              <div
                className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100
      opacity-0 invisible group-hover:opacity-100 group-hover:visible
      transition-all duration-200 z-50 overflow-hidden"
              >
                <button
                  onClick={() => navigate("/orders")}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left
        hover:bg-gray-50 hover:text-evergreen transition-colors"
                >
                  <Package size={18} />
                  <span>My Orders</span>
                </button>

                <div className="border-t"></div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-left
        text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-2.5 rounded-full text-sm font-medium bg-hunter-green text-cwhite hover:bg-evergreen active:scale-[0.97] transition-all"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="px-6 py-2.5 rounded-full text-sm font-medium border border-olive-bark text-olive-bark hover:bg-evergreen hover:border-evergreen hover:text-cwhite active:scale-[0.97] transition-all"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`absolute left-0 top-full w-full h-fit bg-white z-50
        transition-all duration-300 origin-top overflow-hidden
        ${
          open
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0 pointer-events-none"
        } lg:hidden`}
      >
        <div>
          <div className="hover:-translate-y-1.5 duration-150 mt-5">
            <button
              className="w-full justify-between py-6 px-8 flex items-center cursor-pointer hover:text-olive-bark"
              onClick={() => navigate("/products")}
            >
              <p className="font-sans text-[18px]">Products</p>
              <img src={Arrow} className="w-3" alt="" />
            </button>
            <div className="w-[90%] md:w-[93%] h-[1px] ml-8 bg-gray-300"></div>
          </div>

          <div className="hover:-translate-y-1.5 duration-150">
            <div
              className="py-6 px-8 flex justify-between items-center cursor-pointer hover:-translate-y-1.5 duration-150 hover:text-olive-bark"
              onClick={() => navigate("/cart")}
            >
              <p className="font-sans text-[18px]">Cart</p>
              <img src={Arrow} className="w-3" alt="" />
            </div>
            <div className="w-[90%] md:w-[93%] h-[1px] ml-8 bg-gray-300"></div>
          </div>

          <div className="hover:-translate-y-1.5 duration-150">
            <div
              className="py-6 px-8 flex justify-between items-center cursor-pointer hover:-translate-y-1.5 duration-150 hover:text-olive-bark"
              onClick={() => navigate("/favorites")}
            >
              <p className="font-sans text-[18px]">Favorites</p>
              <img src={Arrow} className="w-3" alt="" />
            </div>
            <div className="w-[90%] md:w-[93%] h-[1px] ml-8 bg-gray-300"></div>
          </div>
          <div className="hover:-translate-y-1.5 duration-150">
            <div
              className="py-6 px-8 flex justify-between items-center cursor-pointer hover:-translate-y-1.5 duration-150 hover:text-olive-bark"
              onClick={() => navigate("/favorites")}
            >
              <p className="font-sans text-[18px]">My Orders</p>
              <img src={Arrow} className="w-3" alt="" />
            </div>
            <div className="w-[90%] md:w-[93%] h-[1px] ml-8 bg-gray-300"></div>
          </div>
        </div>

        <div className="flex justify-center items-center mt-65 mb-10">
          <div className="w-full px-8 flex gap-5 justify-between items-center">
            {isLoggedIn ? (
              <div className="w-full bg-soft-fawn rounded-sm text-porcelain duration-150 hover:text-olive-bark flex items-center justify-center cursor-pointer hover:scale-105">
                <button
                  className="font-sans text-[16px] py-3"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <div
                  className="w-full bg-soft-fawn rounded-sm text-porcelain duration-150 hover:text-olive-bark flex items-center justify-center cursor-pointer hover:scale-105"
                  onClick={() => navigate("/login")}
                >
                  <button className="font-sans text-[16px] py-3">Login</button>
                </div>

                <div
                  className="w-full cursor-pointer border-olive-bark border-2 rounded-sm py-3 bg-cwhite flex items-center justify-center hover:bg-evergreen duration-150 hover:border-white hover:text-cwhite text-pacific-cyan hover:scale-105"
                  onClick={() => navigate("/register")}
                >
                  <button className="font-sans text-[16px]">Register</button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
