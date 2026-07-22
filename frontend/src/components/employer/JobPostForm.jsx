import React, { useState } from 'react';
import { useJobs } from '../../context/JobContext';
import { 
  Briefcase, MapPin, DollarSign, Tag, Sparkles, 
  Check, Eye, ArrowLeft, Building2, Flame, Zap, Phone, MessageSquare
} from 'lucide-react';

const CATEGORIES = ['IT', 'Healthcare', 'Finance', 'Accounts', 'Marketing', 'Sales', 'Engineering', 'Real Estate', 'Education', 'Logistics', 'Legal', 'Design', 'Others'];
const JOB_TYPES = ['Full-time', 'Part-time', 'Remote', 'Contract', 'Internship'];

const JobPostForm = ({ initialJob = null, onCancel, onSuccess }) => {
  const { addJob, updateJob, employerProfile } = useJobs();

  const [formData, setFormData] = useState({
    title: initialJob?.title || '',
    company: initialJob?.company || employerProfile.companyName || 'TECH SOLUTIONS',
    location: initialJob?.location || employerProfile.city || 'Bangalore',
    salary: initialJob?.salary || '₹12L - ₹18L PA',
    type: initialJob?.type || 'Full-time',
    category: initialJob?.category || 'IT',
    description: initialJob?.description || '',
    requirements: initialJob?.requirements || '',
    isUrgent: initialJob?.isUrgent ?? true,
    isFeatured: initialJob?.isFeatured ?? false,
    whatsappNumber: initialJob?.whatsappNumber || employerProfile.whatsappNumber || '+919876543210',
    whatsappMessage: initialJob?.whatsappMessage || employerProfile.defaultMessage || 'Hi, I am interested in applying for {title} at {company} listed on JobPortal.'
  });


  const [activeTab, setActiveTab] = useState('split');
  const [successBanner, setSuccessBanner] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a Job Title');
      return;
    }

    if (initialJob) {
      updateJob(initialJob.id, formData);
    } else {
      addJob(formData);
    }

    setSuccessBanner(true);
    setTimeout(() => {
      if (onSuccess) onSuccess();
    }, 900);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 mb-2 bg-transparent border-0 cursor-pointer"
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </button>
          <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
            <Sparkles className="text-primary" size={24} />
            {initialJob ? 'Edit Job Posting' : 'Create New Job Posting'}
          </h2>
          <p className="text-sm text-slate-500 font-medium">
            Set custom WhatsApp apply contact numbers, urgency badges, and live preview.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('split')}
            className={`px-3 py-1.5 rounded-lg transition-all border-0 cursor-pointer ${
              activeTab === 'split' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Split View
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`px-3 py-1.5 rounded-lg transition-all border-0 cursor-pointer ${
              activeTab === 'form' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Form Only
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg transition-all border-0 cursor-pointer ${
              activeTab === 'preview' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Live Preview
          </button>
        </div>
      </div>

      {successBanner && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 font-semibold text-sm animate-fade-in">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          Job posting saved! WhatsApp redirection link updated in real-time.
        </div>
      )}

      {/* Main Grid */}
      <div className={`grid gap-8 ${
        activeTab === 'split' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'
      }`}>
        {/* Form Column */}
        {(activeTab === 'split' || activeTab === 'form') && (
          <div className={`${activeTab === 'split' ? 'lg:col-span-7' : ''} space-y-6`}>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
              
              {/* Job Title & Company */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Job Title <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Senior React Developer"
                      required
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Company Name
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company Name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Category, Location, Employment Type */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Category
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-900 bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="e.g. Bangalore / Remote"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    Employment Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-900 bg-white"
                  >
                    {JOB_TYPES.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Salary Range */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Salary Range
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g. ₹15L - ₹25L PA"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-900"
                  />
                </div>
              </div>

              {/* WHATSAPP CONTACT REDIRECTION SETTINGS */}
              <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-4">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-emerald-900">
                  <Phone size={15} className="text-emerald-600" />
                  Direct WhatsApp Contact & Redirection Setup
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-900 mb-1">
                      Employer WhatsApp Number
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
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-emerald-900 mb-1">
                      WhatsApp Pre-filled Message
                    </label>
                    <input
                      type="text"
                      name="whatsappMessage"
                      value={formData.whatsappMessage}
                      onChange={handleChange}
                      placeholder="Message candidate will send..."
                      className="w-full px-3 py-2 rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs font-medium text-emerald-950 bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* BADGES & TITLE TAGS SECTION */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-900">
                  <Tag size={15} className="text-primary" />
                  Assign Special Badges & Urgency Titles
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.isUrgent ? 'bg-rose-50 border-rose-300 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        name="isUrgent"
                        checked={formData.isUrgent}
                        onChange={handleChange}
                        className="w-4 h-4 text-rose-600 rounded focus:ring-rose-500"
                      />
                      <div>
                        <span className="text-sm font-extrabold text-rose-900 flex items-center gap-1.5">
                          <Flame size={15} className="text-rose-600 fill-rose-500" />
                          Mark as URGENT
                        </span>
                        <p className="text-[11px] text-rose-700/80 font-medium">Adds glowing red urgency tag</p>
                      </div>
                    </div>
                  </label>

                  <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    formData.isFeatured ? 'bg-amber-50 border-amber-300 shadow-sm' : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        name="isFeatured"
                        checked={formData.isFeatured}
                        onChange={handleChange}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                      />
                      <div>
                        <span className="text-sm font-extrabold text-amber-900 flex items-center gap-1.5">
                          <Zap size={15} className="text-amber-600 fill-amber-500" />
                          Feature this Post
                        </span>
                        <p className="text-[11px] text-amber-800/80 font-medium">Highlights listing in search top results</p>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Job Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe role details and job responsibilities..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-900"
                ></textarea>
              </div>

              {/* Key Requirements */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Key Requirements & Skills
                </label>
                <textarea
                  name="requirements"
                  rows={3}
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="e.g. 3+ years experience, good communication..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm font-medium text-slate-900"
                ></textarea>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-6 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-700 hover:bg-slate-50 transition-all text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-bold transition-all shadow-lg shadow-primary/30 text-sm cursor-pointer flex items-center gap-2 border-0"
                >
                  <Sparkles size={16} />
                  {initialJob ? 'Save Changes' : 'Publish Job Post'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Live Preview Column */}
        {(activeTab === 'split' || activeTab === 'preview') && (
          <div className={`${activeTab === 'split' ? 'lg:col-span-5' : ''} space-y-4`}>
            <div className="sticky top-24 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Eye size={16} className="text-primary" />
                  Live Candidate Card Preview
                </span>
                <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">
                  Real-time WhatsApp sync
                </span>
              </div>

              {/* Job Card Mockup */}
              <div className="bg-white rounded-2xl border-2 border-primary/20 shadow-xl p-6 relative overflow-hidden transition-all">
                {formData.isUrgent && (
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose-500 via-red-600 to-amber-500"></div>
                )}

                <div className="flex flex-wrap items-center gap-2 mb-3">
                  {formData.isUrgent && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-extrabold bg-rose-600 text-white uppercase tracking-wide animate-pulse">
                      <Flame size={13} className="fill-white" />
                      URGENT HIRING
                    </span>
                  )}
                  {formData.isFeatured && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white uppercase tracking-wide">
                      <Zap size={13} className="fill-white" />
                      FEATURED
                    </span>
                  )}
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {formData.category || 'Category'}
                  </span>
                </div>

                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 line-clamp-2">
                      {formData.title || 'Senior React Developer'}
                    </h3>
                    <p className="text-sm font-semibold text-slate-600 flex items-center gap-1.5 mt-1">
                      <Building2 size={15} className="text-slate-400" />
                      {formData.company || 'TECH SOLUTIONS'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 my-4 py-3 border-y border-slate-100 text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400" />
                    <span>{formData.location || 'Bangalore'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase size={14} className="text-slate-400" />
                    <span>{formData.type || 'Full-time'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <DollarSign size={14} className="text-emerald-600" />
                    <span>{formData.salary || '₹15L - ₹25L PA'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
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
                  <p className="text-[10px] text-slate-500 text-center mt-1.5 font-medium italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                    WhatsApp message sent to employer ({formData.whatsappNumber}):<br/>
                    <strong className="text-slate-800 not-italic">
                      "{ (formData.whatsappMessage || '')
                          .replace(/\[Job Title\]/gi, formData.title || 'Senior React Developer')
                          .replace(/\{Job Title\}/gi, formData.title || 'Senior React Developer')
                          .replace(/\[title\]/gi, formData.title || 'Senior React Developer')
                          .replace(/\{title\}/gi, formData.title || 'Senior React Developer')
                          .replace(/\[Company Name\]/gi, formData.company || 'TECH SOLUTIONS')
                          .replace(/\{Company Name\}/gi, formData.company || 'TECH SOLUTIONS')
                          .replace(/\[company\]/gi, formData.company || 'TECH SOLUTIONS')
                          .replace(/\{company\}/gi, formData.company || 'TECH SOLUTIONS')
                       }"
                    </strong>
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobPostForm;
