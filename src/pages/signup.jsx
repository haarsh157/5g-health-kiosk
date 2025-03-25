import React from "react";
import { useNavigate } from "react-router-dom";
import lang from "../assets/Vector.png";
import user from "../assets/user.png";
import pencil from "../assets/icon-park-outline_write.png";
import phone from "../assets/ic_baseline-phone.png";
import email from "../assets/material-symbols_mail-outline.png";
import pass from "../assets/mdi_password.png";
import back from "../assets/mdi_arrow-back-circle.png";

export default function Signup() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="w-full max-w-xl p-12 rounded-xl bg-[#00999524] backdrop-blur-sm border border-white/30 shadow-2xl flex flex-col items-center min-h-[600px] justify-center">
        <img src={user} alt="user" className="w-32 h-32 mb-8" />

        <form className="w-full space-y-8 max-w-md mx-auto">
          <div className="relative">
            <div className="relative">
              <img
                src={pencil}
                alt="pencil"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f96] focus:border-transparent bg-blue-50"
                placeholder="Name"
              />
            </div>
          </div>
          <div className="relative">
            <div className="relative">
              <img
                src={pencil}
                alt="pencil"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f96] focus:border-transparent bg-blue-50"
                placeholder="Username"
              />
            </div>
          </div>
          <div className="relative">
            <div className="relative">
              <img
                src={phone}
                alt="phone"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f96] focus:border-transparent bg-blue-50"
                placeholder="Phone number"
              />
            </div>
          </div>
          <div className="relative">
            <div className="relative">
              <img
                src={email}
                alt="email"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f96] focus:border-transparent bg-blue-50"
                placeholder="Email id, if avilable"
              />
            </div>
          </div>
          <div className="relative">
            <label className="block text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              className="w-full pl-4 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f96] focus:border-transparent bg-blue-50"
              required
            />
          </div>

          <div className="flex flex-col space-y-2">
            <label className="text-lg font-medium text-gray-700">Gender</label>
            <div className="flex space-x-4">
              {["Male", "Female", "Other"].map((gender) => (
                <label
                  key={gender}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="gender"
                    value={gender.toLowerCase()}
                    className="h-5 w-5 text-teal-600 focus:ring-teal-500"
                    required
                  />
                  <span className="text-gray-800">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="relative">
              <img
                src={pass}
                alt="pass"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
              />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#009f96] focus:border-transparent bg-blue-50"
                placeholder="Password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 rounded-full text-3xl shadow-md text-white font-semibold hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer bg-[#009f96] hover:bg-[#008a82] mt-2"
          >
            Sign Up
          </button>
        </form>

      </div>

      <button
        onClick={() => navigate("/health-kiosk")}
        className="fixed bottom-8 left-8 p-2 rounded-full hover:bg-[#009f96]/20 transition-colors duration-200 cursor-pointer"
      >
        <img src={back} alt="Back" className="w-16 h-16" />
      </button>

      <button className="fixed bottom-8 right-8 bg-[#009f96] hover:bg-[#008a82] text-white font-medium py-3 px-6 rounded-full shadow-md transition-colors duration-200 flex items-center gap-2 text-2xl cursor-pointer">
        <img src={lang} alt="Language" className="w-5 h-5" />
        <span>Change Language</span>
      </button>
    </div>
  );
}
