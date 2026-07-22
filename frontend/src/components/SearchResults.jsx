import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Building2, MapPin, IndianRupee, Clock, ChevronDown, FilterX, Check, Filter
} from 'lucide-react';
import citiesData from '../data/cities.json';
import ClassifiedsGrid from './ClassifiedsGrid';
import { mockJobs } from '../data/mockJobs';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const city = searchParams.get('city') || 'India';
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'classifieds'

  // Location Autocomplete state
  const [inputCity, setInputCity] = useState(city);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
      if (locRef.current && !locRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setInputCity(city);
  }, [city]);

  const handleCityChange = (e) => {
    const value = e.target.value;
    setInputCity(value);
    if (value.trim().length > 0) {
      const filtered = citiesData.filter(c =>
        c.toLowerCase().startsWith(value.toLowerCase())
      ).slice(0, 8);
      setSuggestions(filtered);
      setShowSuggestions(true);
      setActiveIndex(-1);
    } else {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  const submitCityChange = (newCity) => {
    setInputCity(newCity);
    setShowSuggestions(false);
    setActiveIndex(-1);
    if (newCity.trim() && newCity.trim() !== city) {
      navigate(`/jobs?city=${encodeURIComponent(newCity.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) {
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
        submitCityChange(suggestions[activeIndex]);
      } else {
        submitCityChange(inputCity);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  const categories = ['IT', 'Healthcare', 'Marketing', 'Finance', 'Sales', 'Others'];
  const jobTypes = ['Full-time', 'Contract', 'Remote', 'Internship'];

  const jobsData = mockJobs.map(job => ({
    ...job,
    location: job.location.toLowerCase().includes(city.toLowerCase()) || city === 'India' 
      ? job.location 
      : `${job.location}, ${city}`
  }));

  const filteredJobs = jobsData.filter(job => {
    if (appliedCategories.length > 0 && !appliedCategories.includes(job.category)) return false;
    if (appliedTypes.length > 0 && !appliedTypes.includes(job.type)) return false;
    if (appliedSalary > 0 && job.minSalary < appliedSalary) return false;
    return true;
  });

  const toggleCategory = (cat) => {
    setCategoriesSelected(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
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
  };

  const clearFilters = () => {
    setCategoriesSelected([]);
    setTypesSelected([]);
    setFilterSalary(0);
    setAppliedCategories([]);
    setAppliedTypes([]);
    setAppliedSalary(0);
    setOpenDropdown(null);
  };

  const hasActiveFilters = appliedCategories.length > 0 || appliedTypes.length > 0 || appliedSalary > 0;
  const hasTempFilters = categoriesSelected.length > 0 || typesSelected.length > 0 || filterSalary > 0;

  const isFiltersChanged =
    categoriesSelected.length !== appliedCategories.length ||
    !categoriesSelected.every(c => appliedCategories.includes(c)) ||
    typesSelected.length !== appliedTypes.length ||
    !typesSelected.every(t => appliedTypes.includes(t)) ||
    filterSalary !== appliedSalary;

  const classifiedsData = filteredJobs.map(job => ({
    category: job.category,
    subCategory: job.company,
    title: job.title,
    content: `${job.salary} — ${job.location}. ${job.description}`,
    isUrgent: job.id % 3 === 0,
  }));

  return (
    <div className="bg-slate-50 min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 animate-fade-in">
          <div>
            <h2 className="mb-1">Jobs in {city}</h2>
            <p className="body-text text-slate-500">Showing {filteredJobs.length} open roles</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* View Toggle */}
            <div className="bg-white border border-slate-200 rounded-lg p-1 flex items-center shadow-sm">
              <button 
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-xs font-bold tracking-wider rounded-md transition-colors ${viewMode === 'grid' ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Cards
              </button>
              <button 
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 text-xs font-bold tracking-wider rounded-md transition-colors ${viewMode === 'table' ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Table
              </button>
              <button 
                onClick={() => setViewMode('classifieds')}
                className={`px-3 py-1.5 text-xs font-bold tracking-wider rounded-md transition-colors ${viewMode === 'classifieds' ? 'bg-primary text-white shadow' : 'text-slate-500 hover:text-slate-800'}`}
              >
                Classifieds
              </button>
            </div>

            <div className="flex items-center gap-2 form-label">
              <span className="text-slate-500">Sort by:</span>
              <span className="font-semibold text-primary flex items-center gap-1 cursor-pointer">
                Newest First <ChevronDown size={16} />
              </span>
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
                placeholder="Search city..."
                className="bg-transparent border-none outline-none w-24 sm:w-32 focus:w-40 transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl z-30 overflow-hidden animate-fade-in">
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    onClick={() => submitCityChange(suggestion)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`px-4 py-2.5 cursor-pointer flex items-center gap-3 transition-colors ${index === activeIndex ? 'bg-slate-100 text-primary' : 'hover:bg-slate-50 text-slate-700'}`}
                  >
                    <MapPin size={14} className={index === activeIndex ? 'text-primary' : 'text-slate-400'} />
                    <span className="form-label">{suggestion}</span>
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
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-slate-200 shadow-xl rounded-xl p-2 z-30 animate-fade-in">
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

          {/* Salary Custom Dropdown */}
          <div className="relative">
            <button
              onClick={() => setOpenDropdown(openDropdown === 'salary' ? null : 'salary')}
              className={`flex items-center gap-2 bg-white border rounded-full px-4 py-2 form-label transition-colors shadow-sm ${openDropdown === 'salary' || filterSalary > 0 ? 'border-primary text-primary' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}
            >
              Min Salary {filterSalary > 0 && `(₹${filterSalary}L+)`}
              <ChevronDown size={16} className={`transition-transform ${openDropdown === 'salary' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'salary' && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 shadow-xl rounded-xl p-5 z-30 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <span className="form-label text-slate-500">Minimum Expected</span>
                  <span className="form-label font-bold text-primary">{filterSalary > 0 ? `₹${filterSalary}L+` : 'Any'}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={filterSalary}
                  onChange={(e) => setFilterSalary(Number(e.target.value))}
                  className="w-full accent-primary mb-2"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400 tracking-wider">
                  <span>Any</span>
                  <span>₹20L+</span>
                </div>
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
                {filteredJobs.map((job) => (
                  <div key={job.id} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col hover:shadow-md transition-shadow group relative overflow-hidden h-full">

                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${job.iconBg} ${job.iconColor}`}>
                        <Building2 size={24} />
                      </div>
                      <span className="meta-text font-medium text-[11px] bg-slate-50 px-2 py-1 rounded border border-slate-100">{job.time}</span>
                    </div>

                    <div className="mb-3">
                      <h4 className="job-title group-hover:text-primary transition-colors mb-1 line-clamp-2 leading-tight">{job.title}</h4>
                      <p className="company-name tracking-wider line-clamp-1">{job.company}</p>
                    </div>

                    <p className="body-text text-sm text-slate-500 mb-5 line-clamp-3 flex-1">{job.description}</p>

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
                      <button className="bg-primary hover:bg-primary-hover text-white w-full py-2.5 rounded-lg transition-colors font-bold tracking-wide shadow-sm shadow-primary/20 text-sm">
                        Apply Now
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            ) : viewMode === 'table' ? (
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
                    {filteredJobs.map(job => (
                      <tr key={job.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="p-4">
                          <div className="font-bold text-slate-900 mb-0.5">{job.title}</div>
                          <div className="text-[10px] text-slate-500 font-medium tracking-wider">{job.time}</div>
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
                          <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-bold text-[10px] tracking-wider transition-colors shadow-sm">
                            Apply
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
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

          {filteredJobs.length > 0 && (
            <div className="mt-8 text-center">
              <span className="px-8 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors inline-block cursor-pointer form-label font-bold tracking-wider">
                Load More Listings
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default SearchResults;
