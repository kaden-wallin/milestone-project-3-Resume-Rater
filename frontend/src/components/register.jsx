import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const RegisterForm = ({ setUser }) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post("http://localhost:5000/register", {
                username,
                email,
                password,
            });

            setUser(response.data.user);
            navigate('/')
        } catch (error) {
            console.error(error);
        }
    }

    const login = () => {
        navigate('/login')
    }

    const home = () => {
        navigate('/')
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
                autoComplete="email"
                required
                onChange={(event) => setEmail(event.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
                type="password"
                name="password"
                minLength="8"
                autoComplete="current-password"
                required
                onChange={(event) => setPassword(event.target.value)}
            />
            <button type="submit">Register</button>
            <p>Already have an account? Login here</p>
            <button onClick={login}>Login</button>
            <button onClick={home}>Back</button>
        </form>
    )
}

export default RegisterForm