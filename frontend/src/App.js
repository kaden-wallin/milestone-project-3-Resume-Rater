import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/home';
import LoginForm from './components/login';
import RegisterForm from './components/register';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
