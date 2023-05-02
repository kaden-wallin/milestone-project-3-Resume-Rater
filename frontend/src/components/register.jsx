import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { titleStyle2, titleStyle, buttonStyles, buttonStyles2, letteringStyle, containerStyles, errorStyle } from "./styles";

const RegisterForm = ({ setUser }) => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const response = await axios.post("http://localhost:5000/api/register", {
                username,
                email,
                password,
            });

            setUser(response.data.user)
            localStorage.setItem('access_token', response.data.user.access_token)
            navigate('/')
        } catch (error) {
            setErrorMessage('Email is already in use')
        }
    }

    const login = () => {
        navigate('/login')
    }

    const home = () => {
        navigate('/')
    }

    return (
        <div style={containerStyles}>
            <h1 style={titleStyle}>Register to</h1>
            <h1 style={titleStyle2}>get Started</h1>
            {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
            <form style={letteringStyle} onSubmit={handleSubmit}>
                <label htmlFor="username">Username</label>
                    <input
                        placeholder="user_321"
                        style={buttonStyles}
                        type="text"
                        name="username"
                        required
                        onChange={(event) => setUsername(event.target.value)}
                    />
                    <br></br>
                <label htmlFor="email">Email</label>
                    <input
                        placeholder="example@email.com"
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
                        placeholder="password123"
                        style={buttonStyles}
                        type="password"
                        name="password"
                        autoComplete="current-password"
                        required
                        onChange={(event) => setPassword(event.target.value)}
                    />
                <button style={buttonStyles2} type="submit">Register</button>
                <p>Already have an account? Login here</p>
                <button style={buttonStyles2} onClick={login}>Login</button>
                <button style={buttonStyles} onClick={home}>Back</button>
            </form>
        </div>
    )
}

export default RegisterForm