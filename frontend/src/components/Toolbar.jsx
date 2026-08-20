function Toolbar({ boardStyle, setBoardStyle, onNewNote }){
  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-white/90 shadow-md sticky top-0 z-10">
      <button
        onClick={onNewNote}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded shadow"
      >
        + New Note
      </button>

      <div className="flex gap-1 bg-gray-100 rounded p-1">
        <button className="px-3 py-1 rounded bg-white shadow text-sm font-semibold">Organized</button>
        <button className="px-3 py-1 rounded text-sm text-gray-500">Free / Messy</button>
        <button className="px-3 py-1 rounded text-sm text-gray-500">Shapes</button>
      </div>

      <input
        type="text"
        placeholder="Search notes..."
        className="border rounded px-3 py-1.5 text-sm w-48"
      />

      <select className="border rounded px-2 py-1.5 text-sm">
        <option>All</option>
        <option>Favorites</option>
        <option>Yellow</option>
        <option>Pink</option>
        <option>Blue</option>
        <option>Green</option>
        <option>Orange</option>
        <option>Purple</option>
      </select>

      <select
        value={boardStyle}
        onChange={(e)=>setBoardStyle(e.target.value)}
        className="border rounded px-2 py-1.5 text-sm ml-auto"
      >
        <option value="cork">Cork board</option>
        <option value="paper">Paper</option>
        <option value="white">Clean white</option>
        <option value="dark">Dark board</option>
      </select>
    </div>
  )
}

export default Toolbar