import React, { useEffect, useCallback, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../providers/Socket";
import { usePeer } from "../providers/Peer";
import ReactPlayer from "react-player";

export default function ConsultationRoom() {
  const { consultationId } = useParams();
  // const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { peer, createOffer, createAnswer, setRemoteAnswer, sendStream, remoteStream } = usePeer();
  const [myStream, setMyStream] = useState(null);
  const[ remoteuserId, setRemoteUserId]= useState();

  // const { healthMeasurements, selectedDoctor } = location.state || {};

  const handleUserJoined = useCallback(
    async (data) => {
      const { userId } = data;
      console.log("new user joined", userId);
      const offer = await createOffer();
      socket.emit("call-user", { userId, offer });
      setRemoteUserId(userId)
    },
    [createOffer, socket]
  );

  const healthMeasurements = [
    { name: "Heart Rate", value: "76 bpm" },
    { name: "Blood Pressure", value: "120/80 mmHg" },
    { name: "Temperature", value: "98.6°F" },
  ];

  const handleIncomngCall = useCallback(
    async (data) => {
      const { from, offer } = data;
      console.log("incoming call from ", from, offer);
      const ans = await createAnswer(offer);
      socket.emit("call-accepted", { userId: from, ans });
      setRemoteUserId(from);
    },
    [createAnswer, socket]
  );

  const handleCallAccepted = useCallback(
    async (data) => {
      const { ans } = data;
      console.log("call got accepted", ans);
  
      if (peer.signalingState === "have-local-offer") {
        await setRemoteAnswer(ans);
      } else {
        console.warn("Skipping setRemoteAnswer because signalingState is", peer.signalingState);
      }
    },
    [setRemoteAnswer, peer]
  );
  

  useEffect(() => {
    // if (!healthMeasurements) {
    //   // Prevent direct access without state
    //   navigate("/home");
    //   return;
    // }

    socket.on("user-joined", handleUserJoined);
    socket.on("incoming-call", handleIncomngCall);
    socket.on("call-accepted", handleCallAccepted);

    return () => {
      socket.off("user-joined", handleUserJoined);
      socket.off("incoming-call", handleIncomngCall);
      socket.off("call-accepted", handleCallAccepted);
    };

    // console.log("👩‍⚕️ Selected Doctor:", selectedDoctor);
  }, [handleUserJoined, socket, navigate, handleIncomngCall, handleCallAccepted]);

  const getUserMediaStream = useCallback(async () => {
    try {
      // if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      //   alert("Media devices API not supported in your browser.");
      //   return;
      // }
  
      // First, ask for permissions
      const stream = await navigator.mediaDevices.getUserMedia({
        // video: true,
        audio: true,
      });
  
      // If successful: set the stream and send it
      sendStream(stream);
      setMyStream(stream);
  
      // Now check what devices are available (optional extra check)
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some((device) => device.kind === "videoinput");
      const hasMicrophone = devices.some((device) => device.kind === "audioinput");
  
      if (!hasCamera || !hasMicrophone) {
        console.warn("Warning: Some devices are missing (camera or mic)");
      }
  
    } catch (error) {
      console.error("Error accessing media devices:", error);
  
      if (error.name === "NotAllowedError") {
        alert("Permissions denied. Please allow access to camera and microphone.");
      } else if (error.name === "NotFoundError") {
        alert("No camera or microphone found on this device.");
      } else {
        alert(
          "Error accessing camera or microphone. Please check your device settings."
        );
      }
    }
  }, [sendStream]);
  

  const handleNegotiation = useCallback(()=>{
    const localOffer=peer.localDescription;
    socket.emit("call-user", {userId: remoteuserId, offer:localOffer})
  },[])

  useEffect(()=>{

    peer.addEventListener("negotiationneeded", handleNegotiation);
    return ()=>{

      peer.removeEventListener("negotiationneeded", handleNegotiation)
    }
  },[handleNegotiation, peer])

  useEffect(() => {
    getUserMediaStream();
  }, [getUserMediaStream]);

  if (!healthMeasurements) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 px-4">
      <div className="bg-white shadow-xl p-8 rounded-xl w-full max-w-3xl">
        <h1 className="text-3xl font-bold text-center text-[#005553BF] mb-6">
          Consultation Room: {consultationId}
        </h1>
        <div className="text-lg text-gray-700">
          <p className="mb-4">
            {/* <strong>Doctor:</strong> {selectedDoctor.user.name} (
            {selectedDoctor.specialty}) */}
          </p>
          <h2 className="text-2xl font-semibold mb-2 text-[#005553BF]">
            Vitals:
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            {healthMeasurements.map((hm, index) => (
              <li key={index}>
                <strong>{hm.name}:</strong> {hm.value}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <h2 className=" text-4xl">you are connected to {remoteuserId}</h2>
      <ReactPlayer url={myStream} playing muted />
      <ReactPlayer url={remoteStream} playing />
    </div>
  );
}
