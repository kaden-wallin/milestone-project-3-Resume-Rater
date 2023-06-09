import React from 'react';
import { useNavigate } from 'react-router-dom';
import setAuthToken from './setAuthToken';
import SearchResumes from './searchResumes';
import IsMobile, {
    buttonStyles,
    buttonStyles2,
    buttonStylesM,
    buttonStyles2M,
    containerStyles,
    titleStyleTop,
    titleStyleTopM,
    titleStyleBottom,
    titleStyleBottomM
} from '../styles';

// These are my different buttons
const Home = ({ user, setUser }) => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login')
    };

    const handleRegister = () => {
        navigate('/register')
    };

    const handleResumeUpload = () => {
        navigate('/resume-uploader')
    };

    const handleLogout = () => {
        setUser(null)
        localStorage.removeItem('access_token')
    };

// This is how the search function works, code for the actual displaying of the results are in the searchResumes component
    const handleSearch = async (searchKeywords) => {
        try {
            const response = await fetch(`https://rottenresumes.pythonanywhere.com/api/search-resumes/${searchKeywords}`);
            const searchResults = await response.json();
            navigate('https://rottenresumes.pythonanywhere.com/search-results', { state: { searchResults } });
        } catch (error) {
            console.error(error);
        };
    };

// These are the media query variables and function to set it
    const isMobile = IsMobile();

    const titleTop = isMobile ? titleStyleTop : titleStyleTopM
    const titleBottom = isMobile ? titleStyleBottom : titleStyleBottomM
    const button = isMobile ? buttonStyles : buttonStylesM
    const button2 = isMobile ? buttonStyles2 : buttonStyles2M

    window.addEventListener('load', () => {
        setAuthToken(localStorage.getItem('access_token'))
    });

    const isAuthenticated = user && localStorage.getItem('access_token')

// I needed to do several conditional statements for component rendering so sorry in advance
    return (
        <div style={containerStyles} >
            {isAuthenticated ? (
                <div>
                    <h1 style={titleTop}>Rotten</h1>
                    <h1 style={titleBottom}>Resumes</h1>
                    <div>
                        <button style={button2} onClick={handleLogout}>Logout</button>
                        <button style={button} onClick={handleResumeUpload}>Upload Resume</button>
                    </div>
                    <SearchResumes handleSearch={handleSearch} />
                </div>
            ) : (
                <div>
                    <h1 style={titleTop}>Rotten</h1>
                    <h1 style={titleBottom}>Resumes</h1>
                    <div>
                        <button style={button2} onClick={handleLogin}>Login</button>
                        <button style={button} onClick={handleRegister}>Register</button>
                    </div>
                    <SearchResumes handleSearch={handleSearch} />
                </div>
            )}
        </div>
    );
};

export default Home
