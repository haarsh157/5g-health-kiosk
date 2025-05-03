import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import lang from "../../assets/Vector.png";
import back from "../../assets/mdi_arrow-back-circle.png";
import { useSocket } from "../../providers/Socket";

export default function ConsultationPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [error, setError] = useState(null);
  const { socket } = useSocket();

  const API_BASE_URL = "http://localhost:5000";

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    if (!token || user?.role !== "PATIENT") {
      navigate("/");
      return;
    }

    const fetchActiveDoctors = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/getDoctor/active`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setDoctors(data);
      } catch (err) {
        setError("Failed to fetch doctors. Please try again later.");
        console.error("Error fetching doctors:", err);
      }
    };

    fetchActiveDoctors();
  }, [navigate, token, user?.role]);

  const healthMeasurements = [
    { name: "Heart Rate", value: "76 bpm" },
    { name: "Blood Pressure", value: "120/80 mmHg" },
    { name: "Temperature", value: "98.6°F" },
  ];

  const startConsultation = async () => {
    if (!selectedDoctor) {
      setError("Please select a doctor before starting the consultation.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/consultations/request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            doctorId: selectedDoctor.id,
            patientId: user.id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create consultation request");
      }

      const data = await response.json();
      const consultationId = data.consultation.id;

      // Join the consultation room
      socket.emit("join-room", {
        roomId: consultationId,
        userId: selectedDoctor.id,
      });

      navigate(`/consultation/${consultationId}`, {
        state: {
          selectedDoctor,
          healthMeasurements,
          consultation: data.consultation,
        },
      });
    } catch (err) {
      console.error("Error starting consultation:", err);
      setError("Failed to start consultation. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="w-full max-w-4xl min-h-[80%] p-10 rounded-xl flex flex-col items-center justify-center bg-[#00999524] backdrop-blur-sm border border-white/30 shadow-2xl">
        <>
          <h1 className="text-4xl font-extrabold text-[#005553BF] mb-8 font-sans">
            Video Consultation
          </h1>

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {!isLoading ? (
            <div className="flex flex-col items-center gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg text-center w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-[#005553BF] mb-4">
                  Available Doctors
                </h2>
                {doctors.length > 0 ? (
                  <>
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {doctors.map((doctor) => (
                        <div
                          key={doctor.id}
                          onClick={() => setSelectedDoctor(doctor)}
                          className={`p-4 border rounded-lg cursor-pointer transition duration-200 ${
                            selectedDoctor?.id === doctor.id
                              ? "bg-[#009f96]/20 border-[#009f96] shadow-md"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          <h3 className="font-bold text-lg">
                            {doctor.user.name}
                          </h3>
                          <p className="text-gray-600">{doctor.specialty}</p>
                          {doctor.rating && (
                            <p className="text-yellow-600">
                              Rating: {doctor.rating.toFixed(1)}/5
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={startConsultation}
                      disabled={isLoading}
                      className="px-12 py-4 rounded-full bg-[#009f96] text-white text-2xl font-bold hover:bg-[#008a82] transition-colors duration-200 cursor-pointer shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      Start Consultation
                    </button>
                  </>
                ) : (
                  <p className="text-lg text-[#005553BF] mb-6">
                    No doctors available at the moment. Please try again later.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-8">
              <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute w-full h-full rounded-full border-8 border-[#00555340]"></div>
                <div className="absolute w-3/4 h-3/4 rounded-full border-8 border-transparent border-t-[#005553BF] border-r-[#005553BF] animate-spin"></div>
                <div className="absolute text-xl font-bold text-[#005553BF] text-center">
                  Connecting to doctor...
                </div>
              </div>
              <p className="text-lg text-[#005553BF] text-center">
                Please wait while we connect you with Dr.{" "}
                {selectedDoctor?.user?.name}
              </p>
            </div>
          )}
        </>
      </div>

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
