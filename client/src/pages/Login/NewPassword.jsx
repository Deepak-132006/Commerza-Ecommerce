import React, { startTransition } from "react";
import Navbar from "../../layouts/Navbar";
import OtpInput from "../../utils/OtpInput";
import Logo_Round from "../../assets/logo/Logo-NoBG.png";
import Info from "../../assets/icons/info.png";
import api from "../../axios/api.js";
import Check from "../../assets/icons/check-mark.png";
import Sending from "../../assets/icons/loading.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [status, setStatus] = useState("verify");
  const [otpLoader, setOtpLoader] = useState(false);
  const [sent, setSent] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      setStatus("processing");
      const res = await api.post("/auth/verify-otp", {
        email,
        otp,
      });

      navigate("/reset");
    } catch (error) {
      setStatus("invalid");
      console.error(error.response?.data?.message || "Invalid OTP");
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setValidEmail(emailRegex.test(email.trim()));
  };

  const handleOtp = async () => {
    try {
      setOtpLoader(true);
      setSent(false);

      const res = await api.post("/auth/forget-password", {
        email,
      });

      setSent(true);
      console.log(res.data?.message);
    } catch (error) {
      console.log(error.response?.data?.message || "Something went wrong!");
    } finally {
      setOtpLoader(false);
    }
  };

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div>
        <div className="mt-10">
          <div>
            <div className="text-center text-5xl font-inter [word-spacing:8px] text-evergreen">
              <p>
                The Art of <br />
                Smart Shopping
              </p>
            </div>
            <div className="text-center mt-3 text-md font-exo text-olive-bark">
              <p>Explore the collection, express yourself</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="mt-5 flex flex-col gap-5 p-6 border-2 border-gray-200 rounded-3xl w-[350px] justify-center m-auto">
            <div>
              <img src={Info} className="w-6 m-auto" alt="" />
            </div>
            <div className="text-center text-lg font-inter text-evergreen">
              <p className="">Reset your password</p>
            </div>
            <div>
              <div className="ml-1"></div>
              <div className="flex flex-col gap-2">
                <input
                  required
                  type="email"
                  placeholder="New Password"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  className="p-3 bg-white border-[2px] rounded-2xl border-gray-200 focus:outline-blue-700 focus:outline-2 w-full"
                />
                <input
                  required
                  type="email"
                  placeholder="Confirm New Password"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    validateEmail(e.target.value);
                  }}
                  className="p-3 bg-white border-[2px] rounded-2xl border-gray-200 focus:outline-blue-700 focus:outline-2 w-full"
                />
              </div>
            </div>
            <div>
              <div>
                <div className="flex flex-col gap-5">
                  <button
                    disabled={status === "processing"}
                    className="p-3 border-2 w-full rounded-lg text-porcelain bg-hunter-green hover:bg-evergreen"
                    onClick={handleVerify}
                  >
                    Set Password
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 flex justify-center">
            <img src={Logo_Round} className="w-10" alt="" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPassword;
