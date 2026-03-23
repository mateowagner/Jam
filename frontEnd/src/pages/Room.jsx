import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import supabase from "../services/supaBase";
import YouTube from "react-youtube";
import { searchVideos } from "../services/youtube";
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

  const fetchQueue = async () => {
    const { data, error } = await supabase
      .from("songs")
      .select("*")
      .eq("room_id", codigo)
      .eq("played", false)
      .order("position", { ascending: true });
    setQueue(data);
  };

  // 1. cargar datos iniciales
  useEffect(() => {
    const fetchRoom = async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", codigo);
      setRoom(data[0]);
      fetchQueue();
    };
    fetchRoom();
  }, []);

  // 2. canal de songs
  useEffect(() => {
    const setupSongsChannel = async () => {
      await supabase.realtime.setAuth();
      supabase
        .channel(`songs:${codigo}`, { config: { private: true } })
        .on("broadcast", { event: "INSERT" }, () => fetchQueue())
        .on("broadcast", { event: "UPDATE" }, () => fetchQueue())
        .on("broadcast", { event: "DELETE" }, () => fetchQueue())
        .subscribe();
    };
    setupSongsChannel();
  }, []);

  // 3. canal de presence y rooms
  useEffect(() => {
    const presenceChannel = supabase.channel(`room:${codigo}`);
    presenceChannel
      .on("presence", { event: "sync" }, () => {
        const state = presenceChannel.presenceState();
        const users = Object.values(state).map((p) => p[0]);
        setParticipants(users);
      })
      .on("presence", { event: "leave" }, async ({ leftPresences }) => {
        const { data } = await supabase
          .from("rooms")
          .select("host_nickname")
          .eq("id", codigo);

        const hostSeWas = leftPresences.find(
          (p) => p.nickname === data[0]?.host_nickname,
        );

        if (hostSeWas) {
          const state = presenceChannel.presenceState();
          const remaining = Object.values(state).map((p) => p[0]);
          const newHost = remaining.find(
            (p) => p.nickname !== data[0]?.host_nickname,
          );

          if (newHost) {
            await supabase
              .from("rooms")
              .update({ host_nickname: newHost.nickname })
              .eq("id", codigo);
          }
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await presenceChannel.track({
            nickname: sessionStorage.getItem("nickname"),
          });
        }
      });
  }, []);

  //4 canal para actualizar la room en tiempo real
  useEffect(() => {
    const setupRoomChannel = async () => {
      await supabase.realtime.setAuth();
      supabase
        .channel(`rooms:${codigo}`, { config: { private: true } })
        .on("broadcast", { event: "UPDATE" }, () => {
          const fetchRoom = async () => {
            const { data, error } = await supabase
              .from("rooms")
              .select("*")
              .eq("id", codigo);
            setRoom(data[0]);
          };
          fetchRoom();
        })
        .subscribe();
    };
    setupRoomChannel();
  }, []);

  const handleSearchSong = async () => {
    const data = await searchVideos(songName);
    const resultados = data.items.map((item) => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.default.url,
    }));
    setSearchResults(resultados);
  };

  const handleAddSong = async (video) => {
    const nickname = sessionStorage.getItem("nickname");
    const { count } = await supabase
      .from("songs")
      .select("*", { count: "exact" })
      .eq("room_id", codigo)
      .eq("played", false);
    const posicion = count + 1;
    const { data, error } = await supabase.from("songs").insert({
      room_id: codigo,
      position: posicion,
      added_by: nickname,
      thumbnail: video.thumbnail,
      title: video.title,
      video_id: video.videoId,
    });

    setSongName("");
    setSearchResults([]);
    fetchQueue();
  };
  const handleSongEnd = async () => {
    // marcar la canción como reproducida
    const { data, error } = await supabase
      .from("songs")
      .update({ played: true })
      .eq("room_id", codigo)
      .eq("id", queue[0].id);
    fetchQueue();
  };
  const handlePlay = () => {
    console.log("play: " + player);
    if (player) player.playVideo();
  };
  const handlePause = () => {
    if (player) player.pauseVideo();
  };
  const handleNextPage = () => {
    if ((pagina + 1) * 10 < queue.length) setPagina(pagina + 1);
  };
  const handlePrevPage = () => {
    if (pagina > 0) setPagina(pagina - 1);
  };
  return (
    <div className="bg-zinc-950 min-h-screen flex text-white">
      {/* panel izquierdo */}
      <div className="w-64 bg-zinc-900 border-r border-zinc-800 p-6">
        <ParticipantsList participants={participants} />
      </div>

      {/* panel principal */}
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

        {sessionStorage.getItem("nickname") === room?.host_nickname && (
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
