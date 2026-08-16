import React, { useState } from "react";
import Navbar from "../../layouts/Navbar";
import Logo_Round from "../../assets/logo/Logo-NoBG.png";
import Show from "../../assets/icons/show.png";
import Hide from "../../assets/icons/hide.png";
import { useNavigate } from "react-router-dom";
import api from "../../axios/api.js";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validName, setValidName] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(true);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const togglePassword = () => {
    setShowPassword((prev) => !prev);
  };

  const validateName = (name) => {
    const regex = /^[A-Za-z]+$/;
    setValidName(regex.test(name));
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

  const handleRegister = async () => {
    try {
      setLoader(true);
      const res = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      navigate("/login");
      console.log(res.data.message);
    } catch (error) {
      console.error(error);
    } finally {
      setLoader(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex items-center justify-center bg-porcelain">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-soft-fawn border-t-hunter-green animate-spin" />
            <p className="text-olive-bark text-sm tracking-wide">
              Loading your orders…
            </p>
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
        <div className="mt-5">
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
          <form className="mt-5 flex flex-col gap-5 p-6 border-2 border-gray-200 rounded-3xl w-[400px] justify-center m-auto">
            <div>
              <div>
                {name.length > 0 && !validName && (
                  <p className="text-[12px] text-red-600 font-exo m-2 ">
                    Invalid name
                  </p>
                )}
              </div>
              <input
                required
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  validateName(e.target.value);
                }}
                className="p-3 bg-white border-[2px] rounded-2xl border-gray-200 focus:outline-blue-700 focus:outline-2 w-full"
              />
            </div>
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
                type="text"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmail(e.target.value);
                }}
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
                  className="p-3 pr-10 bg-white border-2 rounded-2xl border-gray-200 focus:outline-blue-700 focus:outline-2 w-full"
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
            <div>
              <button
              type="submit"
                className="w-full bg-hunter-green p-3 text-[16px] text-porcelain rounded-md hover:bg-evergreen hover:cursor-pointer"
                onClick={handleRegister}
              >
                Register
              </button>
            </div>
            <div>
              <p className="flex gap-1 justify-center">
                Already have an account?{" "}
                <span
                  className="underline hover:cursor-pointer decoration-1.5 decoration-hunter-green text-hunter-green "
                  onClick={() => navigate("/login")}
                >
                  login
                </span>
              </p>
            </div>
          </form>
        </div>
        <div>
          <div className="flex justify-center bg-porcelain">
            <img src={Logo_Round} className="w-10 m-7" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
