import React, { useEffect } from "react";
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
  faPhone,
} from "@fortawesome/free-solid-svg-icons";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const [incomingCall, setIncomingCall] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState("dashboard");

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || user?.role !== "DOCTOR") {
      navigate("/"); 
    }
  }, [navigate]);

  const patientData = [
    { name: "Mon", patients: 4 },
    { name: "Tue", patients: 6 },
    { name: "Wed", patients: 8 },
    { name: "Thu", patients: 5 },
    { name: "Fri", patients: 7 },
    { name: "Sat", patients: 3 },
  ];

  const appointments = [
    {
      id: 1,
      patient: "Sarah Johnson",
      time: "09:30 AM",
      condition: "Follow-up",
    },
    {
      id: 2,
      patient: "Michael Chen",
      time: "11:15 AM",
      condition: "New Patient",
    },
    {
      id: 3,
      patient: "Emma Wilson",
      time: "02:00 PM",
      condition: "Consultation",
    },
  ];

  const handleAcceptCall = () => navigate("/consultation/active");
  const handleRejectCall = () => setIncomingCall(false);

  // If not authenticated, don't render anything (will redirect)
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  if (!token || user?.role !== "DOCTOR") {
    return null;
  }

  return (
    <div className="h-screen w-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">MedCare Pro</h2>
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
      <div className="flex-1 p-8">
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
            <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
              {user?.name?.charAt(0) || "D"}
            </div>
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

        {/* Today's Appointments */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Today's Appointments</h3>
            <button className="text-blue-600 hover:text-blue-700">
              View All →
            </button>
          </div>

          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{appointment.patient}</p>
                  <p className="text-sm text-gray-500">
                    {appointment.condition}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">{appointment.time}</span>
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                    Start Consultation
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Incoming Call Side Popup */}
      {incomingCall && (
        <div className="fixed right-8 top-20 bg-white p-6 rounded-xl shadow-xl border border-gray-200 animate-slide-in">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <FontAwesomeIcon
                icon={faVideo}
                className="text-blue-500 text-2xl mb-2"
              />
              <h3 className="text-lg font-semibold">Incoming Video Call</h3>
              <p className="text-sm text-gray-600">Patient: Emma Wilson</p>
              <p className="text-xs text-gray-500">12:00 PM - 12:30 PM</p>
            </div>

            <div className="flex gap-4 w-full">
              <button
                onClick={handleAcceptCall}
                className="flex-1 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                <FontAwesomeIcon icon={faPhone} className="mr-2" />
                Accept
              </button>
              <button
                onClick={handleRejectCall}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <FontAwesomeIcon
                  icon={faPhone}
                  rotation={180}
                  className="mr-2"
                />
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;

/* Add this CSS for the animation */
<style jsx global>{`
  @keyframes slide-in {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }
`}</style>;
