import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Search, User, ShoppingCart } from 'lucide-react';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0B0B0B] shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <h1 className="text-2xl font-['Playfair_Display'] text-white">GENTLEMAN</h1>
            </Link>
          </div>

          {/* Center Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-white hover:text-[#C6A96B] transition-colors font-['Inter'] text-sm">
              Home
            </Link>
            <Link to="/suits" className="text-white hover:text-[#C6A96B] transition-colors font-['Inter'] text-sm">
              Suits
            </Link>
            <a href="#" className="text-white hover:text-[#C6A96B] transition-colors font-['Inter'] text-sm">
              Jackets
            </a>
            <a href="#" className="text-white hover:text-[#C6A96B] transition-colors font-['Inter'] text-sm">
              Shirts
            </a>
            <a href="#" className="text-white hover:text-[#C6A96B] transition-colors font-['Inter'] text-sm">
              Trousers
            </a>
            <a href="#" className="text-white hover:text-[#C6A96B] transition-colors font-['Inter'] text-sm">
              Shoes
            </a>
            <a href="#" className="text-white hover:text-[#C6A96B] transition-colors font-['Inter'] text-sm">
              Accessories
            </a>
            <a href="#" className="text-white hover:text-[#C6A96B] transition-colors font-['Inter'] text-sm">
              New Collection
            </a>
            <a href="#" className="text-white hover:text-[#C6A96B] transition-colors font-['Inter'] text-sm">
              Sale
            </a>
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-6">
            <button className="text-white hover:text-[#C6A96B] transition-colors">
              <Search size={20} />
            </button>
            <button className="text-white hover:text-[#C6A96B] transition-colors">
              <User size={20} />
            </button>
            <button className="text-white hover:text-[#C6A96B] transition-colors">
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}