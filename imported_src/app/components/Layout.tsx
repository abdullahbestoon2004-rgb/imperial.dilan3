import { Outlet } from 'react-router';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export default function Layout() {
  return (
    <div className="font-['Inter']">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
