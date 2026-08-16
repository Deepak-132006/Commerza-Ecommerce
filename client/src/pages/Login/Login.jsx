import React, { useContext } from "react";
import Navbar from "../../layouts/Navbar";
import { useNavigate } from "react-router-dom";
import Logo_Round from "../../assets/logo/Logo-NoBG.png";
import { useState } from "react";
import Show from "../../assets/icons/show.png";
import Hide from "../../assets/icons/hide.png";
import api from "../../axios/api";
import toast from "react-hot-toast";
import { AuthContext } from "../../context/AuthProvider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setIsLoggedIn } = useContext(AuthContext);
  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/~`])[A-Za-z\d@$!%*?&^#()_+\-=\[\]{};':"\\|,.<>\/~`]{8,}$/;

    setValidPassword(regex.test(password));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValidEmail(emailRegex.test(email));
  };

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("role", res.data.role);

      setIsLoggedIn(true);
      toast.success("Welcome back");
      navigate("/");
      setLoading(false);
    } catch (error) {
      toast.error("User doesn't exist");
      console.log(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center bg-porcelain">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-soft-fawn border-t-hunter-green animate-spin" />
            <p className="text-olive-bark text-sm tracking-wide">Loading…</p>
          </div>
        </div>
      </>
    );
  }
  return (
    <div className="bg-porcelain h-screen">
      <div>
        <Navbar />
      </div>
      <div>
        <div className="mt-10">
          <div>
            <div className="text-center text-5xl font-inter [word-spacing:8px]">
              <p>
                The Art of <br />
                Smart Shopping
              </p>
            </div>
            <div className="text-center mt-3 text-md font-exo">
              <p>Explore the collection, express yourself</p>
            </div>
          </div>
          <form className="mt-5 flex flex-col gap-5 p-8 border-2 border-gray-200 rounded-3xl w-[350px] justify-center m-auto">
            <div>
              <div>
                {email.length > 0 && !validEmail && (
                  <p className="text-[12px] text-red-600 font-exo m-2 ">
                    Invalid email id
                  </p>
                )}
              </div>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
                placeholder="Enter your email"
                className="p-3 bg-white border-[2px] rounded-2xl border-gray-200 focus:outline-blue-700 focus:outline-2 w-full"
              />
            </div>
            <div>
              <div>
                {password.length > 0 && !validPassword && (
                  <p className="text-[12px] text-red-600 font-exo m-2 ">
                    Include letters, numbers & special symbols {"(8 - 12)"}
                  </p>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    validatePassword(e.target.value);
                  }}
                  placeholder="Choose your password"
                  className="p-3 pr-10 bg-white border-2 rounded-2xl border-gray-200 w-full focus:outline-blue-700 focus:outline-2"
                />

                <button
                  type="button"
                  onClick={togglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <img className="w-5" src={Show} alt="" />
                  ) : (
                    <img className="w-5" src={Hide} alt="" />
                  )}
                </button>
              </div>
            </div>
            <div className="m-auto">
              <p className="text-[14px]">
                Forget Password?{" "}
                <span
                  className="underline text-hunter-green cursor-pointer"
                  onClick={() => navigate("/forget")}
                >
                  click here
                </span>
              </p>
            </div>
            <div>
              <button
              type="submit"
                className="w-full bg-hunter-green p-3 text-[16px] text-porcelain rounded-md hover:bg-evergreen hover:cursor-pointer"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
            <div>
              <p className="flex gap-1 justify-center">
                Don't have an account?{" "}
                <span
                  className="underline hover:cursor-pointer decoration-1.5 decoration-hunter-green text-hunter-green "
                  onClick={() => navigate("/register")}
                >
                  register
                </span>
              </p>
            </div>
          </form>
        </div>
        <div>
          <div className="mt-10 flex justify-center">
            <img src={Logo_Round} className="w-10" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
