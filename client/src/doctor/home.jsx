import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideo,
  faCalendarAlt,
  faUserMd,
  faChartLine,
  faBell,
  faSearch,
  faClock,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useSocket } from "../providers/Socket";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { socket } = useSocket();

  const API_BASE_URL = "http://localhost:5000";

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || user?.role !== "DOCTOR") {
      navigate("/");
    }
  }, [navigate]);

  // Fetch consultation requests
  const fetchConsultations = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/consultations/getrequests`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch consultations");
      }

      const data = await response.json();
      console.log(data);
      setConsultations(data.consultations);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchConsultations();
  }, []);

  // Set up polling for real-time updates
  useEffect(() => {
    const interval = setInterval(fetchConsultations, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const patientData = [
    { name: "Mon", patients: 4 },
    { name: "Tue", patients: 6 },
    { name: "Wed", patients: 8 },
    { name: "Thu", patients: 5 },
    { name: "Fri", patients: 7 },
    { name: "Sat", patients: 3 },
  ];

  const handleAcceptCall = (consultationId) => {
    navigate(`/consultation/${consultationId}`);
    socket.emit("join-room", {
      roomId: consultationId,
      userId: user.id,
    });
  };

  const handleRejectCall = async (consultationId) => {
    try {
      const response = await fetch(
        `/api/consultations/${consultationId}/reject`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject consultation");
      }

      // Update local state
      setConsultations((prev) => prev.filter((c) => c.id !== consultationId));
    } catch (err) {
      console.error("Error rejecting consultation:", err);
    }
  };

  // If not authenticated, don't render anything (will redirect)
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!token || user?.role !== "DOCTOR") {
    return null;
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      } else {
        console.error("Failed to logout");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="h-screen w-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <div className="mb-8">
          <p className="text-sm text-gray-500">Dr. {user?.name || "User"}</p>
        </div>

        <nav className="space-y-2">
          <button
            className={`w-full text-left p-3 rounded-lg flex items-center ${
              activeTab === "dashboard"
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("dashboard")}
          >
            <FontAwesomeIcon icon={faChartLine} className="mr-3" />
            Dashboard
          </button>
          <button
            className={`w-full text-left p-3 rounded-lg flex items-center ${
              activeTab === "schedule"
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("schedule")}
          >
            <FontAwesomeIcon icon={faCalendarAlt} className="mr-3" />
            Schedule
          </button>
          <button
            className={`w-full text-left p-3 rounded-lg flex items-center ${
              activeTab === "patients"
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("patients")}
          >
            <FontAwesomeIcon icon={faUserMd} className="mr-3" />
            Patients
          </button>
          <button
            className={`w-full text-left p-3 rounded-lg flex items-center ${
              activeTab === "consultations"
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab("consultations")}
          >
            <FontAwesomeIcon icon={faVideo} className="mr-3" />
            Consultations
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search patients, records..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="absolute left-3 top-3 text-gray-400"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <FontAwesomeIcon icon={faBell} className="text-gray-600" />
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-full shadow-md transition-colors duration-200 text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Patient Statistics */}
          <div className="col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Patient Statistics</h3>
            <LineChart width={500} height={200} data={patientData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="patients" stroke="#3B82F6" />
            </LineChart>
          </div>

          {/* Quick Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                Add New Prescription
              </button>
              <button className="w-full p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                View Patient Records
              </button>
            </div>
          </div>
        </div>

        {/* Consultation Requests */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Consultation Requests</h3>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {consultations.length} Pending
            </span>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-4 text-center">{error}</div>
          ) : consultations.length === 0 ? (
            <div className="text-gray-500 p-4 text-center">
              No pending consultation requests
            </div>
          ) : (
            <div className="space-y-4">
              {consultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {consultation.patient?.name || "Unknown Patient"}
                      </h4>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <FontAwesomeIcon icon={faClock} className="mr-2" />
                        Requested at: {formatTime(consultation.requestTime)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        Phone: {consultation.patient?.phoneNumber || "N/A"}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAcceptCall(consultation.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
                      >
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="mr-2"
                        />
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectCall(consultation.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
                      >
                        <FontAwesomeIcon
                          icon={faTimesCircle}
                          className="mr-2"
                        />
                        Decline
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
