import React from "react";
import { useParams } from "react-router-dom";

const MeetingRoom = () => {
  const { roomId } = useParams();

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>🔐 You're in the Meeting Room</h2>
      <p>Room ID: <strong>{roomId}</strong></p>
      <p>This is where your video call UI will go.</p>
    </div>
  );
};

export default MeetingRoom;
