import React, { useMemo, useEffect, useState, useCallback } from "react";

const PeerContext = React.createContext(null);

export const usePeer = () => React.useContext(PeerContext);

export const PeerProvider = (props) => {
  const [remoteStream, setRemoteSAtream] = useState(null);
  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [{ url: "stun:stun2.1.google.com:19302" }],
      }),
    []
  );

  const createOffer = async () => {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    return offer;
  };

  const createAnswer = async (offer) => {
    await peer.setRemoteDescription(offer);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
  };

  const setRemoteAnswer = async (ans) => {
    console.log("Before setting remote answer:", peer.signalingState);
  
    if (peer.signalingState === "have-local-offer") {
      try {
        await peer.setRemoteDescription(ans);
        console.log("Remote answer set successfully!");
      } catch (error) {
        console.error("Failed to set remote answer:", error);
      }
    } else if (peer.signalingState === "stable") {
      console.log("Peer is already stable, skipping setting remote answer.");
    } else {
      console.warn(
        "Unexpected signaling state while setting remote answer:",
        peer.signalingState
      );
    }
  };
  
  
  

  const sendStream = async (stream) => {
    const tracks = stream.getTracks();
    for (const track of tracks) {
      peer.addTrack(track, stream);
    }
  };

  const handleTrackEvent = useCallback((e) => {
    const streams = e.streams;
    setRemoteSAtream(streams[0]);
  }, []);

  useEffect(() => {
    peer.addEventListener("track", handleTrackEvent);
    return () => {
      peer.removeEventListener("track", handleTrackEvent);
    };
  }, [handleTrackEvent, peer]);

  return (
    <PeerContext.Provider
      value={{
        peer,
        createOffer,
        createAnswer,
        setRemoteAnswer,
        sendStream,
        remoteStream,
      }}
    >
      {props.children}
    </PeerContext.Provider>
  );
};
