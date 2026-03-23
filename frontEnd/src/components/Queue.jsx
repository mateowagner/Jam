function Queue({ queue, pagina, handlePrevPage, handleNextPage }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">
        Queue
      </h3>
      {queue.slice(pagina * 10, pagina * 10 + 10).map((song, index) => (
        <div
          key={song.id}
          className={`flex items-center gap-4 p-3 rounded-xl ${pagina === 0 && index === 0 ? "bg-violet-900 border border-violet-600" : "bg-zinc-900"}`}
        >
          <img
            src={song.thumbnail}
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="flex flex-col flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">
              {song.title}
            </p>
            <p className="text-zinc-400 text-xs">{song.added_by}</p>
          </div>
          {pagina === 0 && index === 0 && (
            <span className="text-violet-400 text-xs font-semibold">
              Now playing
            </span>
          )}
        </div>
      ))}
      <div className="flex gap-2 mt-2">
        <button
          onClick={handlePrevPage}
          className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm py-2 px-4 rounded-xl transition-colors disabled:opacity-30"
          disabled={pagina === 0}
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm py-2 px-4 rounded-xl transition-colors"
          disabled={queue.length <= (pagina + 1) * 10}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Queue;
