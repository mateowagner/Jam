import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import YouTube from "react-youtube";
import {
  getRoom,
  getQueue,
  markAsPlayed,
  searchYoutube,
} from "../services/api.js";
import socket from "../services/socket";
import ParticipantsList from "../components/ParticipantsList";
import Queue from "../components/Queue";
import SearchResults from "../components/SearchResults";
function Room() {
  const [room, setRoom] = useState(null);
  const [songName, setSongName] = useState("");
  const { codigo } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [queue, setQueue] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [player, setPlayer] = useState(null);
  const [pagina, setPagina] = useState(0);

  const username = localStorage.getItem("username");

  // 1. cargar datos iniciales
  useEffect(() => {
    const fetchRoom = async () => {
      const data = await getRoom(codigo);
      setRoom(data);
    };
    const fetchQueueData = async () => {
      const data = await getQueue(codigo);
      setQueue(data);
    };
    fetchRoom();
    fetchQueueData();
  }, []);

  // 2. Socket.io — eventos en tiempo real
  useEffect(() => {
    socket.emit("joinRoom", { roomId: codigo, username });

    socket.on("userJoined", ({ username: user }) => {
      setParticipants((prev) => [...prev, { username: user }]);
    });
    socket.on("roomParticipants", (users) => {
      setParticipants(users);
    });
    socket.on("userLeft", ({ username: user }) => {
      setParticipants((prev) => prev.filter((p) => p.username !== user));
    });

    socket.on("queueUpdated", async () => {
      const data = await getQueue(codigo);
      setQueue(data);
    });

    return () => {
      socket.emit("leaveRoom", { roomId: codigo, username });
      socket.off("userJoined");
      socket.off("userLeft");
      socket.off("queueUpdated");
    };
  }, []);

  const handleSearchSong = async () => {
    const data = await searchYoutube(songName);
    const resultados = data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.default.url,
    }));
    setSearchResults(resultados);
  };

  const handleAddSong = async (video) => {
    socket.emit("addSong", {
      roomId: codigo,
      title: video.title,
      video_id: video.videoId,
      thumbnail: video.thumbnail,
      added_by_id: localStorage.getItem("userId"),
    });
    setSongName("");
    setSearchResults([]);
  };

  const handleSongEnd = async () => {
    if (!queue[0]) return;
    await markAsPlayed(queue[0].id);
    socket.emit("skipSong", { roomId: codigo, songId: queue[0].id });
  };

  const handlePlay = () => {
    if (player) {
      player.playVideo();
      socket.emit("playSong", { roomId: codigo, songId: queue[0]?.id });
    }
  };

  const handlePause = () => {
    if (player) {
      player.pauseVideo();
      socket.emit("pauseSong", { roomId: codigo });
    }
  };

  const handleNextPage = () => {
    if ((pagina + 1) * 10 < queue.length) setPagina(pagina + 1);
  };

  const handlePrevPage = () => {
    if (pagina > 0) setPagina(pagina - 1);
  };

  return (
    <div className="bg-zinc-950 min-h-screen flex text-white">
      <div className="w-64 bg-zinc-900 border-r border-zinc-800 p-6">
        <ParticipantsList participants={participants} />
      </div>

      <div className="flex-1 p-8 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-black">{room?.name}</h1>
          <p className="text-zinc-500 text-sm">Room code: {codigo}</p>
        </div>

        <input
          type="text"
          placeholder="Search a song..."
          value={songName}
          onChange={(e) => setSongName(e.target.value)}
          className="bg-zinc-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-500 w-full"
        />
        <button
          onClick={handleSearchSong}
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors w-fit"
        >
          Search
        </button>

        {username === room?.admin?.username && (
          <div className="flex gap-6 items-start">
            <YouTube
              onReady={(e) => setPlayer(e.target)}
              videoId={queue[0]?.video_id}
              onEnd={handleSongEnd}
              opts={{ playerVars: { autoplay: 1 } }}
            />
            <div className="flex flex-col gap-3">
              <button
                onClick={handlePlay}
                className="bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-6 rounded-xl transition-colors"
              >
                Play
              </button>
              <button
                onClick={handlePause}
                className="bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-6 rounded-xl transition-colors"
              >
                Pause
              </button>
              <button
                onClick={handleSongEnd}
                className="bg-zinc-700 hover:bg-zinc-600 text-white py-2 px-6 rounded-xl transition-colors"
              >
                Skip
              </button>
            </div>
          </div>
        )}

        {searchResults.length > 0 ? (
          <SearchResults
            searchResults={searchResults}
            handleAddSong={handleAddSong}
          />
        ) : (
          <Queue
            queue={queue}
            pagina={pagina}
            handlePrevPage={handlePrevPage}
            handleNextPage={handleNextPage}
          />
        )}
      </div>
    </div>
  );
}

export default Room;
