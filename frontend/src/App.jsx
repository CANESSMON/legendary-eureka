import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import About from './components/About';
import SearchResults from './components/SearchResults';
import Auth from './components/Auth';
import EmployerDashboard from './components/employer/EmployerDashboard';
import Footer from './components/Footer';
import { JobProvider } from './context/JobContext';
import './App.css';

function App() {
  return (
    <JobProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/jobs" element={<SearchResults />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/employer" element={<EmployerDashboard />} />
              <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </JobProvider>
  );
}

export default App;

