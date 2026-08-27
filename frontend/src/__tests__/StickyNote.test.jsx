import { render, screen, fireEvent } from '@testing-library/react'
import StickyNote from '../components/StickyNote'

const baseNote={
  id:'1',
  title:'Test note',
  content:'<p>hello <b>world</b></p>',
  color:'yellow',
  favorite:false,
}

function renderNote(note=baseNote){
  const handlers={
    onEdit:jest.fn(),
    onDelete:jest.fn(),
    onColorChange:jest.fn(),
    onToggleFavorite:jest.fn(),
    onBringToFront:jest.fn(),
    onSendToBack:jest.fn(),
    onMenuToggle:jest.fn(),
  }
  const result=render(<StickyNote note={note} {...handlers} />)
  return { ...handlers, ...result }
}

describe('StickyNote', () => {
  it('renders the title and strips html tags from the content preview', () => {
    renderNote()
    expect(screen.getByText('Test note')).toBeInTheDocument()
    expect(screen.getByText('hello world')).toBeInTheDocument()
  })

  it('does not show the favorite pin when the note is not favorited', () => {
    const { container }=renderNote()
    expect(container.querySelector('.pin-icon')).not.toBeInTheDocument()
  })

  it('shows the favorite pin when the note is favorited', () => {
    const { container }=renderNote({ ...baseNote, favorite:true })
    expect(container.querySelector('.pin-icon')).toBeInTheDocument()
  })

  it('opens the three dot menu and calls onEdit when Edit is clicked', () => {
    const { onEdit }=renderNote()
    fireEvent.click(screen.getByText('⋮'))
    fireEvent.click(screen.getByText('Edit'))
    expect(onEdit).toHaveBeenCalledWith(baseNote)
  })

  it('asks for confirmation before deleting, and deletes when confirmed', () => {
    window.confirm=jest.fn(()=>true)
    const { onDelete }=renderNote()
    fireEvent.click(screen.getByText('⋮'))
    fireEvent.click(screen.getByText('Delete'))
    expect(window.confirm).toHaveBeenCalled()
    expect(onDelete).toHaveBeenCalledWith('1')
  })

  it('does not delete if the confirmation is cancelled', () => {
    window.confirm=jest.fn(()=>false)
    const { onDelete }=renderNote()
    fireEvent.click(screen.getByText('⋮'))
    fireEvent.click(screen.getByText('Delete'))
    expect(onDelete).not.toHaveBeenCalled()
  })

  it('toggles favorite status when Favorite is clicked', () => {
    const { onToggleFavorite }=renderNote()
    fireEvent.click(screen.getByText('⋮'))
    fireEvent.click(screen.getByText('Favorite'))
    expect(onToggleFavorite).toHaveBeenCalledWith('1', true)
  })

  it('double clicking the note calls onEdit directly', () => {
    const { onEdit }=renderNote()
    fireEvent.doubleClick(screen.getByText('Test note'))
    expect(onEdit).toHaveBeenCalledWith(baseNote)
  })
})