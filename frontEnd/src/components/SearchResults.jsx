function SearchResults({ searchResults, handleAddSong }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">
        Results
      </h3>
      {searchResults.map((video) => (
        <div
          key={video.videoId}
          className="flex items-center gap-4 p-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 transition-colors"
        >
          <img
            src={video.thumbnail}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <p className="text-white text-sm flex-1 truncate">{video.title}</p>
          <button
            onClick={() => handleAddSong(video)}
            className="bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold py-2 px-4 rounded-xl transition-colors"
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
}

export default SearchResults;
