import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import lang from "../../assets/Vector.png";
import userTemperature from "../../assets/Group 9.png";
import back from "../../assets/mdi_arrow-back-circle.png";

const API_BASE_URL = "https://192.168.81.51:5000";

export default function TemperatureMeasurement() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // Uncomment to enable auth redirect
    // if (!token || user?.role !== "PATIENT") {
    //   navigate("/"); 
    // }
  }, [navigate]);

  const [isMeasuring, setIsMeasuring] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [temperature, setTemperature] = useState({
    celsius: 36.5,
    fahrenheit: 97.7,
  });

  const steps = ["Height", "Weight", "Temperature", "Oximeter"];
  const currentStep = 2;

  const handleMeasureClick = async () => {
    setIsMeasuring(true);

    setTimeout(async () => {
      // Generate random temperature in normal range
      const randomCelsius = (Math.random() * (37.2 - 36.1) + 36.1).toFixed(1);
      const fahrenheit = ((randomCelsius * 9) / 5 + 32).toFixed(1);

      setTemperature({
        celsius: randomCelsius,
        fahrenheit: fahrenheit,
      });

      setIsMeasuring(false);
      setShowResult(true);

      // Send data to backend
      try {
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"));

        const updateResponse = await fetch(
          `${API_BASE_URL}/api/temp/update-temperature`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              temperature: randomCelsius,
              userId: user.id,
            }),
          }
        );

        const updateData = await updateResponse.json();

        if (!updateResponse.ok) {
          throw new Error(updateData.error || "Failed to update temperature");
        }
      } catch (err) {
        console.error("Error updating temperature in backend:", err);
      }
    }, 3000); // 3 seconds delay
  };

  const handleContinue = () => {
    navigate("/oximeter");
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Progress Line */}
      <div className="w-full max-w-4xl mb-8 px-4 relative">
        <div className="absolute top-3 left-0 right-0 h-2 bg-gray-300 rounded-full"></div>
        <div
          className="absolute top-3 left-0 h-2 bg-gradient-to-r from-[#009995] to-[#005553] rounded-full transition-all duration-500"
          style={{
            width: `${
              currentStep === 0
                ? "0%"
                : `${(currentStep / (steps.length - 1)) * 100}%`
            }`,
          }}
        ></div>
        <div className="relative flex justify-between items-center">
          {steps.map((step, index) => (
            <div
              key={step}
              className="relative flex flex-col items-center z-10"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 
            ${
              index < currentStep
                ? "bg-[#009995] text-white shadow-lg"
                : index === currentStep
                ? "bg-[#005553] text-white scale-110 shadow-md"
                : "bg-gray-300 text-gray-500"
            }`}
              >
                {index + 1}
              </div>
              <span
                className={`mt-2 text-sm font-medium transition-all duration-300 
          ${index <= currentStep ? "text-[#005553]" : "text-gray-500"}`}
              >
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-4xl min-h-[80%] p-10 rounded-xl flex flex-col items-center justify-center bg-[#00999524] backdrop-blur-sm border border-white/30 shadow-2xl">
        {!isMeasuring && !showResult ? (
          <>
            <h1 className="text-4xl font-extrabold text-[#005553BF] mb-12 font-sans">
              Temperature Measurement
            </h1>
            <div className="flex">
              <img src={userTemperature} alt="Temperature" />
              <div className="flex flex-col items-center gap-4 w-[50%] justify-center">
                <h2 className="text-2xl font-bold text-center text-[#005553BF]">
                  Place your finger on the temperature sensor
                </h2>
                <button
                  onClick={handleMeasureClick}
                  className="h-50 w-50 rounded-full bg-[#005553BF] text-white text-2xl font-bold hover:bg-[#009f96] transition-colors duration-200 cursor-pointer"
                >
                  Click Here To Continue
                </button>
              </div>
            </div>
          </>
        ) : isMeasuring ? (
          <div className="flex flex-col items-center justify-center gap-8">
            <h1 className="text-4xl font-extrabold text-[#005553BF] mb-12 font-sans">
              Temperature Measurement
            </h1>
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div className="absolute w-full h-full rounded-full border-8 border-[#00555340]"></div>
              <div className="absolute w-3/4 h-3/4 rounded-full border-8 border-transparent border-t-[#005553BF] border-r-[#005553BF] animate-spin"></div>
              <div className="absolute text-xl font-bold text-[#005553BF] animate-pulse">
                Scanning...
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center text-[#005553BF]">
              Measuring Temperature...
              <br />
              Keep your finger steady on the sensor
            </h2>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-8 w-full">
            <h1 className="text-4xl font-extrabold text-[#005553BF] mb-4 font-sans">
              Your Temperature Measurement
            </h1>
            <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-8 shadow-lg w-full max-w-md">
              <div className="text-5xl font-bold text-[#005553BF] mb-2">
                {temperature.fahrenheit} °F
              </div>
              <div className="text-3xl text-[#005553BF] mb-6">
                {temperature.celsius} °C
              </div>
            </div>
            <button
              onClick={handleContinue}
              className="mt-8 px-12 py-4 rounded-full bg-[#005553BF] text-white text-2xl font-bold hover:bg-[#009f96] transition-colors duration-200 cursor-pointer shadow-lg"
            >
              Continue to Oximeter Measurement
            </button>
          </div>
        )}
      </div>

      <button
        onClick={() => navigate("/home")}
        className="fixed bottom-8 left-8 p-2 rounded-full hover:bg-[#009f96]/20 transition-colors duration-200 cursor-pointer"
      >
        <img src={back} alt="Back" className="w-16 h-16" />
      </button>

    </div>
  );
}
