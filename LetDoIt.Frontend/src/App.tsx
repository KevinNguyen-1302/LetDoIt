import Login from './pages/Login'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Topnavbar from './components/Topnavbar';
import Sidebar from './components/Sidebar';

function AppContent() {
  const location = useLocation();
  const showNavigation = location.pathname !== '/login' && location.pathname !== '/register';

  return (
    <div className="App">
      <main>
        {showNavigation && <Topnavbar />}
        {showNavigation && <Sidebar />}
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={4000} />
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
