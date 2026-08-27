import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import NoteEditor from '../components/NoteEditor'

jest.mock('react-quill', () => {
  return function MockQuill({ value, onChange, placeholder }){
    return (
      <textarea
        data-testid="content-editor"
        placeholder={placeholder}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
      />
    )
  }
})

describe('NoteEditor', () => {
  it('renders nothing when isOpen is false', () => {
    const { container }=render(
      <NoteEditor isOpen={false} initialNote={null} onSave={()=>{}} onCancel={()=>{}} />
    )
    expect(container).toBeEmptyDOMElement()
  })

  it('shows an error and does not save when title and content are both empty', async () => {
    const onSave=jest.fn()
    render(<NoteEditor isOpen={true} initialNote={null} onSave={onSave} onCancel={()=>{}} />)

    fireEvent.click(screen.getByText('Save'))

    expect(await screen.findByText(/add a title or some content/i)).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  it('calls onSave with the title and content when valid', async () => {
    const onSave=jest.fn().mockResolvedValue()
    render(<NoteEditor isOpen={true} initialNote={null} onSave={onSave} onCancel={()=>{}} />)

    fireEvent.change(screen.getByPlaceholderText('Title'), { target:{ value:'My note' } })
    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith('My note', '')
    })
  })

  it('calls onCancel when Cancel is clicked', () => {
    const onCancel=jest.fn()
    render(<NoteEditor isOpen={true} initialNote={null} onSave={()=>{}} onCancel={onCancel} />)

    fireEvent.click(screen.getByText('Cancel'))

    expect(onCancel).toHaveBeenCalled()
  })

  it('pre-fills the title and content when editing an existing note', () => {
    const note={ id:'1', title:'Existing note', content:'hi there' }
    render(<NoteEditor isOpen={true} initialNote={note} onSave={()=>{}} onCancel={()=>{}} />)

    expect(screen.getByDisplayValue('Existing note')).toBeInTheDocument()
    expect(screen.getByTestId('content-editor').value).toBe('hi there')
  })
})