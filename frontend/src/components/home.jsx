import React from "react"
import { useNavigate } from "react-router-dom"
import setAuthToken from './setAuthToken'
import SearchResumes from "./searchResumes";

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
        <>
            {isAuthenticated ? (
            <div>
                <h1>Welcome to Rotten Resumes</h1>
                <div>
                    <button onClick={handleLogout}>Logout</button>
                    <button onClick={handleResumeUpload}>Upload Resume</button>
                </div>
                <SearchResumes handleSearch={handleSearch} />
            </div>
            ) : (
                <div>
                <h1>Welcome to Rotten Resumes</h1>
                <div>
                    <button onClick={handleLogin}>Login</button>
                    <button onClick={handleRegister}>Register</button>
                </div>
                <SearchResumes handleSearch={handleSearch} />
            </div>
            )}
        </>
    );
};

export default Home
