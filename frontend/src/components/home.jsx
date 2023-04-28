import React from "react"
import { useNavigate } from "react-router-dom"

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
            </div>
            ) : (
                <div>
                <h1>Welcome to Rotten Resumes</h1>
                <div>
                    <button onClick={handleLogin}>Login</button>
                    <button onClick={handleRegister}>Register</button>
                </div>
            </div>
            )}
        </>
    );
};

export default Home
