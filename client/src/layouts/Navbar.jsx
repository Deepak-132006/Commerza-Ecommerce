import React, { useContext, useEffect, useRef, useState } from "react";
import Logo from "../assets/logo/Logo-LS-NoBG.png";
import Arrow from "../assets/icons/arrow.png";
import Favorites from "../assets/icons/love.png";
import Product from "../assets/icons/bag.png";
import Cart from "../assets/icons/cart.svg";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import { MoreVertical, Package, LogOut, X } from "lucide-react";

const Navbar = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const [open, setOpen] = useState(false); // mobile menu
  const [menuOpen, setMenuOpen] = useState(false); // account dropdown
  const menuRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close account dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close account dropdown on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  localStorage.removeItem("role");

  setIsLoggedIn(false);
  setMenuOpen(false);
  setLoading(false);
  navigate("/login");
};

  const navLinks = [
    { label: "Products", icon: Product, path: "/products" },
    { label: "Cart", icon: Cart, path: "/cart" },
    { label: "Favorites", icon: Favorites, path: "/favorites" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="relative">
      <div
        className={`${
          !open ? "bg-porcelain" : "bg-white"
        } duration-250 flex justify-between items-center p-6 lg:px-10 lg:py-4 lg:border-b lg:border-soft-fawn/25`}
      >
        {/* Logo */}
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <img
            src={Logo}
            className="w-35 -mt-2 lg:w-32 lg:mt-0"
            alt="Store logo"
          />
        </div>

        {/* Hamburger */}
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={`hamburger ${open ? "active" : ""} mr-2 lg:hidden`}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

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

          <div className="w-px h-6 mx-2 bg-soft-fawn/40" />

          {isLoggedIn ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                aria-label="Account menu"
                className={`p-2 rounded-full transition-all ${
                  menuOpen ? "bg-cwhite shadow-sm" : "hover:bg-cwhite/60"
                }`}
              >
                <MoreVertical size={20} className="text-olive-bark" />
              </button>

              {menuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-2 w-52 bg-cwhite rounded-xl shadow-xl border border-soft-fawn/25 overflow-hidden z-50"
                >
                  <button
                    role="menuitem"
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/my-orders");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-evergreen hover:bg-porcelain transition-colors"
                  >
                    <Package size={17} strokeWidth={1.75} />
                    <span>My Orders</span>
                  </button>

                  <div className="border-t border-soft-fawn/20" />

                  <button
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={17} strokeWidth={1.75} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
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

        {/* Mobile menu */}
        <div
          className={`absolute left-0 top-full w-full h-fit bg-cwhite z-50
        transition-all duration-300 origin-top overflow-hidden
        ${open ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0 pointer-events-none"} lg:hidden`}
        >
          <div>
            {[
              { label: "Home", path: "/" },
              { label: "Products", path: "/products" },
              { label: "Cart", path: "/cart" },
              { label: "Favorites", path: "/favorites" },
              { label: "My Orders", path: "/my-orders" },
            ].map((item) => (
              <div
                key={item.path}
                className="hover:-translate-y-1.5 duration-150 mt-5"
              >
                <button
                  className={`w-full justify-between py-6 px-8 flex items-center cursor-pointer ${
                    isActive(item.path)
                      ? "text-hunter-green"
                      : "hover:text-olive-bark"
                  }`}
                  onClick={() => navigate(item.path)}
                >
                  <p className="font-sans text-[18px]">{item.label}</p>
                  <img src={Arrow} className="w-3" alt="" />
                </button>
                <div className="w-[90%] md:w-[93%] h-[1px] ml-8 bg-soft-fawn/30" />
              </div>
            ))}
          </div>

          <div className="flex justify-center items-center mt-16 mb-10">
            <div className="w-full px-8 flex gap-5 justify-between items-center">
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="w-full bg-soft-fawn rounded-full text-porcelain duration-150 hover:text-olive-bark flex items-center justify-center cursor-pointer hover:scale-105 py-3"
                >
                  <span className="font-sans text-[16px]">Logout</span>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full bg-soft-fawn rounded-full text-porcelain duration-150 hover:text-olive-bark flex items-center justify-center cursor-pointer hover:scale-105 py-3"
                  >
                    <span className="font-sans text-[16px]">Login</span>
                  </button>

                  <button
                    onClick={() => navigate("/register")}
                    className="w-full cursor-pointer border-olive-bark border-2 rounded-full py-3 bg-cwhite flex items-center justify-center hover:bg-evergreen duration-150 hover:border-evergreen hover:text-cwhite text-olive-bark hover:scale-105"
                  >
                    <span className="font-sans text-[16px]">Register</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
