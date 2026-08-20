import { useState, useRef, useEffect } from 'react'

const colorMap={
  yellow:'bg-yellow-200 border-yellow-300',
  pink:'bg-pink-200 border-pink-300',
  blue:'bg-blue-200 border-blue-300',
  green:'bg-green-200 border-green-300',
  orange:'bg-orange-200 border-orange-300',
  purple:'bg-purple-200 border-purple-300',
}

const rotations=[-3,-2,-1,0,1,2,3]

function getRotation(id){
  const str=String(id)
  let sum=0
  for(let i=0;i<str.length;i++){
    sum+=str.charCodeAt(i)
  }
  return rotations[sum % rotations.length]
}

function StickyNote({ note, onEdit, onDelete }){
  const [menuOpen, setMenuOpen]=useState(false)
  const [openUpward, setOpenUpward]=useState(false)
  const menuBtnRef=useRef(null)
  const rotation=getRotation(note.id)
  const colorClasses=colorMap[note.color] || colorMap.yellow

  function toggleMenu(){
    if(!menuOpen && menuBtnRef.current){
      const rect=menuBtnRef.current.getBoundingClientRect()
      const spaceBelow=window.innerHeight - rect.bottom
      const menuHeightNeeded=230
      setOpenUpward(spaceBelow < menuHeightNeeded)
    }
    setMenuOpen(!menuOpen)
  }

  useEffect(()=>{
    function handleClickOutside(e){
      if(menuBtnRef.current && !menuBtnRef.current.contains(e.target)){
        setMenuOpen(false)
      }
    }
    if(menuOpen){
      document.addEventListener('mousedown', handleClickOutside)
    }
    return ()=>document.removeEventListener('mousedown', handleClickOutside)
  },[menuOpen])

  function handleEditClick(){
    setMenuOpen(false)
    onEdit(note)
  }

  function handleDeleteClick(){
    setMenuOpen(false)
    if(window.confirm('Delete this note?')){
      onDelete(note.id)
    }
  }

  return (
    <div
      className={`relative w-48 h-48 p-4 border shadow-md rounded-sm ${colorClasses}`}
      style={{ transform:`rotate(${rotation}deg)`, zIndex: menuOpen ? 100 : 1 }}
      onDoubleClick={()=>onEdit(note)}
    >
      {note.favorite && (
        <div className="pin-icon">
          <div className="pin-head"></div>
          <div className="pin-stem"></div>
          <div className="pin-needle"></div>
        </div>
      )}

      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg break-words pr-2">{note.title}</h3>

        <div className="relative" ref={menuBtnRef}>
          <button
            onClick={toggleMenu}
            className="text-xl leading-none px-1 hover:bg-black/5 rounded"
          >
            ⋮
          </button>

          {menuOpen && (
            <div
              className={`absolute right-0 bg-white text-black text-sm rounded shadow-lg border z-[200] w-36 ${openUpward ? 'bottom-full mb-1' : 'top-full mt-1'}`}
            >
              <button onClick={handleEditClick} className="block w-full text-left px-3 py-2 hover:bg-gray-100">Edit</button>
              <button className="block w-full text-left px-3 py-2 hover:bg-gray-100">Change color</button>
              <button className="block w-full text-left px-3 py-2 hover:bg-gray-100">Favorite</button>
              <button className="block w-full text-left px-3 py-2 hover:bg-gray-100">Bring to front</button>
              <button className="block w-full text-left px-3 py-2 hover:bg-gray-100">Send to back</button>
              <button onClick={handleDeleteClick} className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600">Delete</button>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm mt-2 line-clamp-4 break-words">{note.content}</p>
    </div>
  )
}

export default StickyNote