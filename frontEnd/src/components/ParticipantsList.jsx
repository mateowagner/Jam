function ParticipantsList({ participants }) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-2">
        Participants
      </h3>
      {participants.map((p) => (
        <div key={p.nickname} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-sm font-bold">
            {p.nickname[0].toUpperCase()}
          </div>
          <p className="text-white text-sm">{p.nickname}</p>
        </div>
      ))}
    </div>
  );
}

export default ParticipantsList;
