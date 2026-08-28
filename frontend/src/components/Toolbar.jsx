import ProfileMenu from './ProfileMenu'

function Toolbar({ boardStyle, setBoardStyle, onNewNote, mode, setMode, columns, setColumns, searchTerm, setSearchTerm, filterValue, setFilterValue, shapeType, setShapeType }){
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-white/90 shadow-md sticky top-0 z-10">
      <button
        onClick={onNewNote}
        className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-4 py-2 rounded shadow"
      >
        + New Note
      </button>

      <div className="flex gap-1 bg-gray-100 rounded p-1">
        <button
          onClick={()=>setMode('organized')}
          className={`px-3 py-1 rounded text-sm font-semibold ${mode==='organized' ? 'bg-white shadow' : 'text-gray-500'}`}
        >
          Organized
        </button>
        <button
          onClick={()=>setMode('free')}
          className={`px-3 py-1 rounded text-sm font-semibold ${mode==='free' ? 'bg-white shadow' : 'text-gray-500'}`}
        >
          Free / Messy
        </button>
        <button
          onClick={()=>setMode('shapes')}
          className={`px-3 py-1 rounded text-sm font-semibold ${mode==='shapes' ? 'bg-white shadow' : 'text-gray-500'}`}
        >
          Shapes
        </button>
      </div>

      {mode==='organized' && (
        <div className="flex items-center gap-1 text-sm">
          <label>Columns:</label>
          <select
            value={columns}
            onChange={(e)=>setColumns(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
          </select>
        </div>
      )}

      {mode==='shapes' && (
        <div className="flex items-center gap-1 text-sm">
          <label>Shape:</label>
          <select
            value={shapeType}
            onChange={(e)=>setShapeType(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="heart">Heart</option>
            <option value="circle">Circle</option>
            <option value="star">Star</option>
            <option value="cloud">Cloud</option>
          </select>
        </div>
      )}

      <input
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e)=>setSearchTerm(e.target.value)}
        className="border rounded px-3 py-1.5 text-sm w-48"
      />

      <select
        value={filterValue}
        onChange={(e)=>setFilterValue(e.target.value)}
        className="border rounded px-2 py-1.5 text-sm"
      >
        <option value="all">All</option>
        <option value="favorites">Favorites</option>
        <option value="yellow">Yellow</option>
        <option value="pink">Pink</option>
        <option value="blue">Blue</option>
        <option value="green">Green</option>
        <option value="orange">Orange</option>
        <option value="purple">Purple</option>
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

      <ProfileMenu />
    </div>
  )
}

export default Toolbar