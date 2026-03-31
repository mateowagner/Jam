import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addMember, createRoom, getRoom } from "../services/api.js";

function Home() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/auth");
  }, []);

  const handleCreateRoom = async () => {
    const data = await createRoom(roomName);
    navigate("/sala/" + data.id);
  };
  const handleJoinRoom = async () => {
    const data = await getRoom(roomCode);
    if (data.id) {
      await addMember(roomCode);
      navigate("/sala/" + data.id);
    }
  };

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-black text-white tracking-tight mb-2">
        Jam
      </h1>
      <p className="text-zinc-400 mb-12 text-lg">Listen music together</p>
      <div className="flex gap-4">
        <div className="bg-zinc-900 p-8 rounded-2xl flex flex-col gap-4 w-96 border border-zinc-800">
          <h2 className="text-white text-xl font-semibold">Be the Host</h2>
          <input
            type="text"
            placeholder="Room name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            className="bg-zinc-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-500"
          />
          <button
            onClick={handleCreateRoom}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Create Room
          </button>
        </div>
        <div className="bg-zinc-900 p-8 rounded-2xl flex flex-col gap-4 w-96 border border-zinc-800">
          <h2 className="text-white text-xl font-semibold">
            Join your friends
          </h2>
          <input
            type="text"
            placeholder="Room code"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="bg-zinc-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-500"
          />
          <button
            onClick={handleJoinRoom}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Join room
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
