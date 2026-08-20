import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Login(){
  const [email, setEmail]=useState('')
  const [password, setPassword]=useState('')
  const [error, setError]=useState('')
  const navigate=useNavigate()
  const { login }=useAuth()

  async function handleSubmit(e){
    e.preventDefault()
    setError('')
    try{
      const res=await api.post('/auth/login', { email, password })
      const { token, user }=res.data.data
      login(user, token)
      navigate('/')
    }catch(err){
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center board-cork">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h1 className="text-2xl font-bold mb-4">Log in</h1>

        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

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
          placeholder="Password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          className="border w-full p-2 mb-3 rounded"
          required
        />

        <button type="submit" className="bg-yellow-400 w-full py-2 rounded font-bold">
          Log in
        </button>

        <p className="text-sm mt-3 text-center">
          No account? <Link to="/signup" className="text-blue-600">Sign up</Link>
        </p>
      </form>
    </div>
  )
}

export default Login