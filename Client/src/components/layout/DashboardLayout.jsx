import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import MobileDashboardNav from './MobileDashboardNav';
import Footer from './Footer';

export default function DashboardLayout() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)]">
      <Navbar />
      <MobileDashboardNav role={user?.role} />
      <div className="flex-1 flex max-w-7xl mx-auto w-full">
        <Sidebar role={user?.role} />
        <main className="flex-1 min-w-0 px-4 sm:px-6 py-8">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}
