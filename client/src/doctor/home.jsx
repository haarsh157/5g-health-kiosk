// import React, { useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
// } from "recharts";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faVideo,
//   faCalendarAlt,
//   faUserMd,
//   faChartLine,
//   faBell,
//   faSearch,
//   faPhone,
// } from "@fortawesome/free-solid-svg-icons";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Button from "../doctor/components/Buttons";
import Input from "../doctor/components/Input";
import { Card, CardContent } from "../doctor/components/Card";
import { useNavigate } from "react-router-dom";


export default function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/doctors/Patients")
      .then((res) => {
        console.log("Patients data:", res.data);
        setPatients(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching patients:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex h-screen bg-[#F5F5F5]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#E0F7FA] text-[#004D40] shadow p-4">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>
        <nav className="space-y-4">
          <div className="flex items-center gap-2 hover:bg-[#B2EBF2] p-2 rounded">
            Dashboard
          </div>
          <div className="flex items-center gap-2 hover:bg-[#B2EBF2] p-2 rounded">
            Patients Queue
          </div>
          <div className="flex items-center gap-2 hover:bg-[#B2EBF2] p-2 rounded">
            Teleconsultation
          </div>
          <div className="flex items-center gap-2 hover:bg-[#B2EBF2] p-2 rounded">
            Live Vitals
          </div>
          <div className="flex items-center gap-2 hover:bg-[#B2EBF2] p-2 rounded">
            Reports
          </div>
          <div className="flex items-center gap-2 hover:bg-[#B2EBF2] p-2 rounded">
            Settings
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#212121]">
            Doctor's 5G Kiosk Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search patient or ID"
              className="w-64 border border-[#004D40] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#009688]"
            />
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center bg-white shadow rounded-lg">
              <p className="text-lg font-bold text-[#009688]">
                {patients.length}
              </p>
              <p className="text-sm text-[#212121]">Total Patients</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center bg-white shadow rounded-lg">
              <p className="text-lg font-bold text-[#FF5722]">3</p>
              <p className="text-sm text-[#212121]">Ongoing Consult</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center bg-white shadow rounded-lg">
              <p className="text-lg font-bold text-[#FF5722]">5</p>
              <p className="text-sm text-[#212121]">Alerts</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center bg-white shadow rounded-lg">
              <p className="text-lg font-bold text-[#009688]">Online</p>
              <p className="text-sm text-[#212121]">Connectivity</p>
            </CardContent>
          </Card>
        </div>

        {/* Patient Queue */}
        <div className="mb-6">
          <Card>
            <CardContent className="p-4 bg-white shadow rounded-lg">
              <h3 className="text-lg font-semibold text-[#212121] mb-4">
                Previous Calls
              </h3>
              {loading ? (
                <p className="text-[#FF5722]">Loading...</p>
              ) : (
                <div className="space-y-2">
                  {patients.slice(0, 5).map((p, i) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center bg-[#F5F5F5] p-2 rounded-lg shadow"
                    >
                      <div>
                        <p className="font-semibold text-[#212121]">{p.name}</p>
                        <p className="text-sm text-gray-500">
                          {p.phoneNumber} • {p.symptom}
                        </p>
                      </div>
                      <Button
                        className={`${
                          i === 0
                            ? "bg-[#009688] hover:bg-[#00796B]"
                            : "bg-[#FF5722] hover:bg-[#E64A19]"
                        } text-white py-1 px-4 rounded`}
                        onClick={() => navigate(`/patient-info/${p.id}`)}
                        >
                        {i === 0 ? "View" : "Start"}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* <Card>
              <CardContent className="p-4 bg-white shadow rounded-lg">
                <h3 className="text-lg font-semibold text-[#212121] mb-4">
                  Vitals Monitor
                </h3>
                <div className="h-32 bg-[#E0F2F1] rounded mb-2" />
                <div className="text-sm text-gray-600">
                  Heart Rate • SPO2 • BP
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <p className="font-semibold text-[#212121]">John Doe</p>
                    <p className="text-sm text-gray-500">48 yrs • Male</p>
                  </div>
                  <Button className="bg-[#FF5722] hover:bg-[#E64A19] text-white py-1 px-4 rounded">
                    End Consultation
                  </Button>
                </div>
              </CardContent>
            </Card> */}
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-2 gap-4">
          {/* <Card>
            <CardContent className="p-4 bg-white shadow rounded-lg">
              <h3 className="text-lg font-semibold text-[#212121] mb-4">
                Video Consult
              </h3>
              <div className="h-24 bg-[#E0F2F1] rounded mb-2" />
            </CardContent>
          </Card> */}
          {/* 
          <Card>
            <CardContent className="p-4 bg-white shadow rounded-lg">
              <h3 className="text-lg font-semibold text-[#212121] mb-4">
                Notes / Scheduler
              </h3>
              <div className="h-24 bg-[#E0F2F1] rounded mb-2" />
            </CardContent>
          </Card> */}
        </div>
      </div>
    </div>
  );
}

// /* Add this CSS for the animation */
// <style jsx global>{`
//   @keyframes slide-in {
//     from {
//       transform: translateX(100%);
//     }
//     to {
//       transform: translateX(0);
//     }
//   }

//   .animate-slide-in {
//     animation: slide-in 0.3s ease-out;
//   }
// `}</style>;
