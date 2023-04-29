import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { titleStyle, buttonStyles, buttonStylesCR, containerStyles } from "./styles";

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
            localStorage.setItem('access_token', response.data.user.access_token)
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
        <div style={containerStyles}>
            <h1 style={titleStyle} >Login</h1>
            <form style={buttonStylesCR} onSubmit={handleSubmit}>
                
                <label htmlFor="email">Email</label>
                <input
                    style={buttonStyles}
                    type="email"
                    name="email"
                    autoComplete="email"
                    required
                    onChange={(event) => setEmail(event.target.value)}
                />
                <br></br>
                <label htmlFor="password">Password</label>
                <input
                    style={buttonStyles}
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    required
                    onChange={(event) => setPassword(event.target.value)}
                />
                <br></br>
                <button style={buttonStyles} type="submit">Log in</button>
                <p>New? Register here</p>
                <button style={buttonStyles} onClick={register}>Register</button>
                <button style={buttonStyles} onClick={home}>Back</button>
            </form>
        </div>
    )
}

export default LoginForm