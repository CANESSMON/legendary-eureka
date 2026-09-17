import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, Briefcase } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12 animate-fade-in">
      <div className="max-w-md w-full text-center space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm">
        
        {/* Brand Logo Header */}
        <div className="inline-flex items-center gap-2 text-primary font-bold text-lg">
          <Briefcase size={22} />
          <span>JobPortal</span>
        </div>

        {/* Simple 404 Text Header */}
        <h1 className="text-7xl sm:text-8xl font-black tracking-tighter text-indigo-600/90 select-none">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            Page Not Found
          </h2>
          <p className="text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
            Sorry, the page you are looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            <ArrowLeft size={15} />
            Go Back
          </button>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white font-semibold text-xs hover:bg-primary-hover transition-all shadow-sm shadow-primary/20 no-underline cursor-pointer"
          >
            <Home size={15} />
            Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
};

export default NotFound;
