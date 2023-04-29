import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import setAuthToken from './setAuthToken'

const Home = ({ user, setUser }) => {
    const navigate = useNavigate()
    const [resumeId, setResumeId] = useState("")

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

    const handleResumes = () => {
        navigate("/resumes")
    }

    const handleSearch = async (event) => {
        event.preventDefault();
        try {
          const response = await fetch(`http://localhost:5000/download-resume/${resumeId}`);
          const blob = await response.blob();
          const fileUrl = URL.createObjectURL(blob);
          navigate(`/resumes/${resumeId}`, { state: { fileUrl } });
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
                    <button onClick={handleResumes}>See Resumes</button>
                </div>
                <form onSubmit={handleSearch}>
                    <label htmlFor="resumeId">Search by Resume ID:</label>
                    <input
                        type="number"
                        id="resumeId"
                        value={resumeId}
                        onChange={(event) => setResumeId(event.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
            </div>
            ) : (
                <div>
                <h1>Welcome to Rotten Resumes</h1>
                <div>
                    <button onClick={handleLogin}>Login</button>
                    <button onClick={handleRegister}>Register</button>
                </div>
                <form onSubmit={handleSearch}>
                    <label htmlFor="resumeId">Search by Resume ID:</label>
                    <input
                        type="number"
                        id="resumeId"
                        value={resumeId}
                        onChange={(event) => setResumeId(event.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
            </div>
            )}
        </>
    );
};

export default Home
