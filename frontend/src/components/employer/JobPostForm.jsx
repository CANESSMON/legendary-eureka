import React, { useState } from 'react';
import { useJobs } from '../../context/JobContext';
import BuyCreditsModal from './BuyCreditsModal';
import { 
  Briefcase, MapPin, DollarSign, Tag, Sparkles, 
  Check, Eye, ArrowLeft, Building2, Flame, Zap, Phone, AlertCircle
} from 'lucide-react';

const CATEGORIES = [
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
const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Work from home', 'Contract', 'Internship'];

const JobPostForm = ({ initialJob = null, onCancel, onSuccess }) => {
  const { addJob, updateJob, employerProfile, fetchEmployerCredits } = useJobs();
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: initialJob?.title || '',
    company: initialJob?.company || employerProfile.companyName || '',
    location: initialJob?.location || employerProfile.city || '',
    salary: initialJob?.salary || '₹12L - ₹18L PA',
    type: initialJob?.type || 'Full-time',
    category: initialJob?.category || 'Information Technology (IT)',
    description: initialJob?.description || '',
    requirements: initialJob?.requirements || '',
    isUrgent: initialJob?.isUrgent ?? true,
    isFeatured: initialJob?.isFeatured ?? false,
    whatsappNumber: initialJob?.whatsappNumber || employerProfile.whatsappNumber || '',
    whatsappMessage: initialJob?.whatsappMessage || employerProfile.defaultMessage || 'Hi, I am interested in applying for {title} at {company} listed on JobPortal.',
    classified_heading: initialJob?.classified_heading || '',
    salary_min: initialJob?.salary_min || '',
    salary_max: initialJob?.salary_max || '',
    salary_period: initialJob?.salary_period || 'year'
  });

  const getSalaryPreview = () => {
    if (formData.salary_min && formData.salary_max) {
      if (formData.salary_period === 'month') {
        const formattedMin = parseInt(formData.salary_min).toLocaleString('en-IN');
        const formattedMax = parseInt(formData.salary_max).toLocaleString('en-IN');
        return `₹${formattedMin} - ₹${formattedMax} PM`;
      } else {
        return `₹${formData.salary_min}L - ₹${formData.salary_max}L PA`;
      }
    }
    return formData.salary || 'Salary Range';
  };

  const [activeTab, setActiveTab] = useState('split'); // 'split', 'form', 'preview'
  const [successBanner, setSuccessBanner] = useState(false);
  const [previewType, setPreviewType] = useState('card'); // 'card' or 'classified'

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const [errorBanner, setErrorBanner] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a Job Title');
      return;
    }
    const descWords = formData.description.trim() === '' ? 0 : formData.description.trim().split(/\s+/).length;
    if (descWords > 50) {
      setErrorBanner('Job description cannot exceed 50 words.');
      return;
    }
    setErrorBanner(null);

    try {
      if (initialJob) {
        await updateJob(initialJob.id, formData);
      } else {
        await addJob(formData);
      }

      setSuccessBanner(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 900);
    } catch (error) {
      if (error.message === 'CREDITS_EXHAUSTED' || error.status === 402) {
        setErrorBanner('CREDITS_EXHAUSTED');
      } else {
        setErrorBanner(error.message || 'Failed to save job posting');
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="pb-4 border-b border-slate-200/90">
        <h2 className="h2 text-slate-900">
          {initialJob ? 'Edit Job Posting' : 'Create New Job Posting'}
        </h2>
        <p className="body-text text-xs text-slate-500 font-medium mt-0.5">
          Draft job details, assign urgency title badges, and configure WhatsApp apply contact settings.
        </p>
      </div>

      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 font-semibold text-sm animate-fade-in">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          Job posting saved! Updated real-time on public job board.
        </div>
      )}

      {errorBanner && errorBanner === 'CREDITS_EXHAUSTED' ? (
        <div className="p-4 bg-indigo-50 border border-indigo-200 text-indigo-900 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-semibold text-sm animate-fade-in shadow-2xs">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0" />
            <div>
              <p className="font-bold text-slate-900">Post Limit Reached</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">You have exhausted your 3 free job posts. Purchase post credits to publish this job listing.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsBuyModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all border-0 shadow-sm shrink-0 cursor-pointer"
          >
            Buy Post Credits
          </button>
        </div>
      ) : errorBanner && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl flex items-center gap-3 font-semibold text-sm animate-fade-in">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          {errorBanner}
        </div>
      )}

      {/* Main Grid: Left Scrollable Form + Right Fixed/Sticky Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs space-y-6">
              
              {/* Basic Job Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 border-b border-slate-100 pb-2">
                  1. Basic Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Job Title <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-2.5 text-slate-400" size={16} />
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Senior React Developer"
                        required
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Company Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-2.5 text-slate-400" size={16} />
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Company Name"
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    Classified Heading <span className="text-slate-400 font-normal">(Optional, for Classified view only - e.g. "Wanted Accountant")</span>
                  </label>
                  <input
                    type="text"
                    name="classified_heading"
                    value={formData.classified_heading}
                    onChange={handleChange}
                    placeholder="e.g. WANTED ACCOUNTANT / WANTED RECEPTIONIST"
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900 bg-white"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Location
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 text-slate-400" size={16} />
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Bangalore / Remote"
                        className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Employment Type
                    </label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900 bg-white"
                    >
                      {JOB_TYPES.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Salary Range <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Minimum Salary
                      </label>
                      <input
                        type="number"
                        name="salary_min"
                        value={formData.salary_min}
                        onChange={handleChange}
                        placeholder={formData.salary_period === 'month' ? 'e.g. 20000' : 'e.g. 12'}
                        required
                        min="1"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Maximum Salary
                      </label>
                      <input
                        type="number"
                        name="salary_max"
                        value={formData.salary_max}
                        onChange={handleChange}
                        placeholder={formData.salary_period === 'month' ? 'e.g. 40000' : 'e.g. 18'}
                        required
                        min="1"
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Salary Period
                      </label>
                      <select
                        name="salary_period"
                        value={formData.salary_period}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900 bg-white"
                      >
                        <option value="year">Lakhs Per Annum (LPA)</option>
                        <option value="month">Rupees Per Month (PM)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Settings */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                  <Phone size={15} className="text-emerald-600" />
                  2. Direct WhatsApp Contact Setup
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                      WhatsApp Phone Number
                    </label>
                    <input
                      type="text"
                      name="whatsappNumber"
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                      className="w-full px-3 py-2 rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs font-bold text-emerald-950 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-950 mb-1">
                      WhatsApp Message Template
                    </label>
                    <input
                      type="text"
                      name="whatsappMessage"
                      value={formData.whatsappMessage}
                      onChange={handleChange}
                      placeholder="Hi, I am interested in applying for {title}..."
                      className="w-full px-3 py-2 rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs font-medium text-emerald-950 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Badges & Urgency Selector */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Tag size={15} className="text-primary" />
                  3. Assign Title Badges
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.isUrgent ? 'bg-rose-50 border-rose-300 shadow-2xs' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        name="isUrgent"
                        checked={formData.isUrgent}
                        onChange={handleChange}
                        className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                          <Flame size={14} className="text-rose-600 fill-rose-500" />
                          Mark as Urgent
                        </span>
                        <p className="text-[10px] text-rose-700/80 font-medium">Adds red urgency tag</p>
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.isFeatured ? 'bg-amber-50 border-amber-300 shadow-2xs' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
                      />
                      <div>
                        <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                          <Zap size={14} className="text-amber-600 fill-amber-500" />
                          Feature this Post
                        </span>
                        <p className="text-[10px] text-amber-800/80 font-medium">Highlights listing in search top results</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Description & Requirements */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 border-b border-slate-100 pb-2">
                  4. Role Overview & Requirements
                </h3>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Job Description <span className="text-rose-500">*</span>
                    </label>
                    <span className={`text-[10px] font-bold ${
                      (formData.description.trim() === '' ? 0 : formData.description.trim().split(/\s+/).length) > 50
                        ? 'text-rose-600'
                        : 'text-slate-400'
                    }`}>
                      {formData.description.trim() === '' ? 0 : formData.description.trim().split(/\s+/).length} / 50 words
                    </span>
                  </div>
                  <textarea
                    name="description"
                    rows={4}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe role responsibilities and overview (Max 50 words)..."
                    required
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Key Requirements & Skills
                  </label>
                  <textarea
                    name="requirements"
                    rows={3}
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="e.g. 3+ years React experience..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-xs font-medium text-slate-900"
                  ></textarea>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition-all text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold transition-all shadow-md shadow-primary/20 text-xs cursor-pointer flex items-center gap-1.5 border-0"
                >
                  <Sparkles size={15} />
                  {initialJob ? 'Save Changes' : 'Publish Job Post'}
                </button>
              </div>
            </form>
          </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Eye size={15} className="text-primary" />
                Live Candidate Preview
              </span>
              <div className="flex items-center gap-2 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => setPreviewType('card')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    previewType === 'card' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Card
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewType('classified')}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all cursor-pointer ${
                    previewType === 'classified' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Classified
                </button>
              </div>
            </div>

            {previewType === 'card' ? (
              /* Job Card Mockup */
              <div className="bg-white rounded-2xl border-2 border-primary/20 shadow-lg p-6 relative overflow-hidden transition-all">
                {formData.isUrgent && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-red-600 to-amber-500"></div>
                )}

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {formData.isUrgent && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white shadow-2xs">
                      <Flame size={12} className="fill-white" />
                      Urgent Hiring
                    </span>
                  )}
                  {formData.isFeatured && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                      <Zap size={12} className="fill-white" />
                      Featured
                    </span>
                  )}
                  <span className="meta-text inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {formData.category || 'Category'}
                  </span>
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="job-title text-slate-900 line-clamp-2 text-base">
                      {formData.title || 'Job Title'}
                    </h3>
                    <p className="company-name text-xs font-semibold text-slate-600 flex items-center gap-1 mt-1">
                      <Building2 size={14} className="text-slate-400" />
                      {formData.company || 'Company Name'}
                    </p>
                  </div>
                </div>

                <div className="meta-text flex flex-wrap gap-3 my-4 py-2.5 border-y border-slate-100 text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-1">
                    <MapPin size={13} className="text-slate-400" />
                    <span>{formData.location || 'Job Location'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Briefcase size={13} className="text-slate-400" />
                    <span>{formData.type || 'Full-time'}</span>
                  </div>
                  <div className="flex items-center gap-1 font-bold text-slate-900">
                    <DollarSign size={13} className="text-emerald-600" />
                    <span>{getSalaryPreview()}</span>
                  </div>
                </div>

                <p className="body-text text-xs text-slate-600 leading-relaxed mb-4">
                  {formData.description || 'Fill in form fields to preview candidate card...'}
                </p>

                {/* Apply Button & Message Preview */}
                <div className="pt-2">
                  <button
                    type="button"
                    disabled
                    className="w-full bg-primary text-white font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-xs shadow-md shadow-primary/30 cursor-not-allowed opacity-95"
                  >
                    Apply Now
                  </button>
                  <p className="text-[10px] text-slate-500 text-center mt-2 font-medium italic bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                    WhatsApp message sent to employer ({formData.whatsappNumber || 'Phone Number'}):<br/>
                    <strong className="text-slate-800 not-italic">
                      "{ (formData.whatsappMessage || '')
                          .replace(/\[Job Title\]/gi, formData.title || 'Job Title')
                          .replace(/\{Job Title\}/gi, formData.title || 'Job Title')
                          .replace(/\[title\]/gi, formData.title || 'Job Title')
                          .replace(/\{title\}/gi, formData.title || 'Job Title')
                          .replace(/\[Company Name\]/gi, formData.company || 'Company Name')
                          .replace(/\{Company Name\}/gi, formData.company || 'Company Name')
                          .replace(/\[company\]/gi, formData.company || 'Company Name')
                          .replace(/\{company\}/gi, formData.company || 'Company Name')
                       }"
                    </strong>
                  </p>
                </div>
              </div>
            ) : (
              /* Classified Ad Block Mockup */
              <div className="bg-slate-50 rounded-2xl border-2 border-primary/20 shadow-lg p-6 relative overflow-hidden transition-all bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px] flex flex-col items-center">
                <div className="border border-slate-400 bg-white shadow-sm overflow-hidden w-full max-w-sm">
                  {/* Category Header */}
                  <div className="bg-slate-900 text-white font-bold text-[10px] tracking-widest text-center py-1.5 uppercase">
                    {formData.classified_heading || formData.category || 'Category'}
                  </div>
                  
                  {/* Classified Item */}
                  <div className="p-3 text-[11px] leading-tight border-b border-slate-200 last:border-b-0 bg-white relative pb-6">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-black text-[12px] text-slate-900 leading-tight pr-2 uppercase">{formData.title || 'JOB TITLE'}</span>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {formData.isUrgent && <span className="text-white bg-rose-600 px-1 py-0.5 text-[8px] font-black rounded-xs">URGENT</span>}
                        {formData.isFeatured && <span className="text-white bg-amber-500 px-1 py-0.5 text-[8px] font-bold rounded-xs">FEATURED</span>}
                      </div>
                    </div>
                    {formData.company && (
                      <p className="text-[9px] font-bold text-slate-500 tracking-wider mb-1 uppercase">{formData.company}</p>
                    )}
                    

                    <p className="text-slate-800 text-justify">
                      <span className="font-bold mr-1">
                        {getSalaryPreview()} — {formData.location || 'Location'}.
                      </span>
                      {formData.description || 'Fill in form details to preview this job posting in the newspaper-style classified grid...'}
                    </p>

                    <div className="mt-2 flex items-center justify-between absolute bottom-1 left-3 right-3">
                      <span className="text-[9px] font-bold text-primary">
                        Apply Now &rarr;
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 text-center mt-4 font-medium italic bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-2xs">
                  Newspaper-style classified view card preview. This represents how this listing is formatted and grouped in the smart columns layout.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BuyCreditsModal 
        isOpen={isBuyModalOpen} 
        onClose={() => setIsBuyModalOpen(false)} 
        onSuccess={() => {
          setIsBuyModalOpen(false);
          setErrorBanner(null);
          fetchEmployerCredits();
        }} 
      />
    </div>
  );
};

export default JobPostForm;

