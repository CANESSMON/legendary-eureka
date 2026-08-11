import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="h3 mb-4 text-slate-900">JobPortal India</h3>
            <p className="max-w-md text-slate-600 mb-6">
              Empowering the Indian workforce by connecting top talent with the best local and national opportunities. From metro cities to emerging hubs, find your next big career move here.
            </p>
            <p className="font-semibold text-primary">Made with ❤️ in India</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">For Job Seekers</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-primary transition-colors">Browse Jobs</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Top Companies</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Salary Trends</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Career Advice</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-slate-900 mb-4">For Employers</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-primary transition-colors">Post a Job</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Search Resumes</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Hiring Solutions</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center">
          <p className="mb-4 md:mb-0">© {new Date().getFullYear()} JobPortal India. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="/safety" className="hover:text-primary transition-colors">Trust & Safety</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
