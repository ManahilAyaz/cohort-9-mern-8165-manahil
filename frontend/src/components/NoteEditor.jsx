import { useState, useEffect } from 'react'

function NoteEditor({ isOpen, initialNote, onSave, onCancel }){
  const [title, setTitle]=useState('')
  const [content, setContent]=useState('')
  const [error, setError]=useState('')
  const [saving, setSaving]=useState(false)

  useEffect(()=>{
    if(initialNote){
      setTitle(initialNote.title || '')
      setContent(initialNote.content || '')
    }else{
      setTitle('')
      setContent('')
    }
    setError('')
  },[initialNote, isOpen])

  if(!isOpen) return null

  async function handleSave(){
    if(!title.trim() && !content.trim()){
      setError('Add a title or some content before saving.')
      return
    }
    setSaving(true)
    setError('')
    try{
      await onSave(title, content)
    }catch(err){
      setError(err.response?.data?.message || 'Could not save the note.')
    }finally{
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[300] p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
        <h2 className="text-xl font-bold mb-4">{initialNote ? 'Edit note' : 'New note'}</h2>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          className="border w-full p-2 mb-3 rounded font-semibold"
        />

        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e)=>setContent(e.target.value)}
          rows={6}
          className="border w-full p-2 mb-4 rounded resize-none"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 rounded border hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded bg-yellow-400 font-bold hover:bg-yellow-500 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NoteEditor