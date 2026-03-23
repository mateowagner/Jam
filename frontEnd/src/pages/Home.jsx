import { useState } from "react";
import supabase from "../services/supaBase";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [nicknameIngresado, setNicknameIngresado] = useState(false);
  const handleCreateRoom = async () => {
    console.log("crear sala!");
    const roomCode = Math.random().toString(36).substring(2, 8);
    const { data, error } = await supabase
      .from("rooms")
      .insert({ name: roomName, id: roomCode, host_nickname: nickname });
    navigate("/sala/" + roomCode);
  };
  const handleJoinRoom = async () => {
    console.log("unirse a sala!");

    const { data, error } = await supabase
      .from("rooms")
      .select("*")
      .eq("id", roomCode.toLowerCase());
    if (data.length > 0) {
      navigate("/sala/" + roomCode.toLowerCase());
    }
  };
  if (nicknameIngresado) {
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
              Join to your friends
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
  } else {
    return (
      <div className="bg-zinc-950 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-6xl font-black text-white tracking-tight mb-2">
          Jam
        </h1>
        <p className="text-zinc-400 mb-12 text-lg">Listen music together</p>
        <div className="bg-zinc-900 p-8 rounded-2xl flex flex-col gap-4 w-96 border border-zinc-800">
          <h2 className="text-white text-xl font-semibold">
            What's your name?
          </h2>
          <input
            type="text"
            placeholder="Your nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="bg-zinc-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-500"
          />
          <button
            onClick={() => {
              sessionStorage.setItem("nickname", nickname);
              setNicknameIngresado(true);
            }}
            className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors"
          >
            Let's go
          </button>
        </div>
      </div>
    );
  }
}
export default Home;
