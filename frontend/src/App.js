import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import Home from './components/home';
import LoginForm from './components/login';
import RegisterForm from './components/register';
import ResumeUploader from './components/resumeUploader';
import ViewResume from './components/resumeViewer';
import SearchResumes from './components/searchResumes';

function App() {
    const [user, setUser] = useState(null)

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Home user={user} setUser={setUser} />} />
                <Route path='/login' element={<LoginForm setUser={setUser} />} />
                <Route path='/register' element={<RegisterForm setUser={setUser} />} />
                <Route path='/resume-uploader' element={<ResumeUploader user={user} />} />
                <Route path='/resumes/:resumeId' element={<ViewResume user={user} />} />
                <Route path='/resumes/search' elemt={<SearchResumes />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App
