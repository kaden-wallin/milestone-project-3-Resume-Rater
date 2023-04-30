import React from "react"
import { useNavigate } from "react-router-dom"
import setAuthToken from './setAuthToken'
import SearchResumes from "./searchResumes";
import { buttonStyles, buttonStyles2, containerStyles, titleStyle, titleStyle2 } from './styles';

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
          const response = await fetch(`http://localhost:5000/search-resumes/${searchKeywords}`);
          const searchResults = await response.json();
          navigate("/search-results", { state: { searchResults } });
        } catch (error) {
          console.error(error);
        }
    };

    window.addEventListener('load', () => {
        setAuthToken(localStorage.getItem('access_token'))
    })

    const isAuthenticated = user && localStorage.getItem("access_token")

    return (
        <div style={containerStyles} >
            {isAuthenticated ? (
            <div>
                <h1 style={titleStyle}>Rotten</h1>
                <h1 style={titleStyle2}>Resumes</h1>
                <div>
                    <button style={buttonStyles2} onClick={handleLogout}>Logout</button>
                    <button style={buttonStyles} onClick={handleResumeUpload}>Upload Resume</button>
                </div>
                <SearchResumes handleSearch={handleSearch} />
            </div>
            ) : (
                <div>
                <h1 style={titleStyle}>Rotten</h1>
                <h1 style={titleStyle2}>Resumes</h1>
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
