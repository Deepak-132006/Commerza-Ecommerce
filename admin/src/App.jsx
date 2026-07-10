import React from 'react'
import api from './axios/api'
import { useState } from 'react'
import { useNavigate } from "react-router-dom";


const App = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()
  const handleLogin = async () => {
    try{
      const res = await api.post("/auth/login", {
        email,
        password
      })
      console.log(res.data);
      localStorage.setItem("accessToken", res.data.accessToken)
      localStorage.setItem("refreshToken", res.data.refreshToken)
      localStorage.setItem("name", res.data.name)
      localStorage.setItem("email", res.data.email)
      localStorage.setItem("role", res.data.role)
      navigate("/create")
    } catch (error) {
      console.error(error)
    }

  }
  return (
    <div className='flex flex-col items-center justify-center mt-50 gap-3'>
      <input type="email"  value={email} onChange={(e) => setEmail(e.target.value)} className='border p-3' placeholder='Enter email'/>
      <input type="password"  value={password} onChange={(e) => setPassword(e.target.value)} className='border p-3' placeholder='Enter Password'/>
      <button className='border p-2' onClick={handleLogin}>Submit</button>

    </div>
  )
}

export default App