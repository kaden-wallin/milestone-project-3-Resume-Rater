import React, { useState } from "react";
import axios from 'axios'

const RegisterForm = ({ setUser }) => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await axios.post('/register', { username, email, password })
      setUser(response.data.user)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      <label htmlFor="username">Username</label>
      <input
        type="text"
        name="username"
        required
        onChange={(event) => setUsername(event.target.value)}
      />
      <label htmlFor="email">Email</label>
      <input
        type="email"
        name="email"
        required
        onChange={(event) => setEmail(event.target.value)}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        required
        onChange={(event) => setPassword(event.target.value)}
      />
      <button type="submit">Register</button>
    </form>
  )
}

export default RegisterForm