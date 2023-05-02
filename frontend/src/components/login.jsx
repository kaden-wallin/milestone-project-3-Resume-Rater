import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { 
    errorStyle, 
    buttonStyles2, 
    titleStyleBottom, 
    titleStyleTop, 
    buttonStyles, 
    letteringStyle, 
    containerStyles 
} from "../styles";

const LoginForm = ({ setUser }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const response = await axios.post("rottenresumes.pythonanywhere.com/api/login", {
                email,
                password
            })

            setUser(response.data.user)
            localStorage.setItem('access_token', response.data.user.access_token)
            navigate('/')
        } catch (error) {
            setErrorMessage('Email or password incorrect')
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
            <h1 style={titleStyleTop}>Login here</h1>
            <h1 style={titleStyleBottom}> and Critique</h1>
            {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
            <form style={letteringStyle} onSubmit={handleSubmit}>
                
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
                <button style={buttonStyles2} type="submit">Log in</button>
                <p>New? Register here</p>
                <button style={buttonStyles2} onClick={register}>Register</button>
                <button style={buttonStyles} onClick={home}>Back</button>
            </form>
        </div>
    )
}

export default LoginForm