import React, { useState } from "react";
import back from "../assets/mdi_arrow-back-circle.png";
import lang from "../assets/Vector.png";
import user_profile from "../assets/user.png";

const ProfileCard = () => {
  const [weight, setWeight] = useState(76);
  const [height, setHeight] = useState(182);
  const bmi = (weight / ((height / 100) * (height / 100))).toFixed(1);

  const getBmiCategory = (bmi) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 24.9) return "Healthy";
    if (bmi < 30) return "Overweight";
    return "Obesity";
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-[40rem] h-[40rem]">
  
         <div className="top p-10 px-15 flex space-x-5">
             <div className="top-left">
               <h1>
                 <img src={`${user_profile}`} alt="" />
               </h1>
             </div>
             <div className="top-right">
               <h1 className="text-[#003743] font-bold text-3xl">Mr. John Doe</h1>
               <p className="text-[#005553] font-semibold text-2xl">
                 Email : john.doe@gmail.com
               </p>
               <p className="text-[#005553] font-semibold text-2xl">
                 Phone No. : +91 9876542345
               </p>
             </div>
           </div>
           <button className="bg-teal-600 text-white py-1 px-4 rounded mb-4 hover:bg-teal-700">
             Edit Profile
           </button>
        <hr className="mb-4" />

        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-600">weight</p>
            <p className="text-blue-700 font-bold">{weight} kg</p>
          </div>
          <div>
            <p className="text-gray-600">height</p>
            <p className="text-blue-700 font-bold">{height} cm</p>
          </div>
          <div>
            <p className="text-blue-700 font-bold">♂ Male</p>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-blue-700 font-bold text-lg">BMI {bmi}</p>
          <p className="text-gray-600 text-sm">Category: {getBmiCategory(bmi)}</p>
          <div className="relative w-full h-4 mt-2 bg-gray-300 rounded-full">
            <div
              className={`absolute left-0 top-0 h-4 rounded-full ${
                bmi < 18.5
                  ? "bg-red-400 w-[18%]"
                  : bmi < 24.9
                  ? "bg-green-500 w-[32%] left-[18%]"
                  : bmi < 30
                  ? "bg-yellow-400 w-[20%] left-[50%]"
                  : "bg-red-500 w-[30%] left-[70%]"
              }`}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>18.5</span>
            <span>24.9</span>
            <span>30</span>
          </div>
        </div>
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
};

export default ProfileCard;
