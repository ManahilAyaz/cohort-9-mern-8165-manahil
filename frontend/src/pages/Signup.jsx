import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Signup(){
  const [name, setName]=useState('')
  const [email, setEmail]=useState('')
  const [password, setPassword]=useState('')
  const [error, setError]=useState('')
  const navigate=useNavigate()
  const { login }=useAuth()

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    try{
      const res=await api.post('/auth/signup', { name, email, password })
      const { token, user }=res.data.data
      login(user, token)
      navigate('/')
    }catch(err){
      setError(err.response?.data?.message || 'Signup failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center board-cork">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4">Sign up</h1>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          className="border w-full p-2 mb-3 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="border w-full p-2 mb-3 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="border w-full p-2 mb-3 rounded"
          minLength={6}
          required
        />

        <button type="submit" className="bg-yellow-400 w-full py-2 rounded font-bold">
          Sign up
        </button>

        <p className="text-sm mt-3 text-center">
          Already have an account? <Link to="/login" className="text-blue-600">Log in</Link>
        </p>
      </form>
    </div>
  )
}

export default Signup