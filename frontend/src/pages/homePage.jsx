import React from "react";
import { useNavigate } from "react-router-dom";
import userheight from "../assets/mdi_human-male-height.png";
import weight from "../assets/weight.png";
import lang from "../assets/Vector.png";
import oximeter from "../assets/Group.png";
import temp from "../assets/carbon_temperature-feels-like.png";
import tests from "../assets/fluent-mdl2_test-case.png";
import doctor from "../assets/fontisto_doctor.png";

export default function Homepage() {
  const navigate = useNavigate();

  const services = [
    { id: 1, name: "Height Measurement", icon: userheight, path: "/height" },
    { id: 2, name: "Weight", icon: weight, path: "/weight" },
    { id: 3, name: "Temperature", icon: temp, path: "/temperature" },
    { id: 4, name: "Oximeter", icon: oximeter, path: "/oximeter" },
    { id: 5, name: "Medical Tests", icon: tests, path: "/tests" },
    { id: 6, name: "Doctor Consultation", icon: doctor, path: "/consultation" },
  ];

  const handleServiceClick = (path) => {
    navigate(path);
  };

  const getGridLayout = () => {
    const count = services.length;
    
    if (count <= 3) {
      return "grid-cols-3";
    } 
    else if (count === 4) {
      return "grid-cols-2"; 
    }
    else if (count === 6) {
      return "grid-cols-3"; 
    }
    else {
      return "grid-cols-3"; 
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Main Content Container */}
      <div className="w-full max-w-4xl min-h-[80%] p-10 rounded-xl flex flex-col items-center justify-center bg-[#00999524] backdrop-blur-sm border border-white/30 shadow-2xl">
        {/* Main Title */}
        <h1 className="text-4xl font-bold text-gray-800 mb-12 font-sans tracking-tight">
          Select a Service
        </h1>

        {/* Services Grid - Dynamic layout */}
        <div className={`w-full grid ${getGridLayout()} gap-6 place-items-center`}>
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service.path)}
              className="w-full min-h-40 flex flex-col items-center justify-center p-6 bg-[#00999524] rounded-3xl border border-white/20 cursor-pointer hover:bg-[#00999535] transition-all duration-200 hover:shadow-md"
            >
              <img src={service.icon} alt={service.name} className="w-20 h-20 mb-3 object-contain" />
              <h2 className="text-xl font-semibold text-gray-700 text-center">
                {service.name}
              </h2>
            </div>
          ))}
        </div>
      </div>

      {/* Language Button */}
      <button className="fixed bottom-8 right-8 bg-[#009f96] hover:bg-[#008a82] text-white font-medium py-3 px-6 rounded-full shadow-md transition-colors duration-200 flex items-center gap-2 text-2xl cursor-pointer">
        <img src={lang} alt="Language" className="w-5 h-5" />
        <span>Change Language</span>
      </button>
    </div>
  );
}