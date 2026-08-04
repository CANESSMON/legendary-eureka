import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import About from './components/About';
import SearchResults from './components/SearchResults';
import Auth from './components/Auth';
import EmployerDashboard from './components/employer/EmployerDashboard';
import AgentDashboard from './components/agent/AgentDashboard';
import AdminDashboard from './components/admin/AdminDashboard';
import Footer from './components/Footer';
import { JobProvider } from './context/JobContext';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function AppContent() {
  const location = useLocation();
  const isEmployerRoute = location.pathname.startsWith('/employer');
  const isAgentRoute = location.pathname.startsWith('/agent');
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isConsoleRoute = isEmployerRoute || isAgentRoute || isAdminRoute;

  return (
    <div className="min-h-screen flex flex-col">
      {!isConsoleRoute && <Navbar />}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/jobs" element={<SearchResults />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/employer" element={<EmployerDashboard />} />
          <Route path="/employer/dashboard" element={<EmployerDashboard />} />
          <Route path="/agent" element={<AgentDashboard />} />
          <Route path="/agent/dashboard" element={<AgentDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
      {!isConsoleRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <JobProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </JobProvider>
  );
}

export default App;


