import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard'
import { AuthProvider } from '../context/AuthContext'
import api from '../api/axios'

jest.mock('../api/axios', () => ({
  __esModule:true,
  default:{
    get:jest.fn(),
    post:jest.fn(),
    patch:jest.fn(),
    delete:jest.fn(),
  },
}))

jest.mock('react-quill', () => {
  return function MockQuill({ value, onChange }){
    return (
      <textarea
        data-testid="content-editor"
        value={value}
        onChange={(e)=>onChange(e.target.value)}
      />
    )
  }
})

const sampleNotes=[
  { _id:'1', title:'Grocery list', content:'milk and eggs', color:'yellow', favorite:false },
  { _id:'2', title:'Meeting notes', content:'discuss project', color:'blue', favorite:true },
]

beforeEach(() => {
  jest.clearAllMocks()
  api.get.mockResolvedValue({ data:{ data:sampleNotes } })
})

function renderDashboard(){
  return render(
    <MemoryRouter>
      <AuthProvider>
        <Dashboard />
      </AuthProvider>
    </MemoryRouter>
  )
}

describe('Dashboard', () => {
  it('fetches and renders notes from the backend', async () => {
    renderDashboard()
    expect(await screen.findByText('Grocery list')).toBeInTheDocument()
    expect(screen.getByText('Meeting notes')).toBeInTheDocument()
  })

  it('filters the visible notes as you type in the search box', async () => {
    renderDashboard()
    await screen.findByText('Grocery list')

    fireEvent.change(screen.getByPlaceholderText('Search notes...'), { target:{ value:'meeting' } })

    expect(screen.queryByText('Grocery list')).not.toBeInTheDocument()
    expect(screen.getByText('Meeting notes')).toBeInTheDocument()
  })

  it('switches to free/messy mode when clicked', async () => {
    renderDashboard()
    await screen.findByText('Grocery list')

    fireEvent.click(screen.getByText('Free / Messy'))

    expect(screen.getByText('Free / Messy').className).toMatch(/bg-white/)
  })

  it('creates a new note through the editor', async () => {
    api.post.mockResolvedValue({ data:{ data:{} } })
    renderDashboard()
    await screen.findByText('Grocery list')

    fireEvent.click(screen.getByText('+ New Note'))
    fireEvent.change(screen.getByPlaceholderText('Title'), { target:{ value:'New note' } })
    fireEvent.click(screen.getByText('Save'))

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/notes', { title:'New note', content:'' })
    })
  })

  it('deletes a note after the user confirms', async () => {
    window.confirm=jest.fn(()=>true)
    api.delete.mockResolvedValue({})
    renderDashboard()
    await screen.findByText('Grocery list')

    fireEvent.click(screen.getAllByText('⋮')[0])
    fireEvent.click(screen.getAllByText('Delete')[0])

    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/notes/1')
    })
  })
})