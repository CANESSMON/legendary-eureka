import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Menu } from 'lucide-react';

const Navbar = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));

  useEffect(() => {
    const updateAuth = () => {
      setToken(localStorage.getItem('token'));
      setUserRole(localStorage.getItem('userRole'));
    };

    window.addEventListener('storage', updateAuth);
    window.addEventListener('focus', updateAuth);

    const interval = setInterval(updateAuth, 800);

    return () => {
      window.removeEventListener('storage', updateAuth);
      window.removeEventListener('focus', updateAuth);
      clearInterval(interval);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-slate-900 cursor-pointer h3 no-underline">
          <Briefcase className="text-primary" />
          <span>JobPortal</span>
        </Link>

        <div className="hidden md:flex gap-8 items-center font-medium text-sm">
          <Link to="/jobs" className="transition-colors hover:text-primary text-slate-600 no-underline">Jobs</Link>
          <Link to="/about" className="transition-colors hover:text-primary text-slate-600 no-underline">About</Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {token ? (
            userRole === 'AGENT' ? (
              <Link to="/agent" className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg shadow-primary/30 no-underline btn inline-block">
                Agent Console
              </Link>
            ) : (
              <Link to="/employer" className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg shadow-primary/30 no-underline btn inline-block">
                Employer Console
              </Link>
            )
          ) : (
            <Link to="/auth" className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg transition-all transform hover:-translate-y-0.5 shadow-lg shadow-primary/30 no-underline btn inline-block">
              Login / Sign Up
            </Link>
          )}
        </div>

        <button className="md:hidden text-slate-900 bg-transparent border-0 cursor-pointer">
          <Menu />
        </button>

      </div>
    </nav>
  );
};

export default Navbar;
