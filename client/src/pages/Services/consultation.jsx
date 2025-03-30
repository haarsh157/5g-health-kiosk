import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import lang from "../../assets/Vector.png";
import back from "../../assets/mdi_arrow-back-circle.png";

const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "General Physician",
    experience: "12 years",
    image: "https://example.com/doctor1.jpg",
    rating: 4.9,
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Cardiologist",
    experience: "8 years",
    image: "https://example.com/doctor2.jpg",
    rating: 4.8,
  },
  // Add more doctors as needed
];

export default function ConsultationPage() {
  const navigate = useNavigate();

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || user?.role !== "PATIENT") {
      navigate("/"); // Redirect to login if not authenticated as patient
    }
  }, [navigate]);

  const [isLoading, setIsLoading] = useState(false);
  const [consultationStarted, setConsultationStarted] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const startConsultation = () => {
    setIsLoading(true);
    // Simulate doctor matching delay
    setTimeout(() => {
      const randomDoctor = doctors[Math.floor(Math.random() * doctors.length)];
      setSelectedDoctor(randomDoctor);
      setIsLoading(false);
      setConsultationStarted(true);
    }, 3000);
  };

  const endConsultation = () => {
    setConsultationStarted(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Main Content Container */}
      <div className="w-full max-w-4xl min-h-[80%] p-10 rounded-xl flex flex-col items-center justify-center bg-[#00999524] backdrop-blur-sm border border-white/30 shadow-2xl">
        {!consultationStarted ? (
          <>
            <h1 className="text-4xl font-extrabold text-[#005553BF] mb-8 font-sans">
              Video Consultation
            </h1>

            {!isLoading ? (
              <div className="flex flex-col items-center gap-8">
                <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
                  <h2 className="text-2xl font-bold text-[#005553BF] mb-4">
                    Available Doctors
                  </h2>
                  <p className="text-lg text-[#005553BF] mb-6">
                    Connect instantly with experienced medical professionals
                  </p>
                  <button
                    onClick={startConsultation}
                    className="px-12 py-4 rounded-full bg-[#009f96] text-white text-2xl font-bold hover:bg-[#008a82] transition-colors duration-200 cursor-pointer shadow-lg"
                  >
                    Start Consultation
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-8">
                <div className="relative w-64 h-64 flex items-center justify-center">
                  <div className="absolute w-full h-full rounded-full border-8 border-[#00555340]"></div>
                  <div className="absolute w-3/4 h-3/4 rounded-full border-8 border-transparent border-t-[#005553BF] border-r-[#005553BF] animate-spin"></div>
                  <div className="absolute text-xl font-bold text-[#005553BF] text-center">
                    Searching for available doctors...
                  </div>
                </div>
                <p className="text-lg text-[#005553BF] text-center">
                  Please wait while we connect you with a certified medical
                  professional
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg w-full">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={selectedDoctor.image}
                  alt="Doctor"
                  className="w-16 h-16 rounded-full border-2 border-[#009f96]"
                />
                <div>
                  <h2 className="text-2xl font-bold text-[#005553BF]">
                    {selectedDoctor.name}
                  </h2>
                  <p className="text-lg text-[#005553BF]">
                    {selectedDoctor.specialty} • {selectedDoctor.experience}{" "}
                    experience
                  </p>
                </div>
              </div>

              {/* Video Container */}
              <div className="relative bg-gray-200 rounded-xl h-96 w-full overflow-hidden">
                {/* Doctor Video Feed */}
                <div className="absolute inset-0 bg-gray-400 flex items-center justify-center">
                  <span className="text-white text-xl">
                    Doctor's Video Feed
                  </span>
                </div>

                {/* User Video Preview */}
                <div className="absolute bottom-4 right-4 w-32 h-32 bg-gray-600 rounded-lg overflow-hidden">
                  <span className="text-white text-sm flex items-center justify-center h-full">
                    Your Video
                  </span>
                </div>
              </div>

              {/* Call Controls */}
              <div className="flex justify-center gap-6 mt-6">
                <button className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M19 11h-8v2h8v-2z" />
                  </svg>
                </button>
                <button
                  onClick={endConsultation}
                  className="p-4 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.23-2.66 2.08-.19.2-.19.51 0 .71.2.2.51.2.71 0 .69-.72 1.48-1.34 2.34-1.75.15-.06.3-.1.46-.1.35 0 .66.24.73.58.13.69.39 1.36.76 1.95-.64.17-1.29.32-1.97.41-.19.03-.39.17-.45.35-.06.18-.02.39.11.53 1.13 1.17 2.63 1.93 4.23 1.93s3.1-.76 4.23-1.93c.13-.14.17-.35.11-.53-.06-.18-.26-.32-.45-.35-.68-.09-1.33-.24-1.97-.41.37-.59.64-1.26.76-1.95.07-.34.38-.58.73-.58.16 0 .31.04.46.1.86.41 1.65 1.03 2.34 1.75.2.2.51.2.71 0 .19-.2.19-.51 0-.71-.79-.85-1.68-1.59-2.66-2.08-.33-.16-.56-.51-.56-.9v-3.1C15.15 9.25 13.6 9 12 9z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={() => navigate("/home")}
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
