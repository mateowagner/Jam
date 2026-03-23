export const searchVideos = async (query) => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=5&type=video&key=${import.meta.env.VITE_YOUTUBE_API_KEY}`,
  );
  const data = await response.json();
  return data;
};
