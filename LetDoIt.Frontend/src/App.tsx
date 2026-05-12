import Login from './pages/Login'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Register from './pages/Register'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Topnavbar from './components/Topnavbar';
import Sidebar from './components/Sidebar';
import Analytic from './pages/Analytics';
import Focus from './pages/Focus';
import Calendar from './pages/Calendar';
import { isAuthenticated, isTokenExpiring, refreshTokenAsync, logout } from './services/authService';
import { useEffect, useState } from 'react';

function App() {
  const location = useLocation();
  const showNavigation = location.pathname !== '/login' && location.pathname !== '/register';
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
  }, [location]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <main>
        {showNavigation && <Topnavbar />}
        {showNavigation && <Sidebar />}
        <Routes>
          <Route path="/" element={isAuth ? <Navigate to="/home" /> : <Navigate to="/login" />} />
          <Route path='/home' element={isAuth ? <Home /> : <Navigate to="/login" />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/calendar' element={isAuth ? <Calendar /> : <Navigate to="/login" />} />
          <Route path='/focus' element={isAuth ? <Focus /> : <Navigate to="/login" />} />
          <Route path='/analytics' element={isAuth ? <Analytic /> : <Navigate to="/login" />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={4000} />
      </main>
    </div>
  )
}

export default App
