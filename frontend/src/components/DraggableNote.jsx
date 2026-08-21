import { useRef } from 'react'
import Draggable from 'react-draggable'
import StickyNote from './StickyNote'

function DraggableNote({ note, position, onStop, onEdit, onDelete }){
  const nodeRef=useRef(null)

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={position}
      cancel="button"
      onStop={(e, data)=>onStop(note.id, data.x, data.y)}
    >
      <div ref={nodeRef} className="absolute cursor-move">
        <StickyNote note={note} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </Draggable>
  )
}

export default DraggableNote