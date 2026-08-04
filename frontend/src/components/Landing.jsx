import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search } from 'lucide-react';
import { API_BASE_URL } from '../config';

const Landing = () => {
  const [locationQuery, setLocationQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // Fetch suggestions when query changes
  useEffect(() => {
    const q = locationQuery.strip ? locationQuery.strip() : locationQuery.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const timer = setTimeout(() => {
      fetch(`${API_BASE_URL}/api/locations/suggest?q=${encodeURIComponent(q)}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setSuggestions(data);
            setShowSuggestions(data.length > 0);
          }
        })
        .catch(err => console.error('Error fetching suggestions:', err));
    }, 150); // Small debounce

    return () => clearTimeout(timer);
  }, [locationQuery]);

  const handleSuggestionClick = (suggestion) => {
    setLocationQuery(suggestion.value);
    setShowSuggestions(false);
    setActiveIndex(-1);
    navigate(`/jobs?location=${encodeURIComponent(suggestion.value)}`);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) {
        handleSuggestionClick(suggestions[activeIndex]);
      } else {
        handleSearch(e);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (locationQuery.trim()) {
      setShowSuggestions(false);
      navigate(`/jobs?location=${encodeURIComponent(locationQuery.trim())}`);
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-center items-center px-6 relative bg-white">
      <div className="w-full max-w-4xl text-center flex flex-col items-center animate-fade-in">

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-sm font-medium text-indigo-600 mb-8 animate-fade-in [animation-delay:100ms]">
          <span className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_8px_#818cf8]"></span>
          New jobs added daily
        </div>

        <h1 className="mb-6 animate-fade-in [animation-delay:200ms]">
          Find your dream job in<br />
          <span className="bg-gradient-to-br from-indigo-600 to-purple-600 text-transparent bg-clip-text">your area.</span>
        </h1>

        <p className="max-w-2xl mb-12 animate-fade-in [animation-delay:300ms]">
          Discover thousands of local opportunities tailored to your skills.
          Enter your area, city, or pincode below to get started.
        </p>

        <div ref={wrapperRef} className="w-full max-w-2xl relative animate-fade-in [animation-delay:400ms]">
          <form
            onSubmit={handleSearch}
            className="flex flex-col md:flex-row p-2 rounded-3xl md:rounded-full w-full bg-white border border-slate-200 shadow-xl shadow-slate-200/50 transition-all duration-300 focus-within:-translate-y-1 focus-within:shadow-2xl focus-within:shadow-slate-300/50 focus-within:border-primary gap-4 md:gap-0 relative z-20"
          >
            <div className="flex items-center flex-1 px-5 py-3 md:py-0">
              <MapPin className="text-slate-400 mr-3" size={24} />
              <input
                type="text"
                placeholder="Enter area, city or pincode (e.g. Sadar, Nagpur or 440001)"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                className="bg-transparent border-none text-slate-900 text-lg w-full outline-none placeholder:text-slate-400"
                required
                autoComplete="off"
              />
            </div>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-full transition-all shadow-lg shadow-primary/30 w-full md:w-auto"
            >
              <Search size={20} />
              <span>Search</span>
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-4 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in mx-2 md:mx-0 max-h-72 overflow-y-auto">
              <ul className="py-2">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`px-6 py-3 cursor-pointer flex items-center text-left transition-colors ${index === activeIndex ? 'bg-slate-100 text-primary' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                  >
                    <MapPin className={`mr-3 ${index === activeIndex ? 'text-primary' : 'text-slate-400'}`} size={18} />
                    <span className="text-sm font-medium">{suggestion.display}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Landing;
