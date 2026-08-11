import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Building2, MapPin, IndianRupee, Clock, ChevronDown, FilterX, Check, Filter, Flame, Zap, Phone, Calendar
} from 'lucide-react';
import citiesData from '../data/cities.json';
import ClassifiedsGrid from './ClassifiedsGrid';
import { useJobs } from '../context/JobContext';
import { API_BASE_URL } from '../config';


const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const locationParam = searchParams.get('location') || searchParams.get('city') || 'India';
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('classifieds'); // 'classifieds', 'grid', or 'table'
  const { jobs, trackWhatsAppApply } = useJobs();

  const [resolvedLocation, setResolvedLocation] = useState(null);

  // Fetch resolved location details (like area/city/state name) when location param changes
  useEffect(() => {
    if (locationParam && locationParam !== 'India') {
      fetch(`${API_BASE_URL}/api/locations/resolve?q=${encodeURIComponent(locationParam)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.display) {
            setResolvedLocation(data);
          }
        })
        .catch(err => console.error('Error resolving location:', err));
    } else {
      setResolvedLocation(null);
    }
  }, [locationParam]);

  // Location Autocomplete state
  const [inputCity, setInputCity] = useState(locationParam);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const locRef = useRef(null);

  // Multi-select state (temporary selections)
  const [categoriesSelected, setCategoriesSelected] = useState([]);
  const [typesSelected, setTypesSelected] = useState([]);
  const [filterSalary, setFilterSalary] = useState(0);

  // Applied filters state (actually used for filtering)
  const [appliedCategories, setAppliedCategories] = useState([]);
  const [appliedTypes, setAppliedTypes] = useState([]);
  const [appliedSalary, setAppliedSalary] = useState(0);

  // Custom dropdown visibility
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const sortRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        (!sortRef.current || !sortRef.current.contains(event.target))
      ) {
        setOpenDropdown(null);
      }
      if (locRef.current && !locRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setInputCity(locationParam);
    setIsTyping(false);
  }, [locationParam]);

  // Fetch suggestions when inputCity changes while typing
  useEffect(() => {
    const q = inputCity.trim();
    if (!isTyping || q.length < 2) {
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
    }, 150);

    return () => clearTimeout(timer);
  }, [inputCity, isTyping]);

  const handleCityChange = (e) => {
    const value = e.target.value;
    setInputCity(value);
    setIsTyping(true);
    if (value.trim().length < 2) {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  const submitCityChange = (newCityValue) => {
    setInputCity(newCityValue);
    setIsTyping(false);
    setShowSuggestions(false);
    setActiveIndex(-1);
    navigate(`/jobs?location=${encodeURIComponent(newCityValue.trim() || 'India')}`);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) {
      if (e.key === 'Enter') {
        submitCityChange(inputCity);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0) {
        submitCityChange(suggestions[activeIndex].value);
      } else {
        submitCityChange(inputCity);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  const categories = [
    'All Jobs',
    'Information Technology (IT)',
    'Engineering',
    'Healthcare',
    'Education',
    'Finance & Accounting',
    'Sales',
    'Marketing & Advertising',
    'Human Resources (HR)',
    'Customer Service',
    'Operations',
    'Manufacturing & Production',
    'Construction & Real Estate',
    'Legal',
    'Government & Public Administration',
    'Science & Research',
    'Media & Communications',
    'Design & Creative Arts',
    'Hospitality & Tourism',
    'Retail & E-commerce',
    'Transportation & Logistics',
    'Agriculture & Environmental',
    'Energy & Utilities',
    'Security & Law Enforcement',
    'Skilled Trades',
    'Consulting',
    'Nonprofit & Social Services',
    'Arts & Entertainment',
    'Telecommunications',
    'Biotechnology & Pharmaceuticals',
    'Freelance & Gig Economy'
  ];
  const jobTypes = ['Full-time', 'Part-time', 'Remote', 'Work from home', 'Contract', 'Internship'];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = viewMode === 'classifieds' ? 12 : 8;
  const [sortBy, setSortBy] = useState('newest');

  // Reset current page when the search location is changed
  useEffect(() => {
    setCurrentPage(1);
  }, [locationParam]);

  // Reset current page when the view mode is changed
  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  const activeJobsData = jobs.filter(j => j.status === 'Active');

  const filteredJobs = activeJobsData.filter(job => {
    // 1. Location filtering
    if (locationParam && locationParam.toLowerCase() !== 'india') {
      if (resolvedLocation && resolvedLocation.search_terms && resolvedLocation.search_terms.length > 0) {
        const matches = resolvedLocation.search_terms.some(term => 
          job.location.toLowerCase().includes(term.toLowerCase())
        );
        if (!matches) return false;
      } else {
        // Fallback to simple matching if API response hasn't loaded yet or is empty
        const queryTerms = locationParam.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
        const matches = queryTerms.every(term => 
          job.location.toLowerCase().includes(term)
        );
        if (!matches) return false;
      }
    }

    // 2. Category, Type, Salary filtering
    if (appliedCategories.length > 0 && !appliedCategories.includes('All Jobs') && !appliedCategories.includes(job.category)) return false;
    if (appliedTypes.length > 0 && !appliedTypes.includes(job.type)) return false;
    if (appliedSalary > 0 && (job.minSalary || 0) < appliedSalary) return false;
    return true;
  });


  const toggleCategory = (cat) => {
    if (cat === 'All Jobs') {
      setCategoriesSelected(prev =>
        prev.includes('All Jobs') ? [] : ['All Jobs']
      );
    } else {
      setCategoriesSelected(prev => {
        const filtered = prev.filter(c => c !== 'All Jobs');
        return filtered.includes(cat) ? filtered.filter(c => c !== cat) : [...filtered, cat];
      });
    }
  };

  const toggleType = (type) => {
    setTypesSelected(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const applyFilters = () => {
    setAppliedCategories(categoriesSelected);
    setAppliedTypes(typesSelected);
    setAppliedSalary(filterSalary);
    setOpenDropdown(null);
    setCurrentPage(1);
    
    // Only navigate and apply city filter on Apply Filters button click
    const targetCity = inputCity.trim() || 'India';
    if (targetCity !== locationParam) {
      navigate(`/jobs?location=${encodeURIComponent(targetCity)}`);
    }
  };

  const clearFilters = () => {
    setCategoriesSelected([]);
    setTypesSelected([]);
    setFilterSalary(0);
    setAppliedCategories([]);
    setAppliedTypes([]);
    setAppliedSalary(0);
    setOpenDropdown(null);
    setCurrentPage(1);
    setInputCity(locationParam); // Reset the input field to current URL location filter
  };

  const hasActiveFilters = appliedCategories.length > 0 || appliedTypes.length > 0 || appliedSalary > 0;
  const hasTempFilters = categoriesSelected.length > 0 || typesSelected.length > 0 || filterSalary > 0;

  const isFiltersChanged =
    categoriesSelected.length !== appliedCategories.length ||
    !categoriesSelected.every(c => appliedCategories.includes(c)) ||
    typesSelected.length !== appliedTypes.length ||
    !typesSelected.every(t => appliedTypes.includes(t)) ||
    filterSalary !== appliedSalary ||
    (inputCity.trim() || 'India').toLowerCase() !== locationParam.toLowerCase();

  const parseSalaryValue = (salaryStr) => {
    if (!salaryStr) return 0;
    const cleanStr = salaryStr.toLowerCase().replace(/,/g, '');
    
    // 1. Check for Lakh / L suffix (e.g. 12L or 12 Lakh)
    const lakhMatch = cleanStr.match(/(\d+(?:\.\d+)?)\s*(?:l|lakh|lac)/);
    if (lakhMatch) {
      const val = parseFloat(lakhMatch[1]) * 100000;
      if (cleanStr.includes('month') || cleanStr.includes('/mo') || cleanStr.includes('pm')) {
        return val * 12;
      }
      return val;
    }
    
    // 2. Otherwise extract the first number sequence
    const numberMatch = cleanStr.match(/\d+/);
    if (numberMatch) {
      let val = parseInt(numberMatch[0], 10);
      if (cleanStr.includes('month') || cleanStr.includes('/mo') || cleanStr.includes('pm') || cleanStr.includes('internship') || cleanStr.includes('stipend')) {
        if (val < 150000) {
          return val * 12;
        }
      }
      return val;
    }
    return 0;
  };

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'newest') {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateB - dateA;
    }
    if (sortBy === 'oldest') {
      const dateA = a.createdAt ? new Date(a.createdAt) : new Date(0);
      const dateB = b.createdAt ? new Date(b.createdAt) : new Date(0);
      return dateA - dateB;
    }
    if (sortBy === 'salary_desc') {
      return parseSalaryValue(b.salary) - parseSalaryValue(a.salary);
    }
    if (sortBy === 'salary_asc') {
      return parseSalaryValue(a.salary) - parseSalaryValue(b.salary);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedJobs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedJobs = sortedJobs.slice(startIndex, endIndex);

  const classifiedsData = paginatedJobs.map(job => ({
    category: job.category,
    subCategory: job.company,
    title: job.title,
    content: `${job.salary} — ${job.location}. ${job.description}`,
    isUrgent: job.isUrgent,
    isFeatured: job.isFeatured,
    whatsappNumber: job.whatsappNumber,
    reference_number: job.reference_number,
    postedDate: job.postedDate || 'Recently',
    classified_heading: job.classified_heading,
  }));

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in relative z-30">
          <div>
            <h2 className="mb-1">Jobs in {resolvedLocation ? resolvedLocation.display : locationParam}</h2>
            <p className="body-text text-slate-500">Showing {filteredJobs.length} open roles</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="bg-white border border-slate-200 rounded-lg p-1 flex items-center shadow-sm">
              <button 
                onClick={() => setViewMode('classifieds')}
                className={`px-3 py-1.5 text-xs font-bold tracking-wider rounded-md transition-colors ${viewMode === 'classifieds' ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Classifieds
              </button>
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-xs font-bold tracking-wider rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Cards
              </button>
              {/* <button 
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-xs font-bold tracking-wider rounded-md transition-colors ${viewMode === 'table' ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Table
              </button> */}
            </div>

            <div ref={sortRef} className="flex items-center gap-2 form-label relative">
              <span className="text-slate-500">Sort by:</span>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'sort' ? null : 'sort')}
                className="font-bold text-primary bg-transparent border-0 flex items-center gap-1 cursor-pointer outline-none hover:text-primary-hover transition-colors"
              >
                {sortBy === 'newest' && 'Newest First'}
                {sortBy === 'oldest' && 'Oldest First'}
                {sortBy === 'salary_desc' && 'Salary: High to Low'}
                {sortBy === 'salary_asc' && 'Salary: Low to High'}
                <ChevronDown size={16} className={`transition-transform ${openDropdown === 'sort' ? 'rotate-180' : ''}`} />
              </button>
              
              {openDropdown === 'sort' && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-xl p-1.5 z-30 animate-fade-in">
                  {[
                    { id: 'newest', label: 'Newest First' },
                    { id: 'oldest', label: 'Oldest First' },
                    { id: 'salary_desc', label: 'Salary: High to Low' },
                    { id: 'salary_asc', label: 'Salary: Low to High' }
                  ].map(option => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSortBy(option.id);
                        setOpenDropdown(null);
                        setCurrentPage(1); // Reset page on sort change
                      }}
                      className={`w-full text-left px-3.5 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer border-0 ${
                        sortBy === option.id 
                          ? 'bg-indigo-50 text-primary' 
                          : 'bg-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compact Horizontal Filter Bar (Custom UI) */}
        <div ref={dropdownRef} className="flex flex-wrap items-center gap-3 animate-fade-in [animation-delay:100ms] relative z-20">

          {/* Location Search Input */}
          <div ref={locRef} className="relative">
            <div className={`flex items-center gap-2 bg-white border rounded-full px-4 py-2 form-label shadow-sm transition-colors ${showSuggestions ? 'border-primary text-primary' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}>
              <MapPin size={16} className={showSuggestions ? 'text-primary' : 'text-slate-400'} />
              <input
                type="text"
                value={inputCity}
                onChange={handleCityChange}
                onKeyDown={handleKeyDown}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                placeholder="Search area, city or pincode..."
                className="bg-transparent border-none outline-none w-48 focus:w-56 transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden animate-fade-in max-h-72 overflow-y-auto">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => submitCityChange(suggestion.value)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`px-4 py-2.5 cursor-pointer flex items-center gap-3 transition-colors ${index === activeIndex ? 'bg-slate-100 text-primary' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <MapPin size={14} className={index === activeIndex ? 'text-primary' : 'text-slate-400'} />
                    <span className="text-xs font-semibold">{suggestion.display}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Custom Multi-select Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
              className={`flex items-center gap-2 bg-white border rounded-full px-4 py-2 form-label transition-colors shadow-sm ${openDropdown === 'category' || categoriesSelected.length > 0 ? 'border-primary text-primary' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}
            >
              Category {categoriesSelected.length > 0 && `(${categoriesSelected.length})`}
              <ChevronDown size={16} className={`transition-transform ${openDropdown === 'category' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'category' && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-slate-200 shadow-xl rounded-xl p-2 z-30 animate-fade-in max-h-[220px] overflow-y-auto">
                {categories.map(cat => (
                  <div
                    key={cat}
                    onClick={() => toggleCategory(cat)}
                    className="flex items-center gap-3 p-2.5 hover:bg-slate-50 cursor-pointer rounded-lg transition-colors"
                  >
                    <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${categoriesSelected.includes(cat) ? 'bg-primary border-primary text-white' : 'border-slate-300 bg-white'}`}>
                      {categoriesSelected.includes(cat) && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="form-label">{cat}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Job Type Custom Multi-select Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
              className={`flex items-center gap-2 bg-white border rounded-full px-4 py-2 form-label transition-colors shadow-sm ${openDropdown === 'type' || typesSelected.length > 0 ? 'border-primary text-primary' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}
            >
              Job Type {typesSelected.length > 0 && `(${typesSelected.length})`}
              <ChevronDown size={16} className={`transition-transform ${openDropdown === 'type' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'type' && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-200 shadow-xl rounded-xl p-2 z-30 animate-fade-in">
                {jobTypes.map(type => (
                  <div
                    key={type}
                    onClick={() => toggleType(type)}
                    className="flex items-center gap-3 p-2.5 hover:bg-slate-50 cursor-pointer rounded-lg transition-colors"
                  >
                    <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${typesSelected.includes(type) ? 'bg-primary border-primary text-white' : 'border-slate-300 bg-white'}`}>
                      {typesSelected.includes(type) && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span className="form-label">{type}</span>
                  </div>
                ))}
              </div>
            )}
          </div>



          {/* Apply Filters Button */}
          <button
            onClick={applyFilters}
            className={`flex items-center gap-1.5 border rounded-full px-4 py-2 form-label transition-all duration-200 ${
              isFiltersChanged
                ? 'bg-indigo-50 border-primary text-primary hover:bg-indigo-100 cursor-pointer shadow-sm shadow-indigo-100/50'
                : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            disabled={!isFiltersChanged}
          >
            <Filter size={14} />
            Apply Filters
          </button>

          {/* Clear Filters Button */}
          {(hasActiveFilters || hasTempFilters) && (
            <span
              onClick={clearFilters}
              className="flex items-center gap-1 text-slate-400 hover:text-red-500 cursor-pointer transition-colors form-label font-bold tracking-wider ml-2"
            >
              <FilterX size={16} />
              Clear
            </span>
          )}
        </div>

        {/* Jobs List */}
        <div className="animate-fade-in [animation-delay:200ms] relative z-10">
          {filteredJobs.length > 0 ? (
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedJobs.map((job) => (
                  <div key={job.id} className={`bg-white border rounded-xl p-5 flex flex-col hover:shadow-md transition-shadow group relative overflow-hidden h-full ${
                    job.isUrgent ? 'border-l-4 border-l-rose-500 border-slate-200 shadow-sm' : 'border-slate-200'
                  }`}>
                    {/* Top Badges Bar */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      {job.isUrgent && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-600 text-white uppercase tracking-wider animate-pulse shadow-sm">
                          <Flame size={11} className="fill-white" />
                          URGENT
                        </span>
                      )}
                      {job.isFeatured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white uppercase tracking-wider">
                          <Zap size={11} className="fill-white" />
                          FEATURED
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${job.iconBg || 'bg-indigo-50'} ${job.iconColor || 'text-indigo-600'}`}>
                        <Building2 size={24} />
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="meta-text font-medium text-[11px] bg-slate-50 px-2 py-1 rounded border border-slate-100 flex items-center gap-1">
                          <Calendar size={11} className="text-slate-400" />
                          {job.postedDate || 'Recently'}
                        </span>
                        {job.reference_number && (
                          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">{job.reference_number}</span>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <h4 className="job-title group-hover:text-primary transition-colors mb-1 line-clamp-2 leading-tight flex items-center justify-between">
                        <span>{job.title}</span>
                      </h4>
                      <p className="company-name tracking-wider line-clamp-1">{job.company}</p>
                    </div>

                    <p className="body-text text-sm text-slate-500 mb-5 flex-1">{job.description}</p>

                    <div className="space-y-2.5 mb-6 meta-text font-medium text-slate-600">
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-slate-400" /> <span className="truncate">{job.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <IndianRupee size={14} className="text-slate-400" /> <span className="truncate">{job.salary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate-400" /> <span className="truncate">{job.type}</span>
                      </div>
                    </div>

                    <div className="mt-auto">
                      <button
                        onClick={() => trackWhatsAppApply(job.id)}
                        className="bg-primary hover:bg-primary-hover text-white w-full py-2.5 rounded-lg transition-colors font-bold tracking-wide shadow-sm shadow-primary/20 text-sm border-0 cursor-pointer"
                      >
                        Apply Now
                      </button>
                    </div>

                  </div>
                ))}

              </div>
            ) : /* viewMode === 'table' ? (
              <div className="bg-white border border-slate-200 rounded-xl overflow-x-auto shadow-sm">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold tracking-wider text-slate-500">
                      <th className="p-4 rounded-tl-xl">Role & Posted</th>
                      <th className="p-4">Company</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Location</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Salary</th>
                      <th className="p-4 text-center rounded-tr-xl">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedJobs.map(job => (
                      <tr key={job.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-4">
                          <div className="flex flex-wrap items-center gap-1.5 mb-1">
                            <span className="font-bold text-slate-900">{job.title}</span>
                            {job.reference_number && (
                              <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-1 py-0.5 rounded border border-slate-200">{job.reference_number}</span>
                            )}
                            {job.isUrgent && (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-600 text-white uppercase tracking-wider animate-pulse">
                                URGENT
                              </span>
                            )}
                            {job.isFeatured && (
                              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-white uppercase tracking-wider">
                                FEATURED
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium tracking-wider flex items-center gap-1 mt-0.5">
                            <Calendar size={11} className="text-slate-400" />
                            {job.postedDate || 'Recently'}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-medium text-xs text-slate-700 tracking-wider">{job.company}</span>
                        </td>
                        <td className="p-4">
                          <span className="bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1 rounded text-[10px] font-bold tracking-wider">{job.category}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                            <MapPin size={14} className="text-slate-400" /> {job.location}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                            <Clock size={14} className="text-slate-400" /> {job.type}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                            <IndianRupee size={14} className="text-slate-400" /> {job.salary}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => trackWhatsAppApply(job.id)}
                            className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-bold text-[10px] tracking-wider transition-colors shadow-sm border-0 cursor-pointer"
                          >
                            Apply Now
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>


              </div>
            ) : */ (
              <ClassifiedsGrid listingsData={classifiedsData} columnsCount={4} density="high" />
            )
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
                <FilterX size={32} />
              </div>
              <h3 className="mb-2">No jobs found</h3>
              <p className="body-text text-slate-500 max-w-md">We couldn't find any positions matching your current filter criteria. Try adjusting your salary expectations or categories.</p>
              <span onClick={clearFilters} className="mt-6 text-primary cursor-pointer hover:underline form-label font-bold tracking-wider">Clear all filters</span>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm animate-fade-in">
              <span className="text-xs font-semibold text-slate-500">
                Showing <span className="text-slate-800">{Math.min(startIndex + 1, filteredJobs.length)}</span> to <span className="text-slate-800">{Math.min(endIndex, filteredJobs.length)}</span> of <span className="text-slate-800">{filteredJobs.length}</span> jobs
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                  if (totalPages > 5) {
                    if (pageNum !== 1 && pageNum !== totalPages && Math.abs(pageNum - currentPage) > 1) {
                      if (pageNum === 2 && currentPage > 3) return <span key={pageNum} className="text-slate-400 text-xs px-1">...</span>;
                      if (pageNum === totalPages - 1 && currentPage < totalPages - 2) return <span key={pageNum} className="text-slate-400 text-xs px-1">...</span>;
                      return null;
                    }
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        currentPage === pageNum
                          ? 'bg-primary text-white shadow-sm'
                          : 'border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SearchResults;
