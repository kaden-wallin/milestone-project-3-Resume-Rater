import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const LoginForm = ({ setUser }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const response = await axios.post("http://localhost:5000/login", {
                email,
                password
            })

            setUser(response.data.user)
            localStorage.setItem('token', response.data.user.token)
            navigate('/')
        } catch (error) {
            console.error(error)
        }
    }

    const register = () => {
        navigate('/register')
    }

    const home = () => {
        navigate('/')
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Login</h1>
            <label htmlFor="email">Email</label>
            <input
                type="email"
                name="email"
                autoComplete="email"
                required
                onChange={(event) => setEmail(event.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
                type="password"
                name="password"
                autoComplete="current-password"
                required
                onChange={(event) => setPassword(event.target.value)}
            />
            <button type="submit">Log in</button>
            <p>New? Register here</p>
            <button onClick={register}>Register</button>
            <button onClick={home}>Back</button>
        </form>
    )
}

export default LoginForm