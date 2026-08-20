import { useState, useEffect } from 'react'
import Toolbar from '../components/Toolbar'
import StickyNote from '../components/StickyNote'
import NoteEditor from '../components/NoteEditor'
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

function Dashboard(){
  const [boardStyle, setBoardStyle]=useState('cork')
  const [notes, setNotes]=useState([])
  const [loading, setLoading]=useState(true)
  const [error, setError]=useState('')

  const [editorOpen, setEditorOpen]=useState(false)
  const [editingNote, setEditingNote]=useState(null)

  async function fetchNotes(){
    try{
      const res=await api.get('/notes')
      const mapped=res.data.data.map((n)=>({
        id:n._id,
        title:n.title,
        content:n.content,
        color:pickColor(n._id),
      }))
      setNotes(mapped)
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

  return (
    <div className="min-h-screen">
      <Toolbar boardStyle={boardStyle} setBoardStyle={setBoardStyle} onNewNote={openNewNoteEditor} />

      <div className={`min-h-[calc(100vh-64px)] p-8 ${boardClass[boardStyle]}`}>
        {loading && <p className="text-center">Loading notes...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}
        {!loading && !error && notes.length===0 && (
          <p className="text-center">No notes yet, click + New Note to make one.</p>
        )}

        <div className="flex flex-wrap gap-8 justify-center sm:justify-start">
          {notes.map((note)=>(
            <StickyNote key={note.id} note={note} onEdit={openEditNoteEditor} onDelete={handleDeleteNote} />
          ))}
        </div>
      </div>

      <NoteEditor isOpen={editorOpen} initialNote={editingNote} onSave={handleSaveNote} onCancel={closeEditor} />
    </div>
  )
}

export default Dashboard