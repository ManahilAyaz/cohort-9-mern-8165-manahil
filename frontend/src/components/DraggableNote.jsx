import { useRef } from 'react'
import Draggable from 'react-draggable'
import StickyNote from './StickyNote'

function DraggableNote({ note, position, zIndex, onStop, onEdit, onDelete, onColorChange, onToggleFavorite, onBringToFront, onSendToBack, onMenuToggle }){
  const nodeRef=useRef(null)

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={position}
      bounds="parent"
      cancel="button,input"
      onStop={(e, data)=>onStop(note.id, data.x, data.y)}
    >
      <div ref={nodeRef} className="absolute cursor-move" style={{ zIndex }}>
        <StickyNote
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
          onColorChange={onColorChange}
          onToggleFavorite={onToggleFavorite}
          onBringToFront={onBringToFront}
          onSendToBack={onSendToBack}
          onMenuToggle={onMenuToggle}
        />
      </div>
    </Draggable>
  )
}

export default DraggableNote