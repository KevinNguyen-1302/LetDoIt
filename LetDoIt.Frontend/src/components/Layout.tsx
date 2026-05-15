import Topnavbar from './Topnavbar';
import Sidebar from './Sidebar';
import { ToastContainer } from 'react-toastify';
import { Outlet } from 'react-router-dom';

// interface LayoutProps {
//   children: ReactNode;
// }

const Layout = () => {
  return (
    <div className="h-screen flex flex-col">
      <Topnavbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <ToastContainer position="top-right" autoClose={4000} />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
