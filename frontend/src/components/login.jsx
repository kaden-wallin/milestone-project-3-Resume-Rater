import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import IsMobile, {
    errorStyle,
    fontSizeStyle,
    fontSizeStyleM,
    buttonStyles,
    buttonStylesM,
    buttonStyles2,
    buttonStyles2M,
    h1StyleTop,
    h1StyleTopM,
    h1StyleBottom,
    h1StyleBottomM,
    placeHolderStyles,
    placeHolderStylesM,
    letteringStyle,
    containerStyles
} from '../styles';

// This is where the login info is set and sent to the route
const LoginForm = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const response = await axios.post('https://rottenresumes.pythonanywhere.com/api/login', {
                email,
                password
            });

            setUser(response.data.user)
            localStorage.setItem('access_token', response.data.user.access_token)
            navigate('/')
        } catch (error) {
            setErrorMessage('Email or password incorrect')
        };
    };

    const register = () => {
        navigate('/register')
    };

    const home = () => {
        navigate('/')
    };

// These are the media query variables and function to set it
    const isMobile = IsMobile();

    const h1Top = isMobile ? h1StyleTop : h1StyleTopM
    const h1Bottom = isMobile ? h1StyleBottom : h1StyleBottomM
    const fontSize = isMobile ? fontSizeStyle : fontSizeStyleM
    const button = isMobile ? buttonStyles : buttonStylesM
    const button2 = isMobile ? buttonStyles2 : buttonStyles2M
    const placeHolder = isMobile ? placeHolderStyles : placeHolderStylesM

    return (
        <div style={containerStyles}>
            <h1 style={h1Top}>Login here</h1>
            <h1 style={h1Bottom}> and Critique</h1>
            {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
            <form style={letteringStyle} onSubmit={handleSubmit}>

                <label style={fontSize} htmlFor='email'>Email</label>
                <input
                    placeholder='example@email.com'
                    style={placeHolder}
                    type='email'
                    name='email'
                    autoComplete='email'
                    required
                    onChange={(event) => setEmail(event.target.value)}
                />
                <br></br>
                <label style={fontSize} htmlFor='password'>Password</label>
                <input
                    placeholder='password123'
                    style={placeHolder}
                    type='password'
                    name='password'
                    autoComplete='current-password'
                    required
                    onChange={(event) => setPassword(event.target.value)}
                />
                <button style={button2} type='submit'>Log in</button>
                <p style={fontSize}>New? Register here</p>
                <button style={button2} onClick={register}>Register</button>
                <button style={button} onClick={home}>Back</button>
            </form>
        </div>
    );
};

export default LoginForm;