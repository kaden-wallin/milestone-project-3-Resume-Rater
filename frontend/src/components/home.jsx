import React from "react"
import { useNavigate } from "react-router-dom"
import setAuthToken from './setAuthToken'
import SearchResumes from "./searchResumes";
import IsMobile from "../styles";
import { 
    buttonStyles,
    buttonStyles2, 
    containerStyles, 
    titleStyleTop, 
    titleStyleTopM, 
    titleStyleBottom,
    titleStyleBottomM 
} from '../styles';

const Home = ({ user, setUser }) => {
    const navigate = useNavigate()

    const handleLogin = () => {
        navigate("/login")
    }

    const handleRegister = () => {
        navigate("/register")
    }

    const handleResumeUpload = () => {
        navigate("/resume-uploader")
    }

    const handleLogout = () => {
        setUser(null)
        localStorage.removeItem("access_token")
    }

    const handleSearch = async (searchKeywords) => {
        try {
          const response = await fetch(`https://rottenresumes.pythonanywhere.com/api/search-resumes/${searchKeywords}`);
          const searchResults = await response.json();
          navigate("/search-results", { state: { searchResults } });
        } catch (error) {
          console.error(error);
        }
    };

    const isMobile = IsMobile()

    const titleTop = isMobile ? titleStyleTop : titleStyleTopM
    const titleBottom = isMobile ? titleStyleBottom : titleStyleBottomM

    window.addEventListener('load', () => {
        setAuthToken(localStorage.getItem('access_token'))
    })

    const isAuthenticated = user && localStorage.getItem("access_token")

    return (
        <div style={containerStyles} >
            {isAuthenticated ? (
            <div>
                <h1 style={titleTop}>Rotten</h1>
                <h1 style={titleBottom}>Resumes</h1>
                <div>
                    <button style={buttonStyles2} onClick={handleLogout}>Logout</button>
                    <button style={buttonStyles} onClick={handleResumeUpload}>Upload Resume</button>
                </div>
                <SearchResumes handleSearch={handleSearch} />
            </div>
            ) : (
                <div>
                <h1 style={titleTop}>Rotten</h1>
                <h1 style={titleBottom}>Resumes</h1>
                <div>
                    <button style={buttonStyles2} onClick={handleLogin}>Login</button>
                    <button style={buttonStyles} onClick={handleRegister}>Register</button>
                </div>
                <SearchResumes handleSearch={handleSearch} />
            </div>
            )}
        </div>
    );
};

export default Home
