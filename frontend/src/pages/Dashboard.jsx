import { useState, useEffect, useRef } from 'react'
import Toolbar from '../components/Toolbar'
import StickyNote from '../components/StickyNote'
import DraggableNote from '../components/DraggableNote'
import NoteEditor from '../components/NoteEditor'
import stripHtml from '../utils/stripHtml'
import shapeGenerators from '../utils/shapeGenerators'
import api from '../api/axios'

const boardClass={
  cork:'board-cork',
  paper:'board-paper',
  white:'board-white',
  dark:'board-dark',
}

const colors=['yellow','pink','blue','green','orange','purple']

function pickColor(id){
  let sum=0
  for(let i=0;i<id.length;i++){
    sum+=id.charCodeAt(i)
  }
  return colors[sum % colors.length]
}

function hashId(id){
  let hash=0
  const str=String(id)
  for(let i=0;i<str.length;i++){
    hash=(hash * 31 + str.charCodeAt(i)) % 100000
  }
  return hash
}

function Dashboard(){
  const [boardStyle, setBoardStyle]=useState('cork')
  const [mode, setMode]=useState('organized')
  const [shapeType, setShapeType]=useState('heart')
  const [columns, setColumns]=useState(4)
  const [searchTerm, setSearchTerm]=useState('')
  const [filterValue, setFilterValue]=useState('all')
  const [notes, setNotes]=useState([])
  const [loading, setLoading]=useState(true)
  const [error, setError]=useState('')

  const [editorOpen, setEditorOpen]=useState(false)
  const [editingNote, setEditingNote]=useState(null)

  const [positions, setPositions]=useState({})
  const [shapePositions, setShapePositions]=useState({})
  const [shapeVersion, setShapeVersion]=useState(0)

  const [windowWidth, setWindowWidth]=useState(window.innerWidth)
  const boardRef=useRef(null)
  const [boardSize, setBoardSize]=useState({ width:900, height:600 })

  const [openMenuNoteId, setOpenMenuNoteId]=useState(null)
  const [zOrder, setZOrder]=useState({})

  useEffect(()=>{
    function handleResize(){
      setWindowWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    return ()=>window.removeEventListener('resize', handleResize)
  },[])

  useEffect(()=>{
    function measureBoard(){
      if(boardRef.current){
        setBoardSize({
          width: boardRef.current.clientWidth,
          height: Math.max(boardRef.current.clientHeight, 600),
        })
      }
    }
    measureBoard()
    window.addEventListener('resize', measureBoard)
    return ()=>window.removeEventListener('resize', measureBoard)
  },[mode])

  function getEffectiveColumns(){
    if(windowWidth < 640) return Math.min(columns, 2)
    if(windowWidth < 1024) return Math.min(columns, 3)
    return columns
  }

  function getZIndexFor(note){
    if(openMenuNoteId===note.id) return 1000
    if(zOrder[note.id]!=null) return zOrder[note.id]
    if(note.favorite) return 50
    return 1
  }

  function handleMenuToggle(id, isOpen){
    setOpenMenuNoteId(isOpen ? id : null)
  }

  function handleBringToFront(id){
    setZOrder((prev)=>{
      const current=Object.values(prev)
      const maxZ=current.length ? Math.max(...current, 1) : 1
      return { ...prev, [id]: maxZ + 1 }
    })
  }

  function handleSendToBack(id){
    setZOrder((prev)=>{
      const current=Object.values(prev)
      const minZ=current.length ? Math.min(...current, 1) : 1
      return { ...prev, [id]: minZ - 1 }
    })
  }

  async function handleToggleFavorite(id, favorite){
    setNotes((prev)=>prev.map((n)=>n.id===id ? { ...n, favorite } : n))
    try{
      await api.patch(`/notes/${id}`, { favorite })
    }catch(err){
      setError('Could not save favorite status')
    }
  }

  function getPosition(note, index){
    if(positions[note.id]) return positions[note.id]
    const usableWidth=Math.max(boardSize.width - 220, 300)
    const usableHeight=Math.max(boardSize.height - 220, 400)
    const hash=hashId(note.id)
    return {
      x: hash % usableWidth,
      y: (hash * 7) % usableHeight,
    }
  }

  function getShapePosition(note, index){
    return shapePositions[note.id] || { x: 40, y: 40 }
  }

  function getContentSize(positionsMap){
    let maxX=boardSize.width
    let maxY=boardSize.height
    Object.values(positionsMap).forEach((pos)=>{
      if(pos.x + 250 > maxX) maxX=pos.x + 250
      if(pos.y + 250 > maxY) maxY=pos.y + 250
    })
    return { width:maxX, height:maxY }
  }

  async function handleDragStop(id, x, y){
    const safeX=Math.max(0, x)
    const safeY=Math.max(0, y)
    setPositions((prev)=>({ ...prev, [id]:{ x:safeX, y:safeY } }))
    try{
      await api.patch(`/notes/${id}`, { positionX:safeX, positionY:safeY })
    }catch(err){
      setError('Could not save note position')
    }
  }

  function handleShapeDragStop(id, x, y){
    setShapePositions((prev)=>({ ...prev, [id]:{ x:Math.max(0,x), y:Math.max(0,y) } }))
  }

  function applyShape(){
    const generator=shapeGenerators[shapeType]
    if(!generator || notes.length===0 || !boardRef.current) return

    const width=boardRef.current.clientWidth
    const height=Math.max(boardRef.current.clientHeight, 600)
    setBoardSize({ width, height })

    const size=Math.max(120, Math.min(width, height) / 2 - 100)
    const centerX=Math.max(size + 60, width / 2)
    const centerY=Math.max(size + 60, height / 2)

    const newPositions=generator(notes.length, centerX, centerY, size)
    const updates={}
    notes.forEach((note, i)=>{
      updates[note.id]=newPositions[i]
    })
    setShapePositions(updates)
    setShapeVersion((v)=>v+1)
  }

  useEffect(()=>{
    if(mode==='shapes'){
      applyShape()
    }
  },[mode, shapeType])

  async function handleColorChange(id, color){
    setNotes((prev)=>prev.map((n)=>n.id===id ? { ...n, color } : n))
    try{
      await api.patch(`/notes/${id}`, { color })
    }catch(err){
      setError('Could not save note color')
    }
  }

  async function fetchNotes(){
    try{
      const res=await api.get('/notes')
      const mapped=res.data.data.map((n)=>({
        id:n._id,
        title:n.title || '',
        content:n.content || '',
        color:n.color || pickColor(n._id),
        favorite:n.favorite || false,
        positionX:n.positionX,
        positionY:n.positionY,
      }))
      setNotes(mapped)

      const initialPositions={}
      mapped.forEach((note)=>{
        if(note.positionX!=null && note.positionY!=null){
          initialPositions[note.id]={ x:note.positionX, y:note.positionY }
        }
      })
      setPositions(initialPositions)
    }catch(err){
      setError('Could not load notes, try refreshing the page')
    }finally{
      setLoading(false)
    }
  }

  useEffect(()=>{
    fetchNotes()
  },[])

  function openNewNoteEditor(){
    setEditingNote(null)
    setEditorOpen(true)
  }

  function openEditNoteEditor(note){
    setEditingNote(note)
    setEditorOpen(true)
  }

  function closeEditor(){
    setEditorOpen(false)
    setEditingNote(null)
  }

  async function handleSaveNote(title, content){
    if(editingNote){
      await api.patch(`/notes/${editingNote.id}`, { title, content })
    }else{
      await api.post('/notes', { title, content })
    }
    closeEditor()
    await fetchNotes()
  }

  async function handleDeleteNote(id){
    try{
      await api.delete(`/notes/${id}`)
      await fetchNotes()
    }catch(err){
      setError('Could not delete the note')
    }
  }

  const visibleNotes=notes.filter((note)=>{
    const search=searchTerm.trim().toLowerCase()
    const matchesSearch=!search
      || note.title.toLowerCase().includes(search)
      || stripHtml(note.content).toLowerCase().includes(search)

    let matchesFilter=true
    if(filterValue==='favorites') matchesFilter=Boolean(note.favorite)
    else if(filterValue!=='all') matchesFilter=note.color===filterValue

    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen">
      <Toolbar
        boardStyle={boardStyle}
        setBoardStyle={setBoardStyle}
        onNewNote={openNewNoteEditor}
        mode={mode}
        setMode={setMode}
        columns={columns}
        setColumns={setColumns}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        shapeType={shapeType}
        setShapeType={setShapeType}
      />

      <div className={`min-h-[calc(100vh-64px)] p-8 ${boardClass[boardStyle]}`}>
        {loading && <p className="text-center">Loading notes...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!loading && !error && notes.length===0 && (
          <p className="text-center">No notes yet, click + New Note to make one.</p>
        )}
        {!loading && !error && notes.length>0 && visibleNotes.length===0 && (
          <p className="text-center">No notes match your search/filter.</p>
        )}
        {mode==='shapes' && visibleNotes.length>0 && visibleNotes.length<6 && (
          <p className="text-center text-sm text-gray-600 mb-2">
            Add a few more notes to see the shape clearly - it's hard to tell with only {visibleNotes.length}.
          </p>
        )}

        {mode==='organized' && (
          <div
            className="grid gap-4 sm:gap-8 justify-center"
            style={{ gridTemplateColumns:`repeat(${getEffectiveColumns()}, 192px)` }}
          >
            {visibleNotes.map((note)=>(
              <StickyNote
                key={note.id}
                note={note}
                onEdit={openEditNoteEditor}
                onDelete={handleDeleteNote}
                onColorChange={handleColorChange}
                onToggleFavorite={handleToggleFavorite}
                onBringToFront={handleBringToFront}
                onSendToBack={handleSendToBack}
                onMenuToggle={handleMenuToggle}
              />
            ))}
          </div>
        )}

        {mode==='free' && (
          <div className="overflow-auto" ref={boardRef}>
            <div
              className={`relative ${boardClass[boardStyle]}`}
              style={{ ...getContentSize(positions), minHeight:'70vh' }}
            >
              {visibleNotes.map((note, index)=>(
                <DraggableNote
                  key={`${note.id}-${windowWidth}`}
                  note={note}
                  position={getPosition(note, index)}
                  zIndex={getZIndexFor(note)}
                  onStop={handleDragStop}
                  onEdit={openEditNoteEditor}
                  onDelete={handleDeleteNote}
                  onColorChange={handleColorChange}
                  onToggleFavorite={handleToggleFavorite}
                  onBringToFront={handleBringToFront}
                  onSendToBack={handleSendToBack}
                  onMenuToggle={handleMenuToggle}
                />
              ))}
            </div>
          </div>
        )}

        {mode==='shapes' && (
          <div className="overflow-auto" ref={boardRef}>
            <div
              className={`relative ${boardClass[boardStyle]}`}
              style={{ ...getContentSize(shapePositions), minHeight:'70vh' }}
            >
              {visibleNotes.map((note, index)=>(
                <DraggableNote
                  key={`${note.id}-${shapeVersion}`}
                  note={note}
                  position={getShapePosition(note, index)}
                  zIndex={getZIndexFor(note)}
                  onStop={handleShapeDragStop}
                  onEdit={openEditNoteEditor}
                  onDelete={handleDeleteNote}
                  onColorChange={handleColorChange}
                  onToggleFavorite={handleToggleFavorite}
                  onBringToFront={handleBringToFront}
                  onSendToBack={handleSendToBack}
                  onMenuToggle={handleMenuToggle}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <NoteEditor
        isOpen={editorOpen}
        initialNote={editingNote}
        onSave={handleSaveNote}
        onCancel={closeEditor}
      />
    </div>
  )
}

export default Dashboard