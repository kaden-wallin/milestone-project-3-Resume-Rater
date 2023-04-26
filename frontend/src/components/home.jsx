import React from "react"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate("/login")
  };

  const handleRegister = () => {
    navigate("/register")
  };

  return (
    <div>
      <h1>Welcome to My App</h1>
      <div>
        <button onClick={handleLogin}>Login</button>
        <button onClick={handleRegister}>Register</button>
      </div>
    </div>
  );
};

export default Home
