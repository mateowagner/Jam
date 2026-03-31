const API_URL = "http://localhost:3000";

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const createRoom = async (name) => {
  const res = await fetch(`${API_URL}/rooms`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create room");
  return res.json();
};

export const getRoom = async (roomId) => {
  const res = await fetch(`${API_URL}/rooms/${roomId}`, {
    headers: getHeaders(),
  });
  return res.json();
};
export const addMember = async (roomId) => {
  const res = await fetch(`${API_URL}/rooms/${roomId}/members`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ canPlay: true }),
  });
  return res.json();
};
export const addSong = async (songData) => {
  const res = await fetch(`${API_URL}/songs`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(songData),
  });
  return res.json();
};

export const getQueue = async (roomId) => {
  const res = await fetch(`${API_URL}/songs/room/${roomId}`, {
    headers: getHeaders(),
  });
  return res.json();
};

export const markAsPlayed = async (songId) => {
  const res = await fetch(`${API_URL}/songs/${songId}/played`, {
    method: "PATCH",
    headers: getHeaders(),
  });
  return res.json();
};

export const searchYoutube = async (query) => {
  const res = await fetch(`${API_URL}/youtube/search?q=${query}`, {
    headers: getHeaders(),
  });
  return res.json();
};
