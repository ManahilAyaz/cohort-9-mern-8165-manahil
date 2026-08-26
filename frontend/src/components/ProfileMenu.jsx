import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

function ProfileMenu(){
  const [open, setOpen]=useState(false)
  const menuRef=useRef(null)
  const { user, logout }=useAuth()
  const navigate=useNavigate()

  useEffect(()=>{
    function handleClickOutside(e){
      if(menuRef.current && !menuRef.current.contains(e.target)){
        setOpen(false)
      }
    }
    if(open){
      document.addEventListener('mousedown', handleClickOutside)
    }
    return ()=>document.removeEventListener('mousedown', handleClickOutside)
  },[open])

  async function handleLogout(){
    try{
      await api.post('/auth/logout')
    }catch(err){
      // not critical, log the user out locally either way
    }
    logout()
    navigate('/login')
  }

  if(!user) return null

  const initial=user.name ? user.name.charAt(0).toUpperCase() : '?'

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={()=>setOpen(!open)}
        className="w-9 h-9 rounded-full bg-yellow-400 font-bold flex items-center justify-center"
      >
        {initial}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white text-black text-sm rounded shadow-lg border w-56 z-[300] p-3">
          <p className="font-semibold">{user.name}</p>
          <p className="text-gray-500 text-xs mb-3">{user.email}</p>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded hover:bg-gray-100 text-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  )
}

export default ProfileMenu