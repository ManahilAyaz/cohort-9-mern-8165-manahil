import { useState, useRef, useEffect } from 'react'
import stripHtml from '../utils/stripHtml'

const colorMap={
  yellow:'bg-yellow-200 border-yellow-300',
  pink:'bg-pink-200 border-pink-300',
  blue:'bg-blue-200 border-blue-300',
  green:'bg-green-200 border-green-300',
  orange:'bg-orange-200 border-orange-300',
  purple:'bg-purple-200 border-purple-300',
}

const presetColors=['yellow','pink','blue','green','orange','purple']

const rotations=[-3,-2,-1,0,1,2,3]

function getRotation(id){
  const str=String(id)
  let sum=0
  for(let i=0;i<str.length;i++){
    sum+=str.charCodeAt(i)
  }
  return rotations[sum % rotations.length]
}

function StickyNote({ note, onEdit, onDelete, onColorChange, onToggleFavorite, onBringToFront, onSendToBack, onMenuToggle }){
  const [menuOpen, setMenuOpen]=useState(false)
  const [openUpward, setOpenUpward]=useState(false)
  const [showColorPicker, setShowColorPicker]=useState(false)
  const [customColor, setCustomColor]=useState(note.color || '#ffffff')
  const menuBtnRef=useRef(null)
  const rotation=getRotation(note.id)

  const isPreset=presetColors.includes(note.color)
  const colorClasses=isPreset ? colorMap[note.color] : 'border-gray-300'
  const customStyle=isPreset ? {} : { backgroundColor:note.color }

  useEffect(()=>{
    if(onMenuToggle) onMenuToggle(note.id, menuOpen)
  },[menuOpen])

  function openMenuAt(){
    if(menuBtnRef.current){
      const rect=menuBtnRef.current.getBoundingClientRect()
      const spaceBelow=window.innerHeight - rect.bottom
      const menuHeightNeeded=230
      setOpenUpward(spaceBelow < menuHeightNeeded)
    }
  }

  function toggleMenu(){
    if(!menuOpen) openMenuAt()
    setMenuOpen(!menuOpen)
    setShowColorPicker(false)
  }

  function handleContextMenu(e){
    e.preventDefault()
    openMenuAt()
    setMenuOpen(true)
  }

  useEffect(()=>{
    function handleClickOutside(e){
      if(menuBtnRef.current && !menuBtnRef.current.contains(e.target)){
        setMenuOpen(false)
        setShowColorPicker(false)
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

  function handlePresetClick(color){
    onColorChange(note.id, color)
    setMenuOpen(false)
    setShowColorPicker(false)
  }

  function handleApplyCustomColor(){
    onColorChange(note.id, customColor)
    setMenuOpen(false)
    setShowColorPicker(false)
  }

  function handleFavoriteClick(){
    setMenuOpen(false)
    onToggleFavorite(note.id, !note.favorite)
  }

  function handleBringToFrontClick(){
    setMenuOpen(false)
    onBringToFront(note.id)
  }

  function handleSendToBackClick(){
    setMenuOpen(false)
    onSendToBack(note.id)
  }

  return (
    <div
      className={`relative w-48 h-48 p-4 border shadow-md rounded-sm ${colorClasses}`}
      style={{ transform:`rotate(${rotation}deg)`, zIndex: menuOpen ? 100 : 1, ...customStyle }}
      onDoubleClick={()=>onEdit(note)}
      onContextMenu={handleContextMenu}
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
              className={`absolute right-0 bg-white text-black text-sm rounded shadow-lg border z-[200] w-44 ${openUpward ? 'bottom-full mb-1' : 'top-full mt-1'}`}
            >
              <button onClick={handleEditClick} className="block w-full text-left px-3 py-2 hover:bg-gray-100">Edit</button>
              <button
                onClick={()=>setShowColorPicker(!showColorPicker)}
                className="block w-full text-left px-3 py-2 hover:bg-gray-100"
              >
                Change color
              </button>

              {showColorPicker && (
                <div className="px-3 py-2 border-t">
                  <div className="flex gap-1 mb-2">
                    {presetColors.map((color)=>(
                      <button
                        key={color}
                        onClick={()=>handlePresetClick(color)}
                        className={`w-5 h-5 rounded-full border ${colorMap[color]}`}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="color"
                      value={customColor}
                      onChange={(e)=>setCustomColor(e.target.value)}
                      className="w-6 h-6 p-0 border-0"
                    />
                    <span
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor:customColor }}
                    ></span>
                    <button
                      onClick={handleApplyCustomColor}
                      className="text-xs px-2 py-1 bg-yellow-400 hover:bg-yellow-500 rounded font-semibold ml-auto"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              <button onClick={handleFavoriteClick} className="block w-full text-left px-3 py-2 hover:bg-gray-100">
                {note.favorite ? 'Unfavorite' : 'Favorite'}
              </button>
              <button onClick={handleBringToFrontClick} className="block w-full text-left px-3 py-2 hover:bg-gray-100">Bring to front</button>
              <button onClick={handleSendToBackClick} className="block w-full text-left px-3 py-2 hover:bg-gray-100">Send to back</button>
              <button onClick={handleDeleteClick} className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600">Delete</button>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm mt-2 line-clamp-4 break-words">{stripHtml(note.content)}</p>
    </div>
  )
}

export default StickyNote