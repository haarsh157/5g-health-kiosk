import React from "react";
import { useNavigate } from "react-router-dom";
import lang from "../assets/Vector.png";
import user from "../assets/user.png";
import miniuser from "../assets/mingcute_user-2-fill.png";
import pass from "../assets/mdi_password.png";
import back from "../assets/mdi_arrow-back-circle.png";

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Main Content Container - Increased height */}
      <div className="w-full max-w-xl p-12 rounded-xl bg-[#00999524] backdrop-blur-sm border border-white/30 shadow-2xl flex flex-col items-center min-h-[600px] justify-center">
        {/* Centered User Image - Made larger */}
        <img src={user} alt="user" className="w-32 h-32 mb-8" />

        {/* Login Form - Centered with max-width */}
        <form className="w-full space-y-8 max-w-md mx-auto">
          {/* Username/Email Field */}
          <div className="relative">
            <div className="relative">
              <img
                src={miniuser}
                alt="miniuser"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f96] focus:border-transparent bg-blue-50"
                placeholder="Enter Username, Ph. Number or Email Id."
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="relative">
            <div className="relative">
              <img
                src={pass}
                alt="pass"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f96] focus:border-transparent bg-blue-50"
                placeholder="Password"
              />
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-4 px-6 rounded-full text-3xl shadow-md text-white font-semibold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer bg-[#009f96] hover:bg-[#008a82] mt-8"
          >
            Log In
          </button>
        </form>
      </div>

      {/* Back Button - Bottom left corner */}
      <button
        onClick={() => navigate("/health-kiosk")}
        className="fixed bottom-8 left-8 p-2 rounded-full hover:bg-[#009f96]/20 transition-colors duration-200 cursor-pointer"
      >
        <img src={back} alt="Back" className="w-16 h-16" />
      </button>

      {/* Change Language Button - Bottom right corner */}
      <button className="fixed bottom-8 right-8 bg-[#009f96] hover:bg-[#008a82] text-white font-medium py-3 px-6 rounded-full shadow-md transition-colors duration-200 flex items-center gap-2 text-2xl cursor-pointer">
        <img src={lang} alt="Language" className="w-5 h-5" />
        <span>Change Language</span>
      </button>
    </div>
  );
}
