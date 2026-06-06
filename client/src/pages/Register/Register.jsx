import React from "react";
import Navbar from "../../layouts/Navbar";
import Logo_Round from "../../assets/logo/Logo-NoBG.png"
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
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
          <div className="mt-5 flex flex-col gap-5 p-8 border-2 border-gray-200 rounded-3xl w-[400px] justify-center m-auto">
            <div>
              <input
                required
                type="text"
                placeholder="Enter your name"
                className="p-3 bg-white border-[2px] rounded-2xl border-gray-200 focus:outline-hunter-green focus:outline-2  w-full"
              />
            </div>
            <div>
              <input
                required
                type="email"
                placeholder="Enter your email"
                className="p-3 bg-white border-[2px] rounded-2xl border-gray-200 focus:outline-hunter-green focus:outline-2 w-full"
              />
            </div>
            <div>
              <input
                required
                type="password"
                placeholder="Choose your password"
                className="p-3 bg-white border-[2px] rounded-2xl border-gray-200 focus:outline-hunter-green focus:outline-2 w-full"
              />
            </div>
            <div>
              <button className="w-full bg-hunter-green p-3 text-[16px] text-porcelain rounded-md hover:bg-evergreen hover:cursor-pointer">
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
          </div>
        </div>
        <div>
          <div className="mt-7 flex justify-center">
            <img src={Logo_Round} className="w-10" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
