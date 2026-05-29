import Login from     './pages/Login'
import Home from      './pages/Home'
import Register from  './pages/Register'
import Analytic from  './pages/Analytics';
import Focus from     './pages/Focus';
import Calendar from  './pages/Calendar';
import KanbanPage from './pages/KanbanPage';
import Layout from './components/Layout';
import { Navigate, Route, Routes } from 'react-router-dom'
import { isAuthenticated, isTokenExpiring, refreshTokenAsync, logout } from './services/authService';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [isAuth, setIsAuth] = useState(isAuthenticated());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Nếu token expires trong 5 phút, thử refresh
        if (isTokenExpiring()) {
          const refreshed = await refreshTokenAsync();
          setIsAuth(refreshed);
        } else {
          setIsAuth(isAuthenticated());
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        logout();
        setIsAuth(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes (when token is saved in Login)
    const handleAuthChange = () => {
      setIsAuth(isAuthenticated());
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => window.removeEventListener('authChange', handleAuthChange);
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={isAuth ? <Navigate to="/home" /> : <Navigate to="/login" />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      
      {/* Protected routes with Layout */}
      <Route element={isAuth ? <Layout /> : <Navigate to="/login" />}>
        <Route path='/home' element={<Home />} />
        <Route path='/project/:projectId' element={<KanbanPage />} />
        <Route path='/calendar' element={<Calendar />} />
        <Route path='/focus' element={<Focus />} />
        <Route path='/analytics' element={<Analytic />} />
      </Route>
    </Routes>
  )
}

export default App
