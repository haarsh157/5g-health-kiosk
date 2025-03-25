import React from "react";
import { useNavigate } from "react-router-dom";
import lang from "../../assets/Vector.png";
import userheight from "../../assets/height.png";
import back from "../../assets/mdi_arrow-back-circle.png";

export default function HeightMeasurement() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Main Content Container */}
      <div className="w-full max-w-4xl min-h-[80%] p-10 rounded-xl flex flex-col items-center justify-center bg-[#00999524] backdrop-blur-sm border border-white/30 shadow-2xl">
        {/* Main Title */}
        <h1 className="text-4xl font-extrabold text-[#005553BF] mb-12 font-sans">
          Height Measurement
        </h1>

        {/* Services Grid - Dynamic layout */}
        <div className="flex">
          <img src={userheight} alt="Language" />
          <div className="flex flex-col items-center gap-4 w-[50%] justify-center">
            <h2 className="text-2xl font-bold text-center text-[#005553BF]">
              Stand Exactly below the Height Measurement Sensor
            </h2>
            <button className="h-50 w-50 rounded-full bg-[#005553BF] text-white text-2xl font-bold hover:bg-[#009f96] transition-colors duration-200 cursor-pointer">
              Click Here To Continue
            </button>
          </div>
        </div>
      </div>

       <button
              onClick={() => navigate("/home")}
              className="fixed bottom-8 left-8 p-2 rounded-full hover:bg-[#009f96]/20 transition-colors duration-200 cursor-pointer"
            >
              <img src={back} alt="Back" className="w-16 h-16" />
            </button>

      {/* Language Button */}
      <button className="fixed bottom-8 right-8 bg-[#009f96] hover:bg-[#008a82] text-white font-medium py-3 px-6 rounded-full shadow-md transition-colors duration-200 flex items-center gap-2 text-2xl cursor-pointer">
        <img src={lang} alt="Language" className="w-5 h-5" />
        <span>Change Language</span>
      </button>
    </div>
  );
}
