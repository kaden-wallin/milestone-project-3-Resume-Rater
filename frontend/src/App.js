import { Routes, Route } from 'react-router-dom'
import LoginForm from './components/login';
import RegisterForm from './components/register';
import Index from './components/front';

function App() {
    return (
        <Routes>
            <Route path='/' element={<Index />} />
            <Route path='/login' element={<LoginForm />} />
            <Route path='/register' element={<RegisterForm />} />
        </Routes>
     )
}

export default App
